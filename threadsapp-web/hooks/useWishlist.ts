"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import { useWishlistStore } from "@/store/wishlistStore";
import type { ApiResponse } from "@/types/api.types";
import type { Product } from "@/types/product.types";

interface WishlistItem {
  id: string;
  productId: string;
  Product: Product;
}

export function useWishlist() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<{ items: WishlistItem[] }>>("/wishlist");
      const items = response.data.data.items;
      useWishlistStore.getState().setWishlist(items.map((item) => item.productId));
      return items;
    },
    enabled: isAuthenticated
  });
}
