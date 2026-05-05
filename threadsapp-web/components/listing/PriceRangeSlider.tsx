"use client";

import { AppInput } from "@/components/shared/AppInput";

export function PriceRangeSlider({
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange
}: {
  minPrice?: number;
  maxPrice?: number;
  onMinPriceChange: (value: number) => void;
  onMaxPriceChange: (value: number) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <AppInput
        label="Min"
        type="number"
        value={minPrice ?? ""}
        onChange={(event) => onMinPriceChange(Number(event.target.value))}
      />
      <AppInput
        label="Max"
        type="number"
        value={maxPrice ?? ""}
        onChange={(event) => onMaxPriceChange(Number(event.target.value))}
      />
    </div>
  );
}
