"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ProductVariant } from "@/types/product.types";

export function InventoryTable({
  variants,
  onSave,
}: {
  variants: ProductVariant[];
  onSave: (payload: { variantId: string; quantity: number; lowStockThreshold: number }) => void;
}) {
  const [drafts, setDrafts] = useState<Record<string, { quantity: number; lowStockThreshold: number }>>(
    Object.fromEntries(variants.map((variant) => [variant.id, { quantity: variant.inventory?.quantity ?? 0, lowStockThreshold: variant.inventory?.lowStockThreshold ?? 5 }])),
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-slate-50">
            <th className="px-4 py-3 text-left">Variant</th>
            <th className="px-4 py-3 text-left">Current stock</th>
            <th className="px-4 py-3 text-left">Low stock threshold</th>
            <th className="px-4 py-3 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {variants.map((variant) => {
            const quantity = drafts[variant.id]?.quantity ?? 0;
            const threshold = drafts[variant.id]?.lowStockThreshold ?? 5;
            const low = quantity < threshold;
            return (
              <tr key={variant.id} className={low ? "bg-red-50" : ""}>
                <td className="px-4 py-3">{variant.size} / {variant.color}</td>
                <td className="px-4 py-3"><Input type="number" value={quantity} onChange={(event) => setDrafts((state) => ({ ...state, [variant.id]: { ...state[variant.id], quantity: Number(event.target.value) } }))} /></td>
                <td className="px-4 py-3"><Input type="number" value={threshold} onChange={(event) => setDrafts((state) => ({ ...state, [variant.id]: { ...state[variant.id], lowStockThreshold: Number(event.target.value) } }))} /></td>
                <td className="px-4 py-3"><Button size="sm" onClick={() => onSave({ variantId: variant.id, quantity, lowStockThreshold: threshold })}>Update</Button></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
