"use client";

import { cn } from "@/lib/utils";
import type { ProductVariant } from "@/types/product.types";

export function ColorSelector({
  variants,
  selectedId,
  onSelect
}: {
  variants: ProductVariant[];
  selectedId?: string;
  onSelect: (variant: ProductVariant) => void;
}) {
  const unique = variants.filter((variant, index, array) => array.findIndex((item) => item.color === variant.color) === index);
  return (
    <div className="flex flex-wrap gap-3">
      {unique.map((variant) => (
        <button key={variant.id} onClick={() => onSelect(variant)} className="flex items-center gap-2 text-sm text-secondary">
          <span
            className={cn(
              "h-7 w-7 rounded-full border-2 border-white shadow",
              selectedId === variant.id && "ring-2 ring-primary"
            )}
            style={{ backgroundColor: variant.colorHex ?? "#1f2937" }}
          />
          {variant.color}
        </button>
      ))}
    </div>
  );
}
