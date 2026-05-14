"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { PRODUCT_IMAGE_FALLBACK, debugProductMedia, getProductThumbnail } from "@/lib/product-media";
import type { Product, ProductImage } from "@/types/product.types";

export function ProductImageGallery({ product }: { product: Product }) {
  const images = useMemo<ProductImage[]>(
    () =>
      (product.images ?? [])
        .slice()
        .sort((left, right) => {
          if (left.isPrimary !== right.isPrimary) return left.isPrimary ? -1 : 1;
          return left.displayOrder - right.displayOrder;
        }),
    [product.images],
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = images[selectedIndex] ?? images[0];
  const selectedImageUrl = selectedImage?.url ?? getProductThumbnail(product) ?? PRODUCT_IMAGE_FALLBACK;

  if (process.env.NODE_ENV !== "production") {
    debugProductMedia(`ProductImageGallery:${product.slug}`, product);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[96px_1fr]">
      <div className="order-2 flex gap-3 overflow-x-auto lg:order-1 lg:flex-col">
        {images.map((image, index) => (
          <button
            key={image.id}
            onClick={() => setSelectedIndex(index)}
            className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border ${selectedIndex === index ? "border-primary" : "border-secondary/10"}`}
          >
            <Image src={image.url} alt={image.altText ?? product.name} fill sizes="80px" className="object-cover" />
          </button>
        ))}
      </div>
      <div className="order-1 overflow-hidden rounded-[32px] bg-white p-4 shadow-soft">
        <div className="relative h-[520px] overflow-hidden rounded-[28px] bg-background">
          {selectedImageUrl ? (
            <Zoom>
              <img src={selectedImageUrl} alt={selectedImage?.altText ?? product.name} className="h-full w-full object-cover" />
            </Zoom>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-secondary/50">
              Product image will appear here once uploaded.
            </div>
          )}
          {images.length ? (
            <span className="absolute bottom-4 right-4 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-secondary">
              {selectedIndex + 1}/{images.length}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
