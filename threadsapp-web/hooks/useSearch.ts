"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { ApiResponse } from "@/types/api.types";
import type { Product } from "@/types/product.types";

export function useSearch(query: string) {
  return useQuery({
    queryKey: ["search", query],
    queryFn: async () => {
      const response = await api.get<ApiResponse<{ products: Product[] }>>(`/search?q=${encodeURIComponent(query)}`);
      return response.data.data.products;
    },
    enabled: query.trim().length > 1
  });
}

export function useSearchSuggestions(query: string) {
  return useQuery({
    queryKey: ["search-suggestions", query],
    queryFn: async () => {
      const response = await api.get<ApiResponse<{ suggestions: string[] }>>(
        `/search/suggestions?q=${encodeURIComponent(query)}`
      );
      return response.data.data.suggestions;
    },
    enabled: query.trim().length > 1
  });
}

export function useTrendingSearches() {
  return useQuery({
    queryKey: ["trending-searches"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<{ keywords: string[] }>>("/search/trending");
      return response.data.data.keywords;
    }
  });
}
