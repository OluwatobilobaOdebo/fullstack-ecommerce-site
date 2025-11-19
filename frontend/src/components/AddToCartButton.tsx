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
      1
    );

    setLoading(false);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <button
      onClick={handleClick}
      disabled={props.disabled || loading}
      className="mt-4 inline-flex items-center justify-center rounded-lg bg-black text-white px-4 py-2 text-sm font-medium disabled:opacity-60"
    >
      {loading ? "Adding..." : justAdded ? "Added ✅" : "Add to cart"}
    </button>
  );
}
