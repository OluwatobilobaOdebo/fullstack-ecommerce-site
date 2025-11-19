"use client";

export type CartItem = {
  id: number;
  name: string;
  slug: string;
  price: number;
  image_url?: string;
  quantity: number;
};

const STORAGE_KEY = "portfolio_cart";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as CartItem[];
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function addToCart(item: Omit<CartItem, "quantity">, qty: number = 1) {
  const cart = getCart();
  const existing = cart.find((c) => c.id === item.id);
  if (existing) {
    existing.quantity += qty;
  } else {
    cart.push({ ...item, quantity: qty });
  }
  saveCart(cart);
  return cart;
}

export function updateQuantity(id: number, quantity: number) {
  const cart = getCart();
  const updated = cart.map((item) =>
    item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
  );
  saveCart(updated);
  return updated;
}

export function removeFromCart(id: number) {
  const cart = getCart();
  const filtered = cart.filter((item) => item.id !== id);
  saveCart(filtered);
  return filtered;
}

export function clearCart() {
  saveCart([]);
}
