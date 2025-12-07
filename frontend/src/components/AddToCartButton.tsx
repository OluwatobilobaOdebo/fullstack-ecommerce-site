"use client";

import { useState } from "react";
import { addToCart } from "./cartStorage";

type Props = {
  id: number;
  name: string;
  slug: string;
  price: number;
  image_url?: string;
  disabled?: boolean;
};

export function AddToCartButton(props: Props) {
  const [loading, setLoading] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleClick = () => {
    if (props.disabled || loading) return;
    setLoading(true);

    addToCart(
      {
        id: props.id,
        name: props.name,
        slug: props.slug,
        price: props.price,
        image_url: props.image_url,
      },
      quantity
    );

    // Dispatch custom event to update cart count in nav
    window.dispatchEvent(new Event("cartUpdated"));

    setLoading(false);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-[var(--color-espresso)]">Quantity</span>
        <div className="flex items-center gap-1 bg-[var(--color-cream)] rounded-lg p-1">
          <button
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1 || props.disabled}
            className="w-10 h-10 rounded-md flex items-center justify-center hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Decrease quantity"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <span className="w-12 text-center font-semibold text-[var(--color-espresso)]">
            {quantity}
          </span>
          <button
            onClick={() => handleQuantityChange(1)}
            disabled={props.disabled}
            className="w-10 h-10 rounded-md flex items-center justify-center hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Increase quantity"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <div className="flex gap-3">
        <button
          onClick={handleClick}
          disabled={props.disabled || loading}
          className={`
            flex-1 inline-flex items-center justify-center gap-2 
            px-6 py-4 rounded-xl font-semibold text-base
            transition-all duration-300 
            ${
              justAdded
                ? "bg-[var(--color-sage)] text-white"
                : props.disabled
                ? "bg-[var(--color-stone)]/30 text-[var(--color-stone)] cursor-not-allowed"
                : "bg-[var(--color-espresso)] text-white hover:bg-[var(--color-espresso-light)] hover:shadow-lg hover:-translate-y-0.5"
            }
          `}
        >
          {loading ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Adding...
            </>
          ) : justAdded ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Added to Cart!
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Add to Cart
            </>
          )}
        </button>

        {/* View Cart Button (shows after adding) */}
        {justAdded && (
          <a
            href="/cart"
            className="inline-flex items-center justify-center px-6 py-4 rounded-xl font-semibold text-base border-2 border-[var(--color-espresso)] text-[var(--color-espresso)] hover:bg-[var(--color-espresso)] hover:text-white transition-all duration-300 animate-fade-in"
          >
            View Cart
          </a>
        )}
      </div>
    </div>
  );
}
