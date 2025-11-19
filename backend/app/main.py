from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .db import Base, engine
from . import models
from .routes import products as products_routes
from .routes import orders as orders_routes

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Portfolio E-commerce API")

# CORS – allow frontend (Next.js dev) to call the API
origins = [
    # local dev
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://localhost:3000",

    # deployed frontend on Vercel
    "https://fullstack-ecommerce-site-tawny.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(products_routes.router)
app.include_router(orders_routes.router)

@app.get("/health")
def health_check():
    return {"status": "ok"}
