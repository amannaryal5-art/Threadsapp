import type { Product, ProductImage } from "@/types/product.types";

export const PRODUCT_IMAGE_FALLBACK = "/og-image.png";

export function sortProductImages(images?: ProductImage[]) {
  return [...(images ?? [])].sort((left, right) => {
    if (Boolean(left.isPrimary) !== Boolean(right.isPrimary)) return left.isPrimary ? -1 : 1;
    return left.displayOrder - right.displayOrder;
  });
}

export function getProductImages(product?: Pick<Product, "images"> | null) {
  return sortProductImages(product?.images);
}

export function getProductThumbnail(product?: Pick<Product, "thumbnail" | "images"> | null) {
  return product?.thumbnail ?? getProductImages(product)[0]?.url ?? PRODUCT_IMAGE_FALLBACK;
}

export function debugProductMedia(label: string, product?: Partial<Product> | null) {
  if (process.env.NODE_ENV === "production") return;
  console.log(`[product-media] ${label}`, product);
  console.log(`[product-media] ${label}.images`, product?.images);
  console.log(`[product-media] ${label}.thumbnail`, product?.thumbnail ?? getProductThumbnail(product as Pick<Product, "thumbnail" | "images">));
}
