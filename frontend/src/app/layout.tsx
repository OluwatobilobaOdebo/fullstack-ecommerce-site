import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tobi's Full-Stack E-Commerce Site",
  description: "Portfolio project – FastAPI backend + Next.js frontend.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <header className="border-b bg-white">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="/" className="font-semibold">
              Tobi's Full-Stack E-Commerce Site
            </a>
            <nav className="flex items-center gap-4 text-sm">
              <a href="/" className="hover:underline">
                Home
              </a>
              <a href="/cart" className="hover:underline">
                Cart
              </a>
            </nav>
          </div>
        </header>

        <main>{children}</main>

        <footer className="border-t mt-8">
          <div className="max-w-5xl mx-auto px-4 py-4 text-xs text-gray-500">
            Built with FastAPI + PostgreSQL + Next.js. No real payments are
            processed.
          </div>
        </footer>
      </body>
    </html>
  );
}
