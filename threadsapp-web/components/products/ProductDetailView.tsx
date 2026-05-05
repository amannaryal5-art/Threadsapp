"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Heart, Minus, Plus, Sparkles, Copy, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { AddToCartBar } from "@/components/products/AddToCartBar";
import { ColorSelector } from "@/components/products/ColorSelector";
import { DeliveryChecker } from "@/components/products/DeliveryChecker";
import { PriceBadge } from "@/components/shared/PriceBadge";
import { ProductImageGallery } from "@/components/products/ProductImageGallery";
import { RatingSummary } from "@/components/products/RatingSummary";
import { ReviewsList } from "@/components/products/ReviewsList";
import { ShareButton } from "@/components/shared/ShareButton";
import { SimilarProducts } from "@/components/products/SimilarProducts";
import { RecentlyViewed } from "@/components/products/RecentlyViewed";
import { SizeGuide } from "@/components/products/SizeGuide";
import { SizeSelector } from "@/components/products/SizeSelector";
import { StarRating } from "@/components/shared/StarRating";
import { AppButton } from "@/components/shared/AppButton";
import { WriteReview } from "@/components/products/WriteReview";
import { useCartStore } from "@/store/cartStore";
import { useUiStore } from "@/store/uiStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import type { Product, ProductReview } from "@/types/product.types";

export function ProductDetailView({
  product,
  reviews,
  similar
}: {
  product: Product;
  reviews: ProductReview[];
  similar: Product[];
}) {
  const variants = product.variants ?? [];
  const [selectedVariant, setSelectedVariant] = useState(variants[0]);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const openCartDrawer = useUiStore((state) => state.openCartDrawer);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const recent = useRecentlyViewed(product);

  const groupedByColor = useMemo(
    () => variants.filter((variant, index, array) => array.findIndex((item) => item.color === variant.color) === index),
    [variants]
  );

  return (
    <main className="container py-8">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <ProductImageGallery product={product} />
        <section className="space-y-6">
          <div>
            <Link href={`/brand/${product.Brand?.slug}`} className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              {product.Brand?.name}
            </Link>
            <h1 className="mt-2 text-3xl font-bold text-secondary">{product.name}</h1>
            <a href="#reviews" className="mt-3 inline-flex items-center gap-2 text-sm text-secondary/65">
              <StarRating rating={product.averageRating || 4.3} />
              {product.averageRating?.toFixed(1) ?? "4.3"} · {product.totalReviews} Reviews
            </a>
          </div>
          <div>
            <PriceBadge price={product.sellingPrice} mrp={product.basePrice} discount={product.discountPercent} />
            <p className="mt-2 text-sm text-secondary/50">Inclusive of all taxes</p>
          </div>
          <details className="rounded-[28px] border border-secondary/10 p-5" open>
            <summary className="cursor-pointer font-semibold text-secondary">Offers</summary>
            <div className="mt-3 space-y-2 text-sm text-secondary/65">
              <p>Bank Offer: 10% off on SBI Credit Card, up to ₹500</p>
              <p>Special Price: Get extra 5% off</p>
            </div>
          </details>
          <div>
            <p className="mb-3 text-sm font-semibold text-secondary">Color: {selectedVariant?.color ?? groupedByColor[0]?.color}</p>
            <ColorSelector variants={groupedByColor} selectedId={selectedVariant?.id} onSelect={setSelectedVariant} />
          </div>
          <div>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-secondary">Size</p>
              <SizeGuide />
            </div>
            <SizeSelector variants={variants.filter((variant) => variant.color === selectedVariant?.color)} selectedId={selectedVariant?.id} onSelect={setSelectedVariant} />
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold text-secondary">Quantity</p>
            <div className="inline-flex items-center rounded-full border border-secondary/10">
              <button className="px-4 py-3" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>
                <Minus className="h-4 w-4" />
              </button>
              <span className="px-4">{quantity}</span>
              <button className="px-4 py-3" onClick={() => setQuantity((value) => value + 1)}>
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
          <DeliveryChecker />
          <div className="grid gap-3 sm:grid-cols-2">
            <AppButton variant="outline" onClick={() => toggleWishlist(product.id)}>
              <Heart className="h-4 w-4" />
              Wishlist
            </AppButton>
            <AppButton
              onClick={async () => {
                if (!selectedVariant) {
                  toast.error("Select a size before adding to cart.");
                  return;
                }
                await addItem({ product, variant: selectedVariant, quantity });
                openCartDrawer();
              }}
            >
              Add to Cart
            </AppButton>
          </div>
          <div className="grid gap-3 rounded-[28px] bg-white p-5 shadow-soft">
            <div className="flex items-center gap-3 text-sm text-secondary/70"><CheckCircle2 className="h-4 w-4 text-primary" /> Fabric: {product.fabric ?? "Pure Cotton"}</div>
            <div className="flex items-center gap-3 text-sm text-secondary/70"><Sparkles className="h-4 w-4 text-primary" /> Fit: {product.fit ?? "Regular"}</div>
            <div className="flex items-center gap-3 text-sm text-secondary/70"><CheckCircle2 className="h-4 w-4 text-primary" /> Pattern: {product.pattern ?? "Floral"}</div>
            <div className="flex items-center gap-3 text-sm text-secondary/70"><Sparkles className="h-4 w-4 text-primary" /> Occasion: {product.occasion ?? "Casual"}</div>
          </div>
          <details className="rounded-[28px] border border-secondary/10 p-5" open>
            <summary className="cursor-pointer font-semibold text-secondary">Description</summary>
            <div className="prose prose-sm mt-4 max-w-none text-secondary/65" dangerouslySetInnerHTML={{ __html: product.description ?? "<p>Designed to move with you across the week.</p>" }} />
          </details>
          <details className="rounded-[28px] border border-secondary/10 p-5">
            <summary className="cursor-pointer font-semibold text-secondary">Care Instructions</summary>
            <p className="mt-4 text-sm text-secondary/65">{product.care ?? "Machine wash cold with like colors. Do not bleach."}</p>
          </details>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={async () => {
                await navigator.clipboard.writeText(window.location.href);
                toast.success("Link copied");
              }}
              className="inline-flex items-center gap-2 rounded-full border border-secondary/10 px-4 py-3 text-sm"
            >
              <Copy className="h-4 w-4" />
              Copy Link
            </button>
            <ShareButton title={product.name} text={product.name} url={typeof window !== "undefined" ? window.location.href : ""} />
          </div>
        </section>
      </div>
      <section id="reviews" className="mt-16 grid gap-8 lg:grid-cols-[380px_1fr]">
        <div className="space-y-5">
          <RatingSummary rating={product.averageRating || 4.3} count={product.totalReviews || 128} />
          <WriteReview productId={product.id} orderItemId="00000000-0000-0000-0000-000000000000" />
        </div>
        <ReviewsList reviews={reviews} />
      </section>
      <div className="mt-16">
        <SimilarProducts products={similar} />
      </div>
      <div className="mt-16">
        <RecentlyViewed products={recent} />
      </div>
      {selectedVariant ? <AddToCartBar product={product} variant={selectedVariant} /> : null}
    </main>
  );
}
