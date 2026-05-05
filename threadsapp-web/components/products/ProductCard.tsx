"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";
import { PriceBadge } from "@/components/shared/PriceBadge";
import { StarRating } from "@/components/shared/StarRating";
import { useCartStore } from "@/store/cartStore";
import { useUiStore } from "@/store/uiStore";
import { useWishlistStore } from "@/store/wishlistStore";
import type { Product } from "@/types/product.types";

export function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const isWishlisted = useWishlistStore((state) => state.isWishlisted(product.id));
  const addItem = useCartStore((state) => state.addItem);
  const openCartDrawer = useUiStore((state) => state.openCartDrawer);
  const images = product.images ?? [];
  const primary = images[0]?.url ?? "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80";
  const secondary = images[1]?.url ?? primary;
  const firstVariant = product.variants?.find((variant) => (variant.inventory?.quantity ?? 0) > 0) ?? product.variants?.[0];
  const canAddToCart = Boolean(firstVariant);

  return (
    <motion.article whileHover={{ scale: 1.02 }} className="group overflow-hidden rounded-[28px] bg-white p-4 shadow-soft">
      <div className="relative overflow-hidden rounded-[22px] bg-background">
        <Link href={`/products/${product.slug}`}>
          <div className={`relative ${compact ? "h-52" : "h-72"}`}>
            <Image src={primary} alt={product.name} fill className="object-cover transition duration-300 group-hover:opacity-0" />
            <Image src={secondary} alt={product.name} fill className="object-cover opacity-0 transition duration-300 group-hover:opacity-100" />
          </div>
        </Link>
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          className={`absolute right-3 top-3 rounded-full bg-white p-2 shadow-soft ${isWishlisted ? "text-primary" : "text-secondary"}`}
        >
          <Heart className={isWishlisted ? "fill-current" : ""} size={16} />
        </button>
        {product.discountPercent ? (
          <span className="absolute left-3 top-3 rounded-full bg-error px-3 py-1 text-xs font-semibold text-white">
            -{product.discountPercent}%
          </span>
        ) : null}
        <button
          type="button"
          disabled={!canAddToCart}
          onClick={async (event) => {
            event.preventDefault();
            event.stopPropagation();

            if (!firstVariant) {
              toast.error("Select this product to choose a size before adding to cart.");
              return;
            }

            await addItem({ product, variant: firstVariant, quantity: 1 });
            openCartDrawer();
          }}
          className="absolute inset-x-3 bottom-3 flex translate-y-6 items-center justify-center gap-2 rounded-full bg-secondary px-4 py-3 text-sm font-semibold text-white opacity-0 transition disabled:cursor-not-allowed disabled:bg-secondary/40 group-hover:translate-y-0 group-hover:opacity-100"
        >
          <ShoppingBag className="h-4 w-4" />
          {canAddToCart ? "Add to Cart" : "View Product"}
        </button>
      </div>
      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-secondary/40">{product.Brand?.name ?? "ThreadsApp"}</p>
        <Link href={`/products/${product.slug}`} className="mt-2 line-clamp-2 block min-h-12 text-sm font-medium text-secondary">
          {product.name}
        </Link>
        <div className="mt-3">
          <PriceBadge price={product.sellingPrice} mrp={product.basePrice} discount={product.discountPercent} />
        </div>
        <div className="mt-3 flex items-center gap-2">
          <StarRating rating={product.averageRating || 4} />
          <span className="text-sm text-secondary/60">
            {product.averageRating?.toFixed(1) ?? "4.0"} ({product.totalReviews})
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {(product.variants ?? []).slice(0, 4).map((variant) => (
            <span
              key={variant.id}
              className={`rounded-full px-3 py-1 text-xs ${variant.inventory?.quantity ? "bg-background text-secondary" : "bg-secondary/5 text-secondary/30 line-through"}`}
            >
              {variant.size}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}
