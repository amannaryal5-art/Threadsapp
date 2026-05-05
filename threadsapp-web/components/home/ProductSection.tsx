import Link from "next/link";
import { ProductCard } from "@/components/products/ProductCard";
import type { Product } from "@/types/product.types";

export function ProductSection({
  title,
  products,
  href
}: {
  title: string;
  products: Product[];
  href: string;
}) {
  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-secondary">{title}</h2>
        <Link href={href} className="text-sm font-semibold text-primary">
          See All
        </Link>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
