# app/routes/orders.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..db import get_db
from .. import models, schemas

router = APIRouter(prefix="/orders", tags=["orders"])


@router.post("/", response_model=schemas.Order)
def create_order(order_in: schemas.OrderCreate, db: Session = Depends(get_db)):
    if not order_in.items:
        raise HTTPException(status_code=400, detail="Order must contain at least one item")

    product_ids = [item.product_id for item in order_in.items]
    products = (
        db.query(models.Product)
        .filter(models.Product.id.in_(product_ids))
        .all()
    )

    if len(products) != len(product_ids):
        raise HTTPException(status_code=400, detail="One or more products do not exist")

    # Create the order
    total = 0.0
    db_order = models.Order(email=order_in.email, total=0.0)
    db.add(db_order)
    db.flush()  # get db_order.id

    for item in order_in.items:
        prod = next(p for p in products if p.id == item.product_id)
        line_total = prod.price * item.quantity
        total += line_total

        db_item = models.OrderItem(
            order_id=db_order.id,
            product_id=prod.id,
            product_name=prod.name,
            quantity=item.quantity,
            price=prod.price,
        )
        db.add(db_item)

    db_order.total = total
    db.commit()
    db.refresh(db_order)

    return db_order


@router.get("/", response_model=list[schemas.Order])
def list_orders(db: Session = Depends(get_db)):
    """Simple list for debugging (not authenticated, fine for portfolio demo)."""
    orders = db.query(models.Order).all()
    return orders
