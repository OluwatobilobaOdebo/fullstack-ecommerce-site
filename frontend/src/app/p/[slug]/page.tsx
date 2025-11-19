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

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <a href="/" className="text-blue-600 text-sm mb-4 inline-block">
            ← Back to products
          </a>
          <h1 className="text-2xl font-semibold mb-2">Product not found</h1>
          <p className="text-gray-600">
            The product you’re looking for doesn’t exist or was removed.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <a href="/" className="text-blue-600 text-sm mb-4 inline-block">
          ← Back to products
        </a>

        <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col md:flex-row gap-6">
          {product.image_url && (
            <img
              src={product.image_url}
              alt={product.name}
              className="rounded-xl w-full md:w-1/2 aspect-[4/3] object-cover"
            />
          )}

          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-gray-500 text-sm mb-2">
              {product.category ?? "General"}
            </p>
            <p className="text-2xl font-semibold mb-4">
              ${product.price.toFixed(2)}
            </p>

            {product.description && (
              <p className="text-gray-700 mb-6">{product.description}</p>
            )}

            <div className="text-sm text-gray-600 mb-2">
              Status:{" "}
              <span
                className={product.in_stock ? "text-green-600" : "text-red-600"}
              >
                {product.in_stock ? "In stock" : "Out of stock"}
              </span>
            </div>

            <AddToCartButton
              id={product.id}
              name={product.name}
              slug={product.slug}
              price={product.price}
              image_url={product.image_url}
              disabled={!product.in_stock}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
