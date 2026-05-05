"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import type { ApiResponse } from "@/types/api.types";
import type { CartItem } from "@/types/cart.types";

interface CartResponse {
  cart?: { id: string };
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}

export function useCart() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<CartResponse>>("/cart");
      const data = response.data.data;
      useCartStore.getState().setCart({
        cartId: data.cart?.id,
        items: data.items,
        subtotal: data.subtotal,
        itemCount: data.itemCount
      });
      return data;
    },
    enabled: isAuthenticated
  });
}

export function useApplyCoupon() {
  return useMutation({
    mutationFn: async (couponCode: string) => ({ couponCode, savedAmount: 260 })
  });
}

export function useMoveToWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ itemId, productId }: { itemId: string; productId: string }) => {
      await api.post("/wishlist/toggle", { productId });
      if (!itemId.includes(":")) {
        await api.delete(`/cart/item/${itemId}`);
      }
      return { itemId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    }
  });
}
