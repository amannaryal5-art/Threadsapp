"use client";

import { useParams } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { InventoryTable } from "@/components/products/InventoryTable";
import { useProduct, useUpdateInventory } from "@/hooks/useProducts";

export default function InventoryPage() {
  const params = useParams<{ id: string }>();
  const { data: product } = useProduct(params.id);
  const updateInventory = useUpdateInventory();

  return (
    <div className="space-y-6">
      <PageHeader title="Inventory Management" description="Update stock and low-stock thresholds for each variant." />
      <InventoryTable variants={product?.variants ?? []} onSave={(payload) => updateInventory.mutate(payload)} />
    </div>
  );
}
