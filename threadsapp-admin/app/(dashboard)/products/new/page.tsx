"use client";

import { useSession } from "next-auth/react";
import { PageHeader } from "@/components/shared/PageHeader";
import { ProductForm } from "@/components/products/ProductForm";
import { useBrands } from "@/hooks/useBrands";
import { useCategories } from "@/hooks/useCategories";
import { useCreateProduct } from "@/hooks/useProducts";

export default function CreateProductPage() {
  const { status } = useSession();
  const { data: brands = [], isLoading: brandsLoading, refetch: refetchBrands } = useBrands();
  const { data: categories = [], isLoading: categoriesLoading, refetch: refetchCategories } = useCategories();
  const createProduct = useCreateProduct();

  return (
    <div className="space-y-6">
      <PageHeader title="Create Product" description="Build a complete product listing with variants, images, and inventory." />
      <ProductForm
        brands={brands}
        categories={categories}
        onSubmit={async (values) => createProduct.mutateAsync(values)}
        submitting={createProduct.isPending}
        metaLoading={status === "loading" || brandsLoading || categoriesLoading}
        refreshBrands={refetchBrands}
        refreshCategories={refetchCategories}
      />
    </div>
  );
}
