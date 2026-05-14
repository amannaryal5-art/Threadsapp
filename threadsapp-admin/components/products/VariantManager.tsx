"use client";

import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, type Control, type UseFormRegister } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";
import type { ProductFormValues } from "@/validations/product.schema";

export function VariantManager({
  control,
  register,
  variants,
  basePrice,
  discountPercent,
}: {
  control: Control<ProductFormValues>;
  register: UseFormRegister<ProductFormValues>;
  variants: ProductFormValues["variants"];
  basePrice: number;
  discountPercent: number;
}) {
  const { fields, append, remove } = useFieldArray({ control, name: "variants" });

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <div key={field.id} className="rounded-2xl border border-border p-4">
          <div className="grid gap-3 lg:grid-cols-12">
          <div className="lg:col-span-2">
            <Label>Size</Label>
            <Input {...register(`variants.${index}.size`)} />
          </div>
          <div className="lg:col-span-2">
            <Label>Color</Label>
            <Input {...register(`variants.${index}.color`)} />
          </div>
          <div className="lg:col-span-2">
            <Label>Hex</Label>
            <Input {...register(`variants.${index}.colorHex`)} />
          </div>
          <div className="lg:col-span-2">
            <Label>SKU</Label>
            <Input {...register(`variants.${index}.sku`)} />
          </div>
          <div className="lg:col-span-2">
            <Label>Additional price on MRP</Label>
            <Input type="number" {...register(`variants.${index}.additionalPrice`, { valueAsNumber: true })} />
          </div>
          <div className="lg:col-span-2">
            <Label>Stock</Label>
            <Input type="number" {...register(`variants.${index}.quantity`, { valueAsNumber: true })} placeholder="Stock" />
          </div>
          <div className="lg:col-span-1">
            <Label>Threshold</Label>
            <Input type="number" {...register(`variants.${index}.lowStockThreshold`, { valueAsNumber: true })} placeholder="Threshold" />
          </div>
          <div className="flex items-end justify-end lg:col-span-1">
            <Button size="icon" variant="destructive" type="button" onClick={() => remove(index)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="rounded-2xl bg-slate-50 px-4 py-3 lg:col-span-12">
            {(() => {
              const additionalPrice = Number(variants[index]?.additionalPrice ?? 0);
              const variantMrp = Number(basePrice ?? 0) + additionalPrice;
              const variantSellingPrice = variantMrp - (variantMrp * Number(discountPercent ?? 0)) / 100;

              return (
                <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                  <span>Variant MRP: <strong className="text-slate-900">{formatCurrency(variantMrp)}</strong></span>
                  <span>Live price: <strong className="text-slate-900">{formatCurrency(variantSellingPrice)}</strong></span>
                  <span>Discount: <strong className="text-slate-900">{Number(discountPercent ?? 0)}%</strong></span>
                </div>
              );
            })()}
          </div>
          </div>
        </div>
      ))}
      <Button
        type="button"
        variant="secondary"
        onClick={() =>
          append({
            size: "M",
            color: "Black",
            colorHex: "#111827",
            sku: `SKU-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
            additionalPrice: 0,
            quantity: 0,
            lowStockThreshold: 5,
          })
        }
      >
        <Plus className="h-4 w-4" />
        Add variant
      </Button>
      <p className="text-xs text-slate-500">Variant additional price is added to the product MRP first, then the product discount is applied on that full variant price.</p>
    </div>
  );
}
