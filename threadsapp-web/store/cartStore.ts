"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import { getVariantMrp, getVariantSellingPrice } from "@/lib/pricing";
import type { CartItem, CartState } from "@/types/cart.types";
import type { Product, ProductVariant } from "@/types/product.types";
import { useAuthStore } from "@/store/authStore";

interface AddToCartPayload {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

interface CartStore extends CartState {
  syncTimeout?: ReturnType<typeof setTimeout>;
  setCart: (payload: Partial<CartState>) => void;
  addItem: (payload: AddToCartPayload) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  mergeGuestCart: () => Promise<void>;
}

function roundCurrency(value: number) {
  return Number(value.toFixed(2));
}

function computeTotals(items: CartItem[], couponDiscount = 0) {
  const mrpTotal = items.reduce((sum, item) => {
    const fallbackMrp = Number(item.priceAtAdd ?? 0);
    const itemMrp = item.Product ? getVariantMrp(item.Product, item.ProductVariant) : fallbackMrp;
    return sum + itemMrp * item.quantity;
  }, 0);
  const subtotal = items.reduce((sum, item) => sum + Number(item.priceAtAdd) * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const shippingCharge = subtotal >= 499 ? 0 : 49;
  const taxableAmount = Math.max(subtotal - couponDiscount, 0) + shippingCharge;
  const taxAmount = taxableAmount * 0.18;
  const totalAmount = taxableAmount + taxAmount;

  return {
    mrpTotal: roundCurrency(mrpTotal),
    subtotal: roundCurrency(subtotal),
    productDiscount: roundCurrency(Math.max(mrpTotal - subtotal, 0)),
    itemCount,
    couponDiscount: roundCurrency(couponDiscount),
    shippingCharge: roundCurrency(shippingCharge),
    taxAmount: roundCurrency(taxAmount),
    totalAmount: roundCurrency(totalAmount)
  };
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      mrpTotal: 0,
      subtotal: 0,
      productDiscount: 0,
      itemCount: 0,
      couponDiscount: 0,
      shippingCharge: 0,
      taxAmount: 0,
      totalAmount: 0,
      setCart: (payload) =>
        set((state) => {
          const nextItems = payload.items ?? state.items;
          const nextCouponDiscount = Number(payload.couponDiscount ?? state.couponDiscount ?? 0);
          const computed = computeTotals(nextItems, nextCouponDiscount);
          return {
            ...state,
            ...payload,
            mrpTotal: payload.mrpTotal ?? computed.mrpTotal,
            subtotal: payload.subtotal ?? computed.subtotal,
            productDiscount: payload.productDiscount ?? computed.productDiscount,
            itemCount: payload.itemCount ?? computed.itemCount,
            couponDiscount: payload.couponDiscount ?? computed.couponDiscount,
            shippingCharge: payload.shippingCharge ?? computed.shippingCharge,
            taxAmount: payload.taxAmount ?? computed.taxAmount,
            totalAmount: payload.totalAmount ?? computed.totalAmount,
          } as Partial<CartStore>;
        }),
      addItem: async ({ product, variant, quantity }) => {
        const optimisticItem: CartItem = {
          id: `${product.id}:${variant.id}`,
          productId: product.id,
          variantId: variant.id,
          quantity,
          priceAtAdd: getVariantSellingPrice(product, variant),
          Product: product,
          ProductVariant: variant
        };

        const previous = get().items;
        const existing = previous.find((item) => item.productId === product.id && item.variantId === variant.id);
        const nextItems = existing
          ? previous.map((item) =>
              item.productId === product.id && item.variantId === variant.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          : [...previous, optimisticItem];

        set({ items: nextItems, ...computeTotals(nextItems, get().couponDiscount) });

        try {
          if (useAuthStore.getState().isAuthenticated) {
            await api.post("/cart/add", {
              productId: product.id,
              variantId: variant.id,
              quantity
            });
          }
          toast.success("Added to cart");
        } catch (error) {
          set({ items: previous, ...computeTotals(previous, get().couponDiscount) });
          toast.error("Could not add item to cart");
          throw error;
        }
      },
      updateQuantity: (itemId, quantity) => {
        const boundedQuantity = Math.max(1, quantity);
        const nextItems = get().items.map((item) =>
          item.id === itemId ? { ...item, quantity: boundedQuantity } : item
        );
        set({ items: nextItems, ...computeTotals(nextItems, get().couponDiscount) });

        const activeTimeout = get().syncTimeout;
        if (activeTimeout) clearTimeout(activeTimeout);
        const syncTimeout = setTimeout(async () => {
          if (!useAuthStore.getState().isAuthenticated) return;
          const target = get().items.find((item) => item.id === itemId);
          if (!target) return;
          try {
            await api.put(`/cart/item/${itemId.split(":").length > 1 ? itemId : itemId}`, {
              quantity: target.quantity
            });
          } catch {
            toast.error("Could not update cart quantity");
          }
        }, 500);

        set({ syncTimeout });
      },
      removeItem: async (itemId) => {
        const previous = get().items;
        const nextItems = previous.filter((item) => item.id !== itemId);
        set({ items: nextItems, ...computeTotals(nextItems, get().couponDiscount) });
        try {
          if (useAuthStore.getState().isAuthenticated && !itemId.includes(":")) {
            await api.delete(`/cart/item/${itemId}`);
          }
        } catch (error) {
          set({ items: previous, ...computeTotals(previous, get().couponDiscount) });
          toast.error("Could not remove item");
          throw error;
        }
      },
      clearCart: async () => {
        const previous = get().items;
        set({
          items: [],
          mrpTotal: 0,
          subtotal: 0,
          productDiscount: 0,
          itemCount: 0,
          couponDiscount: 0,
          taxAmount: 0,
          shippingCharge: 0,
          totalAmount: 0
        });
        try {
          if (useAuthStore.getState().isAuthenticated) {
            await api.delete("/cart/clear");
          }
        } catch (error) {
          set({ items: previous, ...computeTotals(previous, get().couponDiscount) });
          throw error;
        }
      },
      mergeGuestCart: async () => {
        if (!useAuthStore.getState().isAuthenticated) return;
        const guestItems = get().items.filter((item) => item.id.includes(":"));
        if (!guestItems.length) return;
        await Promise.all(
          guestItems.map((item) =>
            api.post("/cart/add", {
              productId: item.productId,
              variantId: item.variantId,
              quantity: item.quantity
            })
          )
        );
      }
    }),
    { name: "threadsapp-cart" }
  )
);
