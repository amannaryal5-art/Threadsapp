"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { ActiveFilterChips } from "@/components/listing/ActiveFilterChips";
import { FilterDrawer } from "@/components/listing/FilterDrawer";
import { FilterSidebar } from "@/components/listing/FilterSidebar";
import { ListingHeader } from "@/components/listing/ListingHeader";
import { ProductGrid } from "@/components/products/ProductGrid";
import { SortDropdown } from "@/components/listing/SortDropdown";
import { EmptyState } from "@/components/shared/EmptyState";
import { SkeletonGrid } from "@/components/shared/SkeletonGrid";
import { useInfiniteProducts } from "@/hooks/useInfiniteProducts";
import type { ProductFilters } from "@/types/filter.types";

export function ListingPageView({
  title,
  endpoint,
  initialFilters,
  basePath
}: {
  title: string;
  endpoint: string;
  initialFilters: ProductFilters;
  basePath: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { ref, inView } = useInView();
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteProducts(endpoint, initialFilters);

  useEffect(() => {
    if (inView && hasNextPage) fetchNextPage();
  }, [fetchNextPage, hasNextPage, inView]);

  const products = data?.pages.flatMap((page) => page.data.products) ?? [];
  const meta = data?.pages[0]?.meta;

  const updateParam = (key: string, value?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value) params.delete(key);
    else params.set(key, value);
    router.push(`?${params.toString()}`);
  };

  const activeFilters = useMemo(() => {
    const result: Array<{ key: string; label: string }> = [];
    searchParams.forEach((value, key) => result.push({ key, label: `${key}: ${value}` }));
    return result.filter((item) => !["page"].includes(item.key));
  }, [searchParams]);

  const filterProps = {
    minPrice: Number(searchParams.get("minPrice") ?? initialFilters.minPrice ?? 0),
    maxPrice: Number(searchParams.get("maxPrice") ?? initialFilters.maxPrice ?? 10000),
    selectedSizes: (searchParams.get("size")?.split(",") ?? initialFilters.size ?? []).filter(Boolean),
    selectedDiscounts: (searchParams.get("discount")?.split(",").map(Number) ?? initialFilters.discount ?? []).filter(Boolean),
    selectedRating: Number(searchParams.get("rating") ?? initialFilters.rating ?? 0) || undefined,
    onMinPriceChange: (value: number) => updateParam("minPrice", value ? String(value) : undefined),
    onMaxPriceChange: (value: number) => updateParam("maxPrice", value ? String(value) : undefined),
    onToggleSize: (value: string) => updateParam("size", value),
    onToggleDiscount: (value: number) => updateParam("discount", String(value)),
    onRatingChange: (value: number) => updateParam("rating", String(value)),
    onClear: () => router.push(basePath)
  };

  return (
    <main className="container py-8">
      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <FilterSidebar {...filterProps} />
        <div className="space-y-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <ListingHeader title={title} count={meta?.total ?? products.length} />
            <div className="flex items-center gap-3">
              <FilterDrawer {...filterProps} />
              <SortDropdown value={searchParams.get("sort") ?? initialFilters.sort ?? "newest"} onChange={(value) => updateParam("sort", value)} />
            </div>
          </div>
          <ActiveFilterChips filters={activeFilters} onRemove={(key) => updateParam(key)} />
          {isLoading ? (
            <SkeletonGrid />
          ) : products.length ? (
            <>
              <ProductGrid products={products} />
              <div ref={ref} className="py-4 text-center text-sm text-secondary/50">
                {isFetchingNextPage ? "Loading more..." : hasNextPage ? "Scroll to load more" : "You’ve reached the end"}
              </div>
            </>
          ) : (
            <EmptyState title="No products found" description="Try adjusting your filters or search for a different style direction." ctaHref="/" ctaLabel="Explore Home" />
          )}
        </div>
      </div>
    </main>
  );
}
