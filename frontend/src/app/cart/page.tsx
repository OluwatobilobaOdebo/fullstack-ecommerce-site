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

  const handleQtyChange = (id: number, delta: number) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    
    const newQty = item.quantity + delta;
    if (newQty < 1) return;
    
    const updated = updateQuantity(id, newQty);
    setItems(updated);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleRemove = (id: number) => {
    const updated = removeFromCart(id);
    setItems(updated);
    window.dispatchEvent(new Event("cartUpdated"));
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
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Something went wrong during checkout.");
    } finally {
      setLoading(false);
    }
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[var(--color-stone)] mb-8 animate-fade-in">
          <a href="/" className="hover:text-[var(--color-terracotta)] transition-colors">
            Home
          </a>
          <span>/</span>
          <span className="text-[var(--color-espresso)]">Cart</span>
        </nav>

        {/* Header */}
        <div className="flex items-center justify-between mb-10 animate-fade-in-up">
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold text-[var(--color-espresso)]">
            Your Cart
          </h1>
          {items.length > 0 && (
            <span className="text-[var(--color-stone)]">
              {items.length} {items.length === 1 ? "item" : "items"}
            </span>
          )}
        </div>

        {/* Success Message */}
        {message && (
          <div className="mb-8 p-6 rounded-2xl bg-[var(--color-sage)]/10 border border-[var(--color-sage)]/20 animate-scale-in">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[var(--color-sage)]/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-[var(--color-sage)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-[var(--color-espresso)] mb-1">Order Confirmed!</h3>
                <p className="text-[var(--color-stone)]">{message}</p>
              </div>
            </div>
            <a
              href="/"
              className="mt-4 btn-primary inline-flex items-center gap-2"
            >
              Continue Shopping
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        )}

        {items.length === 0 && !message ? (
          <div className="text-center py-20 animate-fade-in-up">
            <div className="w-24 h-24 rounded-full bg-[var(--color-cream-dark)] flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-[var(--color-stone)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--color-espresso)] mb-3">
              Your cart is empty
            </h2>
            <p className="text-[var(--color-stone)] mb-8 max-w-md mx-auto">
              Looks like you haven't added anything yet. Explore our collection and find something you'll love.
            </p>
            <a href="/" className="btn-primary inline-flex items-center gap-2">
              Start Shopping
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        ) : items.length > 0 && (
          <div className="grid lg:grid-cols-[1fr_400px] gap-12">
            {/* Cart Items */}
            <div className="space-y-4">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-[var(--border)] p-4 md:p-6 flex gap-4 md:gap-6 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Image */}
                  <a
                    href={`/p/${item.slug}`}
                    className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden bg-[var(--color-cream-dark)] flex-shrink-0"
                  >
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">
                        📦
                      </div>
                    )}
                  </a>

                  {/* Details */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <a
                        href={`/p/${item.slug}`}
                        className="font-semibold text-[var(--color-espresso)] hover:text-[var(--color-terracotta)] transition-colors"
                      >
                        {item.name}
                      </a>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="p-1.5 rounded-full hover:bg-[var(--color-cream-dark)] transition-colors text-[var(--color-stone)] hover:text-[var(--color-terracotta)]"
                        aria-label="Remove item"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <span className="text-sm text-[var(--color-stone)] mb-4">
                      ${item.price.toFixed(2)} each
                    </span>

                    <div className="mt-auto flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1 bg-[var(--color-cream)] rounded-lg p-1">
                        <button
                          onClick={() => handleQtyChange(item.id, -1)}
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          aria-label="Decrease quantity"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="w-10 text-center font-medium text-[var(--color-espresso)]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQtyChange(item.id, 1)}
                          className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-white transition-colors"
                          aria-label="Increase quantity"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>

                      {/* Item Total */}
                      <span className="font-semibold text-[var(--color-espresso)]">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Continue Shopping Link */}
              <a
                href="/"
                className="inline-flex items-center gap-2 text-sm text-[var(--color-terracotta)] hover:text-[var(--color-terracotta-dark)] transition-colors font-medium mt-4"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Continue Shopping
              </a>
            </div>

            {/* Order Summary */}
            <div className="lg:sticky lg:top-[calc(var(--nav-height)+2rem)] h-fit">
              <div className="bg-white rounded-2xl border border-[var(--border)] p-6 animate-fade-in-up stagger-2">
                <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[var(--color-espresso)] mb-6">
                  Order Summary
                </h2>

                {/* Summary Lines */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-[var(--color-stone)]">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[var(--color-stone)]">
                    <span>Shipping</span>
                    <span className="text-[var(--color-sage)]">Free</span>
                  </div>
                </div>

                <div className="border-t border-[var(--border)] pt-4 mb-6">
                  <div className="flex justify-between items-baseline">
                    <span className="font-semibold text-[var(--color-espresso)]">Total</span>
                    <span className="text-2xl font-semibold text-[var(--color-espresso)]">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Email Input */}
                <div className="mb-4">
                  <label
                    className="block text-sm font-medium text-[var(--color-espresso)] mb-2"
                    htmlFor="checkout-email"
                  >
                    Email for order confirmation
                  </label>
                  <input
                    id="checkout-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                    placeholder="you@example.com"
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-4 p-3 rounded-lg bg-[var(--color-terracotta)]/10 border border-[var(--color-terracotta)]/20">
                    <p className="text-sm text-[var(--color-terracotta)]">{error}</p>
                  </div>
                )}

                {/* Checkout Button */}
                <button
                  className="btn-primary w-full flex items-center justify-center gap-2"
                  onClick={handleCheckout}
                  disabled={loading || items.length === 0}
                >
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Complete Checkout
                    </>
                  )}
                </button>

                {/* Security Note */}
                <p className="text-xs text-center text-[var(--color-stone)] mt-4">
                  🔒 Secure checkout • No real payments processed
                </p>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div className="p-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-cream-dark)] flex items-center justify-center mx-auto mb-2">
                    <svg className="w-5 h-5 text-[var(--color-stone)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <span className="text-xs text-[var(--color-stone)]">Free Shipping</span>
                </div>
                <div className="p-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-cream-dark)] flex items-center justify-center mx-auto mb-2">
                    <svg className="w-5 h-5 text-[var(--color-stone)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <span className="text-xs text-[var(--color-stone)]">Easy Returns</span>
                </div>
                <div className="p-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-cream-dark)] flex items-center justify-center mx-auto mb-2">
                    <svg className="w-5 h-5 text-[var(--color-stone)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <span className="text-xs text-[var(--color-stone)]">Secure</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
