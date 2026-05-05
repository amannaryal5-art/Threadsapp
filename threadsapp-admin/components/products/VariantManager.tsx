"use client";

import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, type Control, type UseFormRegister } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ProductFormValues } from "@/validations/product.schema";

export function VariantManager({
  control,
  register,
}: {
  control: Control<ProductFormValues>;
  register: UseFormRegister<ProductFormValues>;
}) {
  const { fields, append, remove } = useFieldArray({ control, name: "variants" });

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <div key={field.id} className="grid gap-3 rounded-2xl border border-border p-4 md:grid-cols-6">
          <div>
            <Label>Size</Label>
            <Input {...register(`variants.${index}.size`)} />
          </div>
          <div>
            <Label>Color</Label>
            <Input {...register(`variants.${index}.color`)} />
          </div>
          <div>
            <Label>Hex</Label>
            <Input {...register(`variants.${index}.colorHex`)} />
          </div>
          <div>
            <Label>SKU</Label>
            <Input {...register(`variants.${index}.sku`)} />
          </div>
          <div>
            <Label>Additional price</Label>
            <Input type="number" {...register(`variants.${index}.additionalPrice`, { valueAsNumber: true })} />
          </div>
          <div className="flex items-end justify-between gap-2">
            <div className="grid flex-1 grid-cols-2 gap-2">
              <Input type="number" {...register(`variants.${index}.quantity`, { valueAsNumber: true })} placeholder="Stock" />
              <Input type="number" {...register(`variants.${index}.lowStockThreshold`, { valueAsNumber: true })} placeholder="Threshold" />
            </div>
            <Button size="icon" variant="destructive" type="button" onClick={() => remove(index)}>
              <Trash2 className="h-4 w-4" />
            </Button>
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
            sku: `SKU-${Date.now()}`,
            additionalPrice: 0,
            quantity: 0,
            lowStockThreshold: 5,
          })
        }
      >
        <Plus className="h-4 w-4" />
        Add variant
      </Button>
    </div>
  );
}
