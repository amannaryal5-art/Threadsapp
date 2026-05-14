import type { Product, ProductImage } from "@/types/product.types";

export function sortProductImages(images?: ProductImage[]) {
  return [...(images ?? [])].sort((left, right) => {
    if (Boolean(left.isPrimary) !== Boolean(right.isPrimary)) return left.isPrimary ? -1 : 1;
    return left.displayOrder - right.displayOrder;
  });
}

export function getProductThumbnail(product?: Pick<Product, "thumbnail" | "images"> | null) {
  return product?.thumbnail ?? sortProductImages(product?.images)[0]?.url ?? null;
}

export function debugProductMedia(label: string, product?: Partial<Product> | null) {
  if (process.env.NODE_ENV === "production") return;
  console.log(`[admin-product-media] ${label}`, product);
  console.log(`[admin-product-media] ${label}.images`, product?.images);
  console.log(`[admin-product-media] ${label}.thumbnail`, product?.thumbnail ?? getProductThumbnail(product as Pick<Product, "thumbnail" | "images">));
}
