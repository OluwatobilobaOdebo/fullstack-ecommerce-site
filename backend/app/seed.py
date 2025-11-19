# app/seed.py
from .db import SessionLocal, engine, Base
from . import models

Base.metadata.create_all(bind=engine)

products_seed = [
    {
        "name": "Minimalist Tee",
        "slug": "minimalist-tee",
        "price": 19.99,
        "image_url": "https://picsum.photos/seed/tee/400/400",
        "description": "Soft cotton t-shirt in a clean minimalist cut.",
        "category": "Apparel",
    },
    {
        "name": "Focus Mug",
        "slug": "focus-mug",
        "price": 12.5,
        "image_url": "https://picsum.photos/seed/mug/400/400",
        "description": "Ceramic mug for deep work sessions.",
        "category": "Accessories",
    },
]

def run():
    db = SessionLocal()
    try:
        # only seed if table is empty
        count = db.query(models.Product).count()
        if count == 0:
            for p in products_seed:
                db.add(models.Product(**p))
            db.commit()
            print("Seeded products table.")
        else:
            print("Products already exist, skipping seed.")
    finally:
        db.close()

if __name__ == "__main__":
    run()
