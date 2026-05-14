import type { Product, ProductVariant } from "@/types/product.types";

function roundCurrency(value: number) {
  return Number(value.toFixed(2));
}

export function getVariantMrp(product: Pick<Product, "basePrice">, variant?: Pick<ProductVariant, "additionalPrice"> | null) {
  return roundCurrency(Number(product.basePrice ?? 0) + Number(variant?.additionalPrice ?? 0));
}

export function getVariantSellingPrice(
  product: Pick<Product, "basePrice" | "discountPercent">,
  variant?: Pick<ProductVariant, "additionalPrice"> | null
) {
  const mrp = getVariantMrp(product, variant);
  return roundCurrency(mrp - (mrp * Number(product.discountPercent ?? 0)) / 100);
}

export function getFirstAvailableVariant(product: Product) {
  return product.variants?.find((variant) => (variant.inventory?.quantity ?? 0) > 0) ?? product.variants?.[0];
}
