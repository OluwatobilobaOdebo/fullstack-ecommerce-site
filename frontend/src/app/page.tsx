type Product = {
  id: number;
  name: string;
  slug: string;
  price: number;
  image_url?: string;
  description?: string;
  category?: string;
  in_stock: boolean;
};

async function getProducts(): Promise<Product[]> {
  const base = process.env.NEXT_PUBLIC_API_BASE;
  const res = await fetch(`${base}/products/`, {
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Failed to fetch products", res.status);
    return [];
  }

  return res.json();
}

const categories = [
  {
    name: "Apparel",
    slug: "apparel",
    description: "Timeless pieces for everyday",
    icon: "👕",
    gradient: "from-rose-100 to-rose-50",
  },
  {
    name: "Accessories",
    slug: "accessories",
    description: "Finishing touches that matter",
    icon: "☕",
    gradient: "from-amber-100 to-amber-50",
  },
  {
    name: "Decor",
    slug: "decor",
    description: "Beauty for your space",
    icon: "🌿",
    gradient: "from-emerald-100 to-emerald-50",
  },
  {
    name: "Gear",
    slug: "gear",
    description: "Built for adventure",
    icon: "🎒",
    gradient: "from-sky-100 to-sky-50",
  },
  {
    name: "Stationery",
    slug: "stationery",
    description: "Tools for thought",
    icon: "📓",
    gradient: "from-violet-100 to-violet-50",
  },
];

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const products = await getProducts();
  const selectedCategory = params.category?.toLowerCase();

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category?.toLowerCase() === selectedCategory)
    : products;

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 pattern-dots opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--color-cream)]" />

        {/* Decorative Elements */}
        <div className="absolute top-20 right-[10%] w-72 h-72 rounded-full bg-[var(--color-terracotta)]/5 blur-3xl" />
        <div className="absolute bottom-20 left-[5%] w-96 h-96 rounded-full bg-[var(--color-sage)]/10 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 py-20 w-full">
          <div className="max-w-3xl">
            <h1 className="font-[family-name:var(--font-display)] text-5xl md:text-7xl font-semibold text-[var(--color-espresso)] mb-6 animate-fade-in-up">
              Curated for
              <br />
              <span className="gradient-text">Modern Living</span>
            </h1>

            <p className="text-lg md:text-xl text-[var(--color-espresso-light)]/70 max-w-xl mb-8 leading-relaxed animate-fade-in-up stagger-2">
              Discover a thoughtfully selected collection of premium goods.
              Quality craftsmanship meets timeless design.
            </p>

            <div className="flex flex-wrap gap-4 animate-fade-in-up stagger-3">
              <a
                href="#products"
                className="btn-primary inline-flex items-center gap-2"
              >
                Shop Collection
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </a>
              <a
                href="#categories"
                className="btn-secondary inline-flex items-center gap-2"
              >
                Browse Categories
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg animate-fade-in-up stagger-4">
            <div>
              <div className="text-3xl font-[family-name:var(--font-display)] font-semibold text-[var(--color-terracotta)]">
                {products.length}+
              </div>
              <div className="text-sm text-[var(--color-stone)]">Products</div>
            </div>
            <div>
              <div className="text-3xl font-[family-name:var(--font-display)] font-semibold text-[var(--color-terracotta)]">
                5
              </div>
              <div className="text-sm text-[var(--color-stone)]">
                Categories
              </div>
            </div>
            <div>
              <div className="text-3xl font-[family-name:var(--font-display)] font-semibold text-[var(--color-terracotta)]">
                ★
              </div>
              <div className="text-sm text-[var(--color-stone)]">Quality</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-20 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-semibold text-[var(--color-espresso)] mb-4">
              Shop by Category
            </h2>
            <p className="text-[var(--color-stone)] max-w-md mx-auto">
              Find exactly what you're looking for in our curated collections
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat, index) => (
              <a
                key={cat.slug}
                href={`/?category=${cat.slug}`}
                className={`group relative p-6 rounded-2xl bg-gradient-to-br ${cat.gradient} border border-white/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-4xl mb-3">{cat.icon}</div>
                <h3 className="font-semibold text-[var(--color-espresso)] mb-1 group-hover:text-[var(--color-terracotta)] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-[var(--color-stone)]">
                  {cat.description}
                </p>

                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg
                    className="w-4 h-4 text-[var(--color-espresso)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-semibold text-[var(--color-espresso)] mb-2">
                {selectedCategory
                  ? `${
                      selectedCategory.charAt(0).toUpperCase() +
                      selectedCategory.slice(1)
                    }`
                  : "All Products"}
              </h2>
              <p className="text-[var(--color-stone)]">
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? "item" : "items"} available
              </p>
            </div>

            {selectedCategory && (
              <a
                href="/"
                className="inline-flex items-center gap-2 text-sm text-[var(--color-terracotta)] hover:text-[var(--color-terracotta-dark)] transition-colors font-medium"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Clear filter
              </a>
            )}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">
                {selectedCategory ? "🔍" : "☕"}
              </div>
              <h3 className="text-xl font-semibold text-[var(--color-espresso)] mb-2">
                {selectedCategory ? "No products found" : "Just a moment..."}
              </h3>
              <p className="text-[var(--color-stone)] mb-6 max-w-md mx-auto">
                {selectedCategory
                  ? `We couldn't find any products in the "${selectedCategory}" category.`
                  : "Our store is waking up! This can take up to 30 seconds on the first visit. Please refresh the page in a moment."}
              </p>
              {selectedCategory ? (
                <a href="/" className="btn-primary">
                  View All Products
                </a>
              ) : (
                <a
                  href="/"
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Refresh Page
                </a>
              )}
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-[var(--color-espresso)] relative overflow-hidden">
        {/* Decorative */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[var(--color-terracotta)]/10 blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-[var(--color-sage)]/10 blur-3xl -translate-x-1/2 translate-y-1/2" />

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-semibold text-white mb-4">
            Stay in the Loop
          </h2>
          <p className="text-white/70 max-w-md mx-auto mb-8">
            Be the first to know about new arrivals, exclusive offers, and
            curated collections.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-[var(--color-terracotta)] transition-colors"
            />
            <button
              type="button"
              className="px-6 py-3 rounded-lg bg-[var(--color-terracotta)] text-white font-medium hover:bg-[var(--color-terracotta-dark)] transition-colors"
            >
              Subscribe
            </button>
          </div>

          <p className="text-white/40 text-sm mt-4">
            No spam, unsubscribe anytime.
          </p>
        </div>
      </section>
    </>
  );
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  return (
    <a
      href={`/p/${product.slug}`}
      className="product-card group bg-[var(--color-cream)] rounded-2xl overflow-hidden border border-[var(--border)] animate-fade-in-up"
      style={{
        animationDelay: `${index * 0.1}s`,
        opacity: 0,
        animationFillMode: "forwards",
      }}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-cream-dark)]">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            📦
          </div>
        )}

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-[var(--color-espresso)]/0 group-hover:bg-[var(--color-espresso)]/20 transition-colors duration-300 flex items-center justify-center">
          <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-[var(--color-espresso)] opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            View Details
          </span>
        </div>

        {/* Stock Badge */}
        {!product.in_stock && (
          <div className="absolute top-3 left-3 px-3 py-1 bg-[var(--color-espresso)]/80 text-white text-xs font-medium rounded-full">
            Out of Stock
          </div>
        )}

        {/* Category Badge */}
        {product.category && (
          <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-sm text-[var(--color-espresso)] text-xs font-medium rounded-full">
            {product.category}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-[var(--color-espresso)] mb-1 group-hover:text-[var(--color-terracotta)] transition-colors">
          {product.name}
        </h3>

        {product.description && (
          <p className="text-sm text-[var(--color-stone)] line-clamp-2 mb-3">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-[var(--color-espresso)]">
            ${product.price.toFixed(2)}
          </span>

          <div className="w-8 h-8 rounded-full bg-[var(--color-terracotta)]/10 flex items-center justify-center group-hover:bg-[var(--color-terracotta)] transition-colors">
            <svg
              className="w-4 h-4 text-[var(--color-terracotta)] group-hover:text-white transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </a>
  );
}
