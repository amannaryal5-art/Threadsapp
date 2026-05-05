"use client";

import { EmptyState } from "@/components/shared/EmptyState";
import { ProductGrid } from "@/components/products/ProductGrid";
import { useWishlist } from "@/hooks/useWishlist";

export default function WishlistPage() {
  const { data = [] } = useWishlist();
  const products = data.map((item) => item.Product);

  return (
    <main className="container py-8">
      <h1 className="mb-6 text-3xl font-bold text-secondary">Wishlist</h1>
      {products.length ? (
        <ProductGrid products={products} />
      ) : (
        <EmptyState title="Save items you love" description="Your wishlist is ready for the pieces you want to come back to later." ctaHref="/" ctaLabel="Continue Browsing" />
      )}
    </main>
  );
}
