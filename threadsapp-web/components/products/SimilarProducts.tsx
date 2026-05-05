import { ProductGrid } from "@/components/products/ProductGrid";
import type { Product } from "@/types/product.types";

export function SimilarProducts({ products }: { products: Product[] }) {
  return (
    <section>
      <h2 className="mb-6 text-2xl font-semibold text-secondary">Similar Products</h2>
      <ProductGrid products={products.slice(0, 4)} />
    </section>
  );
}
