import { ListingPageView } from "@/components/listing/ListingPageView";
import type { ProductFilters } from "@/types/filter.types";

export default function SearchPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const q = typeof searchParams.q === "string" ? searchParams.q : "";
  return <ListingPageView title={q ? `Results for "${q}"` : "Search"} endpoint="/search" basePath={q ? `/search?q=${encodeURIComponent(q)}` : "/search"} initialFilters={{ q, sort: "newest" } satisfies ProductFilters} />;
}
