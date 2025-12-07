"use client";

import { useEffect, useState, useRef } from "react";

type Product = {
  id: number;
  name: string;
  slug: string;
  price: number;
  image_url?: string;
  category?: string;
};

export function SearchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch all products on mount
  useEffect(() => {
    if (isOpen) {
      fetchProducts();
      // Focus input when modal opens
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE;
      const res = await fetch(`${base}/products/`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category?.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
    if (value.trim()) {
      setHasSearched(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[var(--color-espresso)]/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative max-w-2xl mx-auto mt-20 px-4 animate-fade-in-down">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Search Input */}
          <form onSubmit={handleSearch} className="relative">
            <div className="flex items-center border-b border-[var(--border)]">
              <svg
                className="w-5 h-5 ml-5 text-[var(--color-stone)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="Search products..."
                className="flex-1 px-4 py-5 text-lg bg-transparent border-none outline-none placeholder:text-[var(--color-stone)]"
              />
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-5 text-[var(--color-stone)] hover:text-[var(--color-espresso)] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </form>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="w-8 h-8 border-2 border-[var(--color-terracotta)] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-[var(--color-stone)]">Loading products...</p>
              </div>
            ) : query.trim() === "" ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-[var(--color-cream)] flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[var(--color-stone)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="text-[var(--color-espresso)] font-medium mb-1">Search our collection</p>
                <p className="text-sm text-[var(--color-stone)]">
                  Type a product name or category to find what you're looking for
                </p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-[var(--color-cream)] flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🔍</span>
                </div>
                <p className="text-[var(--color-espresso)] font-medium mb-1">No results found</p>
                <p className="text-sm text-[var(--color-stone)]">
                  Try a different search term or browse our categories
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[var(--border)]">
                <div className="px-5 py-3 bg-[var(--color-cream)]">
                  <span className="text-sm text-[var(--color-stone)]">
                    {filteredProducts.length} {filteredProducts.length === 1 ? "result" : "results"} for "{query}"
                  </span>
                </div>
                {filteredProducts.map((product) => (
                  <a
                    key={product.id}
                    href={`/p/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-4 p-4 hover:bg-[var(--color-cream)] transition-colors group"
                  >
                    {/* Product Image */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-[var(--color-cream-dark)] flex-shrink-0">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                          📦
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-[var(--color-espresso)] group-hover:text-[var(--color-terracotta)] transition-colors truncate">
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        {product.category && (
                          <span className="text-xs text-[var(--color-stone)] bg-[var(--color-cream)] px-2 py-0.5 rounded-full">
                            {product.category}
                          </span>
                        )}
                        <span className="text-sm font-medium text-[var(--color-espresso)]">
                          ${product.price.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Arrow */}
                    <svg
                      className="w-5 h-5 text-[var(--color-stone)] group-hover:text-[var(--color-terracotta)] group-hover:translate-x-1 transition-all"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          {query.trim() === "" && !loading && (
            <div className="border-t border-[var(--border)] p-4 bg-[var(--color-cream)]">
              <p className="text-xs text-[var(--color-stone)] mb-2">Popular categories</p>
              <div className="flex flex-wrap gap-2">
                {["Apparel", "Accessories", "Decor", "Gear", "Stationery"].map((cat) => (
                  <a
                    key={cat}
                    href={`/?category=${cat.toLowerCase()}`}
                    onClick={onClose}
                    className="px-3 py-1.5 text-sm bg-white rounded-full text-[var(--color-espresso)] hover:bg-[var(--color-terracotta)] hover:text-white transition-colors"
                  >
                    {cat}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Keyboard hint */}
        <div className="text-center mt-4">
          <span className="text-white/60 text-sm">
            Press <kbd className="px-2 py-0.5 bg-white/10 rounded text-white/80 text-xs">ESC</kbd> to close
          </span>
        </div>
      </div>
    </div>
  );
}

