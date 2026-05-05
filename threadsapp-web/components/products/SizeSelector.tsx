"use client";

import { cn } from "@/lib/utils";
import type { ProductVariant } from "@/types/product.types";

export function SizeSelector({
  variants,
  selectedId,
  onSelect
}: {
  variants: ProductVariant[];
  selectedId?: string;
  onSelect: (variant: ProductVariant) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {variants.map((variant) => {
        const disabled = !variant.inventory?.quantity;
        return (
          <button
            key={variant.id}
            disabled={disabled}
            onClick={() => onSelect(variant)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium",
              selectedId === variant.id ? "border-primary bg-primary/10 text-primary" : "border-secondary/10 text-secondary",
              disabled && "cursor-not-allowed border-secondary/10 bg-secondary/5 text-secondary/30 line-through"
            )}
          >
            {variant.size}
          </button>
        );
      })}
    </div>
  );
}
