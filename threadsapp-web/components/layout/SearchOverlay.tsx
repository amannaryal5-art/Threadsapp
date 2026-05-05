"use client";

import Link from "next/link";
import { Search, X } from "lucide-react";
import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearchSuggestions, useTrendingSearches } from "@/hooks/useSearch";
import { useUiStore } from "@/store/uiStore";

export function SearchOverlay() {
  const isOpen = useUiStore((state) => state.isSearchOpen);
  const close = useUiStore((state) => state.closeSearch);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query);
  const { data: suggestions = [] } = useSearchSuggestions(debouncedQuery);
  const { data: trending = [] } = useTrendingSearches();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-secondary/60 backdrop-blur-sm">
      <div className="mx-auto mt-10 max-w-3xl rounded-[32px] bg-white p-6 shadow-card">
        <div className="flex items-center gap-3 rounded-full border border-secondary/10 px-4 py-3">
          <Search className="h-5 w-5 text-secondary/40" />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search for kurtas, oversized shirts, sneakers..."
            className="w-full bg-transparent outline-none"
          />
          <button onClick={close} aria-label="Close search">
            <X className="h-5 w-5 text-secondary/40" />
          </button>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary/40">Suggestions</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {suggestions.map((item) => (
                <Link
                  key={item}
                  href={`/search?q=${encodeURIComponent(item)}`}
                  onClick={close}
                  className="rounded-full bg-background px-4 py-2 text-sm text-secondary"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary/40">Trending</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {trending.map((item) => (
                <Link
                  key={item}
                  href={`/search?q=${encodeURIComponent(item)}`}
                  onClick={close}
                  className="rounded-full border border-secondary/10 px-4 py-2 text-sm text-secondary"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
