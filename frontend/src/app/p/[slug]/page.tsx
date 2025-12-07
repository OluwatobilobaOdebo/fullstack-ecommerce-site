import { AddToCartButton } from "@/components/AddToCartButton";

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

async function getProduct(slug: string): Promise<Product | null> {
  const base = process.env.NEXT_PUBLIC_API_BASE;
  const res = await fetch(`${base}/products/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
}

async function getRelatedProducts(
  category: string | undefined,
  excludeSlug: string
): Promise<Product[]> {
  if (!category) return [];
  
  const base = process.env.NEXT_PUBLIC_API_BASE;
  const res = await fetch(`${base}/products/`, {
    cache: "no-store",
  });

  if (!res.ok) return [];

  const products: Product[] = await res.json();
  return products
    .filter(
      (p) =>
        p.category?.toLowerCase() === category.toLowerCase() &&
        p.slug !== excludeSlug
    )
    .slice(0, 3);
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return (
      <main className="min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-20">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-[var(--color-stone)] mb-8">
            <a href="/" className="hover:text-[var(--color-terracotta)] transition-colors">
              Home
            </a>
            <span>/</span>
            <span className="text-[var(--color-espresso)]">Not Found</span>
          </nav>
          
          <div className="text-center py-20">
            <div className="text-8xl mb-6">🔍</div>
            <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold text-[var(--color-espresso)] mb-4">
              Product Not Found
            </h1>
            <p className="text-[var(--color-stone)] mb-8 max-w-md mx-auto">
              The product you're looking for doesn't exist or has been removed from our collection.
            </p>
            <a href="/" className="btn-primary inline-flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Shop
            </a>
          </div>
        </div>
      </main>
    );
  }

  const relatedProducts = await getRelatedProducts(product.category, product.slug);

  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[var(--color-stone)] mb-8 animate-fade-in">
          <a href="/" className="hover:text-[var(--color-terracotta)] transition-colors">
            Home
          </a>
          <span>/</span>
          {product.category && (
            <>
              <a
                href={`/?category=${product.category.toLowerCase()}`}
                className="hover:text-[var(--color-terracotta)] transition-colors"
              >
                {product.category}
              </a>
              <span>/</span>
            </>
          )}
          <span className="text-[var(--color-espresso)]">{product.name}</span>
        </nav>

        {/* Product Details */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Image */}
          <div className="animate-fade-in-up">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-[var(--color-cream-dark)] shadow-lg">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl">
                  📦
                </div>
              )}
              
              {/* Stock Badge */}
              {!product.in_stock && (
                <div className="absolute top-6 left-6 px-4 py-2 bg-[var(--color-espresso)]/90 text-white text-sm font-medium rounded-full">
                  Out of Stock
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col animate-fade-in-up stagger-1">
            {/* Category */}
            {product.category && (
              <a
                href={`/?category=${product.category.toLowerCase()}`}
                className="inline-flex items-center gap-2 text-sm text-[var(--color-terracotta)] font-medium mb-4 hover:text-[var(--color-terracotta-dark)] transition-colors w-fit"
              >
                <span className="w-2 h-2 rounded-full bg-[var(--color-terracotta)]" />
                {product.category}
              </a>
            )}
            
            {/* Title */}
            <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl font-semibold text-[var(--color-espresso)] mb-4">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-3xl font-semibold text-[var(--color-espresso)]">
                ${product.price.toFixed(2)}
              </span>
              {product.in_stock && (
                <span className="badge badge-success">In Stock</span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="mb-8">
                <h2 className="text-sm font-semibold text-[var(--color-espresso)] uppercase tracking-wide mb-3">
                  Description
                </h2>
                <p className="text-[var(--color-espresso-light)]/70 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Divider */}
            <div className="border-t border-[var(--border)] my-6" />

            {/* Add to Cart */}
            <div className="space-y-4">
              <AddToCartButton
                id={product.id}
                name={product.name}
                slug={product.slug}
                price={product.price}
                image_url={product.image_url}
                disabled={!product.in_stock}
              />
              
              {!product.in_stock && (
                <p className="text-sm text-[var(--color-stone)]">
                  This item is currently out of stock. Check back soon!
                </p>
              )}
            </div>

            {/* Features */}
            <div className="mt-10 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-sm text-[var(--color-stone)]">
                <div className="w-10 h-10 rounded-full bg-[var(--color-sage)]/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[var(--color-sage)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>Quality Guaranteed</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[var(--color-stone)]">
                <div className="w-10 h-10 rounded-full bg-[var(--color-terracotta)]/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[var(--color-terracotta)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[var(--color-stone)]">
                <div className="w-10 h-10 rounded-full bg-[var(--color-gold)]/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[var(--color-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <span>Easy Returns</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[var(--color-stone)]">
                <div className="w-10 h-10 rounded-full bg-[var(--color-espresso)]/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[var(--color-espresso)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <span>Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="animate-fade-in-up stagger-3">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--color-espresso)]">
                You Might Also Like
              </h2>
              <a
                href={`/?category=${product.category?.toLowerCase()}`}
                className="text-sm text-[var(--color-terracotta)] hover:text-[var(--color-terracotta-dark)] transition-colors font-medium link-hover"
              >
                View All →
              </a>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((related) => (
                <a
                  key={related.id}
                  href={`/p/${related.slug}`}
                  className="product-card group bg-[var(--color-cream)] rounded-2xl overflow-hidden border border-[var(--border)]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-cream-dark)]">
                    {related.image_url ? (
                      <img
                        src={related.image_url}
                        alt={related.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">
                        📦
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-[var(--color-espresso)] group-hover:text-[var(--color-terracotta)] transition-colors">
                      {related.name}
                    </h3>
                    <span className="text-[var(--color-espresso)] font-medium">
                      ${related.price.toFixed(2)}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
