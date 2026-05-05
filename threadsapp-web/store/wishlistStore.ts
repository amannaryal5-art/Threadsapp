"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";

interface WishlistState {
  productIds: string[];
  isUpdating: boolean;
  setWishlist: (productIds: string[]) => void;
  toggleWishlist: (productId: string) => Promise<void>;
  isWishlisted: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      productIds: [],
      isUpdating: false,
      setWishlist: (productIds) => set({ productIds }),
      isWishlisted: (productId) => get().productIds.includes(productId),
      toggleWishlist: async (productId) => {
        const previous = get().productIds;
        const exists = previous.includes(productId);
        const optimistic = exists ? previous.filter((id) => id !== productId) : [...previous, productId];
        set({ productIds: optimistic, isUpdating: true });

        try {
          if (useAuthStore.getState().isAuthenticated) {
            await api.post("/wishlist/toggle", { productId });
          }
        } catch (error) {
          set({ productIds: previous });
          toast.error("Could not update wishlist");
          throw error;
        } finally {
          set({ isUpdating: false });
        }
      }
    }),
    { name: "threadsapp-wishlist" }
  )
);
