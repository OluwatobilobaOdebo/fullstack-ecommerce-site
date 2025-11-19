// src/app/page.tsx
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
    // avoid caching during dev so you always see latest data
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Failed to fetch products", res.status);
    return [];
  }

  return res.json();
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Full-Stack E-Commerce Demo</h1>
        <a
          href="/cart"
          className="inline-flex items-center text-sm text-blue-600 mb-4"
        >
          View cart →
        </a>

        {products.length === 0 ? (
          <p className="text-gray-600">
            No products found. (Check that your backend is running and seeded.)
          </p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {products.map((p) => (
              <a
                key={p.id}
                href={`/p/${p.slug}`}
                className="bg-white border rounded-xl shadow-sm hover:shadow-md transition p-4 flex flex-col"
              >
                {p.image_url && (
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="rounded-md mb-3 aspect-[4/3] object-cover"
                  />
                )}
                <div className="font-semibold mb-1">{p.name}</div>
                <div className="text-sm text-gray-500 mb-2">
                  {p.category ?? "General"}
                </div>
                <div className="mt-auto font-semibold">
                  ${p.price.toFixed(2)}
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
