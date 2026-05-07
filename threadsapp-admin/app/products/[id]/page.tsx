"use client";

import { useParams } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { ProductForm } from "@/components/products/ProductForm";
import { useBrands } from "@/hooks/useBrands";
import { useCategories } from "@/hooks/useCategories";
import { useProduct, useUpdateInventory, useUpdateProduct } from "@/hooks/useProducts";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const { data: brands = [] } = useBrands();
  const { data: categories = [] } = useCategories();
  const { data: product } = useProduct(params.id);
  const updateProduct = useUpdateProduct(params.id);
  const updateInventory = useUpdateInventory();

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Product" description="Update product merchandising, pricing, variants, and stock." />
      <ProductForm
        brands={brands}
        categories={categories}
        product={product ?? undefined}
        onSubmit={async (values) => updateProduct.mutateAsync(values)}
        onInventorySave={(payload) => updateInventory.mutate(payload)}
        submitting={updateProduct.isPending}
      />
    </div>
  );
}
