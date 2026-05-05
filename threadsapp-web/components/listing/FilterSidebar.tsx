"use client";

import { FILTER_DISCOUNTS, FILTER_RATINGS, FILTER_SIZES } from "@/lib/constants";
import { AppButton } from "@/components/shared/AppButton";
import { PriceRangeSlider } from "@/components/listing/PriceRangeSlider";

interface FilterSidebarProps {
  mobile?: boolean;
  minPrice?: number;
  maxPrice?: number;
  selectedSizes: string[];
  selectedDiscounts: number[];
  selectedRating?: number;
  onMinPriceChange: (value: number) => void;
  onMaxPriceChange: (value: number) => void;
  onToggleSize: (value: string) => void;
  onToggleDiscount: (value: number) => void;
  onRatingChange: (value: number) => void;
  onClear: () => void;
}

export function FilterSidebar(props: FilterSidebarProps) {
  return (
    <aside className={`${props.mobile ? "block" : "hidden lg:block"} rounded-[32px] bg-white p-6 shadow-soft`}>
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-secondary">Filters</h3>
        <AppButton variant="ghost" onClick={props.onClear}>
          Clear All
        </AppButton>
      </div>
      <div className="space-y-8">
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-secondary/40">Price Range</h4>
          <PriceRangeSlider
            minPrice={props.minPrice}
            maxPrice={props.maxPrice}
            onMinPriceChange={props.onMinPriceChange}
            onMaxPriceChange={props.onMaxPriceChange}
          />
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-secondary/40">Size</h4>
          <div className="flex flex-wrap gap-2">
            {FILTER_SIZES.map((size) => (
              <button
                key={size}
                onClick={() => props.onToggleSize(size)}
                className={`rounded-full border px-4 py-2 text-sm ${props.selectedSizes.includes(size) ? "border-primary bg-primary/10 text-primary" : "border-secondary/10 text-secondary"}`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-secondary/40">Discount</h4>
          <div className="flex flex-wrap gap-2">
            {FILTER_DISCOUNTS.map((discount) => (
              <button
                key={discount}
                onClick={() => props.onToggleDiscount(discount)}
                className={`rounded-full border px-4 py-2 text-sm ${props.selectedDiscounts.includes(discount) ? "border-primary bg-primary/10 text-primary" : "border-secondary/10 text-secondary"}`}
              >
                {discount}%+
              </button>
            ))}
          </div>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-secondary/40">Rating</h4>
          <div className="flex flex-wrap gap-2">
            {FILTER_RATINGS.map((rating) => (
              <button
                key={rating}
                onClick={() => props.onRatingChange(rating)}
                className={`rounded-full border px-4 py-2 text-sm ${props.selectedRating === rating ? "border-primary bg-primary/10 text-primary" : "border-secondary/10 text-secondary"}`}
              >
                {rating}★+
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
