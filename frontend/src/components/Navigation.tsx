"use client";

import { useEffect, useState } from "react";
import { getCart } from "./cartStorage";
import { SearchModal } from "./SearchModal";

export function Navigation() {
  const [cartCount, setCartCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    // Get initial cart count
    const cart = getCart();
    setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));

    // Listen for cart updates
    const handleStorage = () => {
      const cart = getCart();
      setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
    };

    window.addEventListener("storage", handleStorage);
    
    // Custom event for same-tab updates
    window.addEventListener("cartUpdated", handleStorage);

    // Handle scroll
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("cartUpdated", handleStorage);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
      style={{ height: "var(--nav-height)" }}
    >
      <nav className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <a
          href="/"
          className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--color-espresso)] hover:text-[var(--color-terracotta)] transition-colors"
        >
          Curated
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <NavLinks />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <button
            className="p-2 rounded-full hover:bg-[var(--color-cream-dark)] transition-colors"
            aria-label="Search"
            onClick={() => setSearchOpen(true)}
          >
            <svg
              className="w-5 h-5 text-[var(--color-espresso)]"
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
          </button>

          {/* Cart */}
          <a
            href="/cart"
            className="relative p-2 rounded-full hover:bg-[var(--color-cream-dark)] transition-colors group"
            aria-label={`Cart with ${cartCount} items`}
          >
            <svg
              className="w-5 h-5 text-[var(--color-espresso)] group-hover:text-[var(--color-terracotta)] transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--color-terracotta)] text-white text-xs font-medium rounded-full flex items-center justify-center cart-badge-animate">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </a>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-full hover:bg-[var(--color-cream-dark)] transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-5 h-5 text-[var(--color-espresso)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-[var(--border)] shadow-lg animate-fade-in-down">
          <div className="px-6 py-4 space-y-4">
            <NavLinks mobile onClick={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}

function NavLinks({ mobile, onClick }: { mobile?: boolean; onClick?: () => void }) {
  const links = [
    { href: "/", label: "Home" },
    { href: "/?category=apparel", label: "Apparel" },
    { href: "/?category=accessories", label: "Accessories" },
    { href: "/?category=decor", label: "Decor" },
    { href: "/?category=gear", label: "Gear" },
  ];

  if (mobile) {
    return (
      <>
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={onClick}
            className="block py-2 text-[var(--color-espresso)] hover:text-[var(--color-terracotta)] transition-colors font-medium"
          >
            {link.label}
          </a>
        ))}
      </>
    );
  }

  return (
    <>
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="text-sm text-[var(--color-espresso-light)] hover:text-[var(--color-terracotta)] transition-colors font-medium link-hover"
        >
          {link.label}
        </a>
      ))}
    </>
  );
}

