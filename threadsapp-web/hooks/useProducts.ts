"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { getQueryString } from "@/lib/utils";
import type { ApiResponse } from "@/types/api.types";
import type { Product, ProductReview } from "@/types/product.types";
import type { Brand, Category } from "@/types/product.types";
import type { ProductFilters } from "@/types/filter.types";

export function useHomeProducts() {
  const buildQuery = <T,>(endpoint: string) =>
    useQuery({
      queryKey: ["home", endpoint],
      queryFn: async () => {
        const response = await api.get<ApiResponse<{ products: T[] }>>(endpoint);
        return response.data.data.products;
      }
    });

  return {
    featured: buildQuery<Product>("/products/featured"),
    newArrivals: buildQuery<Product>("/products/new-arrivals"),
    trending: buildQuery<Product>("/products/trending"),
    deals: buildQuery<Product>("/products/deals")
  };
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<{ categories: Category[] }>>("/categories");
      return response.data.data.categories;
    }
  });
}

export function useBrands() {
  return useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<{ brands: Brand[] }>>("/brands");
      return response.data.data.brands;
    }
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const response = await api.get<ApiResponse<{ product: Product }>>(`/products/${slug}`);
      return response.data.data.product;
    },
    enabled: Boolean(slug)
  });
}

export function useProductReviews(slug: string, page = 1, rating?: number) {
  const query = getQueryString({ page, rating });
  return useQuery({
    queryKey: ["product-reviews", slug, page, rating],
    queryFn: async () => {
      const response = await api.get<ApiResponse<{ reviews: ProductReview[] }>>(`/products/${slug}/reviews?${query}`);
      return response.data;
    },
    enabled: Boolean(slug)
  });
}

export function useSimilarProducts(slug: string) {
  return useQuery({
    queryKey: ["similar-products", slug],
    queryFn: async () => {
      const response = await api.get<ApiResponse<{ products: Product[] }>>(`/products/${slug}/similar`);
      return response.data.data.products;
    },
    enabled: Boolean(slug)
  });
}

export function useProducts(filters: ProductFilters) {
  const query = getQueryString({
    ...filters,
    size: filters.size,
    color: filters.color,
    fabric: filters.fabric,
    occasion: filters.occasion
  });

  return useQuery({
    queryKey: ["products", query],
    queryFn: async () => {
      const response = await api.get<ApiResponse<{ products: Product[] }>>(`/products?${query}`);
      return response.data;
    }
  });
}
