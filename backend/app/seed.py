# app/seed.py
from .db import SessionLocal, engine, Base
from .models import Product

Base.metadata.create_all(bind=engine)

products = [
    {
        "name": "Minimalist Tee",
        "slug": "minimalist-tee",
        "price": 19.99,
        "image_url": "/products/minimalist-tee.jpg",
        "description": "Soft cotton t-shirt in a clean minimalist cut.",
        "category": "Apparel",
    },
    {
        "name": "Focus Mug",
        "slug": "focus-mug",
        "price": 12.50,
        "image_url": "/products/focus-mug.jpg",
        "description": "Ceramic mug for deep work sessions.",
        "category": "Accessories",
    },
    {
        "name": "Vintage Camera",
        "slug": "vintage-camera",
        "price": 34.99,
        "image_url": "/products/vintage-camera.jpg",
        "description": "Retro-style camera decoration piece.",
        "category": "Decor",
    },
    {
        "name": "Adventure Backpack",
        "slug": "adventure-backpack",
        "price": 49.99,
        "image_url": "/products/adventure-backpack.jpg",
        "description": "Durable backpack for daily carry.",
        "category": "Gear",
    },
    {
        "name": "Desk Plant",
        "slug": "desk-plant",
        "price": 15.00,
        "image_url": "/products/desk-plant.jpg",
        "description": "Low-maintenance plant for your workspace.",
        "category": "Decor",
    },
    {
        "name": "Leather Journal",
        "slug": "leather-journal",
        "price": 22.00,
        "image_url": "/products/leather-journal.jpg",
        "description": "Handcrafted journal for notes and sketches.",
        "category": "Stationery",
    },
]

def run():
    db = SessionLocal()
    try:
        for data in products:
            existing = db.query(Product).filter_by(slug=data["slug"]).first()

            if existing:
                existing.name = data["name"]
                existing.description = data["description"]
                existing.price = data["price"]
                existing.category = data["category"]
                existing.image_url = data["image_url"]
                existing.in_stock = data.get("in_stock", existing.in_stock)
                print(f"Updated product: {existing.slug}")
            else:
                product = Product(
                    name=data["name"],
                    slug=data["slug"],
                    price=data["price"],
                    image_url=data.get("image_url"),
                    description=data.get("description", ""),
                    category=data.get("category", ""),
                    in_stock=data.get("in_stock", True),
                )
                db.add(product)
                print(f"Created product: {product.slug}")

        db.commit()
        print("Seed completed.")
    finally:
        db.close()

if __name__ == "__main__":
    run()
