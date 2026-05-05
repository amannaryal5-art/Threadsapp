import { ProductSection } from "@/components/home/ProductSection";
import type { Product } from "@/types/product.types";

export function RecentlyViewed({ products }: { products: Product[] }) {
  if (!products.length) return null;
  return <ProductSection title="Recently Viewed" products={products.slice(0, 4)} href="/search?sort=newest" />;
}
