"use client";
export const dynamic = 'force-dynamic';

import Link from "next/link";
import { Suspense } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductsTable } from "@/components/products/ProductsTable";
import { useProducts, useToggleFeatured } from "@/hooks/useProducts";
import { useBrands } from "@/hooks/useBrands";
import { useCategories } from "@/hooks/useCategories";
import { useSearchParams } from "next/navigation";

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const filters = {
    search: searchParams.get("search") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    brand: searchParams.get("brand") ?? undefined,
    minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
    maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
  };
  const { data: products = [], isLoading } = useProducts(filters);
  const { data: brands = [] } = useBrands();
  const { data: categories = [] } = useCategories();
  const toggleFeatured = useToggleFeatured();

  return (
    <div className="space-y-6">
      <PageHeader title="Products" description="Manage catalog items, merchandising, and stock health." action={<Button asChild><Link href="/products/new">Add Product</Link></Button>} />
      <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <ProductFilters categories={categories} brands={brands} />
        <ProductsTable data={products} isLoading={isLoading} onToggleFeatured={(id) => toggleFeatured.mutate(id)} />
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsPageContent />
    </Suspense>
  );
}
