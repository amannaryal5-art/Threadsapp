"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { AppButton } from "@/components/shared/AppButton";
import { ProductImage } from "@/components/shared/ProductImage";
import { getProductThumbnail } from "@/lib/product-media";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useUiStore } from "@/store/uiStore";

export function CartDrawer() {
  const isOpen = useUiStore((state) => state.isCartDrawerOpen);
  const close = useUiStore((state) => state.closeCartDrawer);
  const { items, subtotal } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.div className="fixed inset-0 z-40 bg-secondary/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.25 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white p-6 shadow-card"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-secondary">Your Cart</h3>
              <button onClick={close}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-6 flex-1 space-y-4 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 rounded-3xl bg-background p-3">
                  <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-white">
                    <ProductImage src={getProductThumbnail(item.Product)} alt={item.Product?.name ?? "Cart item"} className="object-cover" sizes="80px" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-secondary">{item.Product?.name}</p>
                    <p className="mt-1 text-xs text-secondary/50">
                      {item.ProductVariant?.size} | {item.ProductVariant?.color}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-primary">{formatCurrency(item.priceAtAdd)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-secondary/10 pt-4">
              <div className="mb-4 flex items-center justify-between text-secondary">
                <span>Total</span>
                <span className="font-semibold">{formatCurrency(subtotal)}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <AppButton variant="outline" onClick={() => (window.location.href = "/cart")}>
                  View Cart
                </AppButton>
                <AppButton onClick={() => (window.location.href = "/checkout")}>Checkout</AppButton>
              </div>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
