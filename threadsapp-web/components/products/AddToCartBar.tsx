"use client";

import { Heart, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";
import { AppButton } from "@/components/shared/AppButton";
import { useCartStore } from "@/store/cartStore";
import { useUiStore } from "@/store/uiStore";
import { useWishlistStore } from "@/store/wishlistStore";
import type { Product, ProductVariant } from "@/types/product.types";

export function AddToCartBar({ product, variant }: { product: Product; variant: ProductVariant }) {
  const addItem = useCartStore((state) => state.addItem);
  const openCartDrawer = useUiStore((state) => state.openCartDrawer);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const inStock = (variant.inventory?.quantity ?? 0) > 0;
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-secondary/10 bg-white p-4 lg:hidden">
      <div className="container flex gap-3">
        <AppButton variant="outline" className="flex-1" onClick={() => toggleWishlist(product.id)}>
          <Heart className="h-4 w-4" />
          Wishlist
        </AppButton>
        <AppButton
          className="flex-1"
          disabled={!inStock}
          onClick={async () => {
            if (!variant) {
              toast.error("Select a size before adding to cart.");
              return;
            }
            if (!inStock) {
              toast.error("This size is out of stock.");
              return;
            }
            await addItem({ product, variant, quantity: 1 });
            openCartDrawer();
          }}
        >
          <ShoppingBag className="h-4 w-4" />
          {inStock ? "Add to Cart" : "Out of Stock"}
        </AppButton>
      </div>
    </div>
  );
}
