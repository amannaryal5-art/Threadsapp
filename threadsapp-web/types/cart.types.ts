import type { Product, ProductVariant } from "@/types/product.types";

export interface CartItem {
  id: string;
  cartId?: string;
  productId: string;
  variantId: string;
  quantity: number;
  priceAtAdd: number | string;
  Product?: Product;
  ProductVariant?: ProductVariant;
}

export interface CartState {
  cartId?: string;
  items: CartItem[];
  subtotal: number;
  itemCount: number;
  couponCode?: string;
  couponDiscount: number;
  shippingCharge: number;
  taxAmount: number;
}
