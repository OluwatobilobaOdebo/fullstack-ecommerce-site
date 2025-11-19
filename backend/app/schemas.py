# app/schemas.py
from pydantic import BaseModel

class ProductBase(BaseModel):
    name: str
    slug: str
    price: float
    image_url: str | None = None
    description: str | None = None
    category: str | None = None
    in_stock: bool = True

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int

    class Config:
        orm_mode = True

class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int


class OrderCreate(BaseModel):
    email: str
    items: list[OrderItemCreate]


class Order(BaseModel):
    id: int
    email: str
    total: float

    class Config:
        orm_mode = True
