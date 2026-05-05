"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { PRODUCT_GRID_LIMIT } from "@/lib/constants";
import { getQueryString } from "@/lib/utils";
import type { ApiResponse } from "@/types/api.types";
import type { Product } from "@/types/product.types";
import type { ProductFilters } from "@/types/filter.types";

export function useInfiniteProducts(endpoint: string, filters: ProductFilters) {
  return useInfiniteQuery({
    queryKey: ["infinite-products", endpoint, filters],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const query = getQueryString({
        ...filters,
        page: pageParam,
        limit: filters.limit ?? PRODUCT_GRID_LIMIT,
        size: filters.size,
        color: filters.color,
        fabric: filters.fabric,
        occasion: filters.occasion
      });
      const response = await api.get<ApiResponse<{ products: Product[] }>>(`${endpoint}?${query}`);
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      const nextPage = (lastPage.meta?.page ?? 1) + 1;
      return lastPage.meta && nextPage <= lastPage.meta.totalPages ? nextPage : undefined;
    }
  });
}
