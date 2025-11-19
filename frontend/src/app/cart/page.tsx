"use client";

import { useEffect, useState } from "react";
import type { CartItem } from "@/components/cartStorage";
import {
  getCart,
  updateQuantity,
  removeFromCart,
  clearCart,
} from "@/components/cartStorage";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setItems(getCart());
  }, []);

  const handleQtyChange = (id: number, value: string) => {
    const qty = parseInt(value, 10);
    if (Number.isNaN(qty) || qty <= 0) return;
    const updated = updateQuantity(id, qty);
    setItems(updated);
  };

  const handleRemove = (id: number) => {
    const updated = removeFromCart(id);
    setItems(updated);
  };

  const handleCheckout = async () => {
    setMessage(null);
    setError(null);

    if (!email.trim()) {
      setError("Please enter an email address.");
      return;
    }

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setLoading(true);

    try {
      const base = process.env.NEXT_PUBLIC_API_BASE;
      const response = await fetch(`${base}/orders/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          items: items.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || "Failed to place order.");
      }

      const order = await response.json();
      console.log("Order created:", order);

      clearCart();
      setItems([]);
      setMessage(`Order #${order.id} placed successfully!`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong during checkout.");
    } finally {
      setLoading(false);
    }
  };

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <a href="/" className="text-blue-600 text-sm mb-4 inline-block">
          ← Back to products
        </a>

        <h1 className="text-3xl font-bold mb-2">Your cart</h1>

        {message && <p className="text-sm text-green-600 mb-2">{message}</p>}
        {error && items.length === 0 && (
          <p className="text-sm text-red-600 mb-2">{error}</p>
        )}

        {items.length === 0 ? (
          <p className="text-gray-600">
            Your cart is empty. Add something from the home page.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-sm p-4 flex gap-4"
                >
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-md"
                    />
                  )}
                  <div className="flex-1">
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-sm text-gray-500 mb-2">
                      ${item.price.toFixed(2)}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <label htmlFor={`qty-${item.id}`}>Qty:</label>
                      <input
                        id={`qty-${item.id}`}
                        type="number"
                        min={1}
                        className="w-16 border rounded px-2 py-1 text-sm"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQtyChange(item.id, e.target.value)
                        }
                      />
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="ml-4 text-red-600 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="bg-white rounded-xl shadow-sm p-4 h-fit">
              <h2 className="text-xl font-semibold mb-4">Summary</h2>
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-500 mb-4">
                This is a portfolio demo — no real payments are processed.
              </p>

              <div className="mb-3">
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="checkout-email"
                >
                  Email for order confirmation
                </label>
                <input
                  id="checkout-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border rounded px-2 py-1 text-sm"
                  placeholder="you@example.com"
                />
              </div>

              {error && items.length > 0 && (
                <p className="text-xs text-red-600 mb-2">{error}</p>
              )}

              <button
                className="w-full rounded-lg bg-black text-white py-2 text-sm font-medium disabled:opacity-60"
                onClick={handleCheckout}
                disabled={loading || items.length === 0}
              >
                {loading ? "Placing order..." : "Checkout"}
              </button>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
