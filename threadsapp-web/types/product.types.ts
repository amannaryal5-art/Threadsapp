export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  isActive?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  image?: string | null;
  displayOrder?: number;
  children?: Category[];
}

export interface ProductImage {
  id: string;
  productId: string;
  variantId?: string | null;
  url: string;
  altText?: string | null;
  isPrimary: boolean;
  displayOrder: number;
}

export interface Inventory {
  id: string;
  variantId: string;
  quantity: number;
  lowStockThreshold: number;
}

export interface ProductVariant {
  id: string;
  productId: string;
  size: string;
  color: string;
  colorHex?: string | null;
  sku: string;
  additionalPrice: number | string;
  inventory?: Inventory;
  variantImages?: ProductImage[];
}

export interface ProductReview {
  id: string;
  userId: string;
  productId: string;
  orderItemId: string;
  rating: number;
  title?: string | null;
  comment?: string | null;
  photos?: string[];
  helpfulCount: number;
  isVerifiedPurchase: boolean;
  isApproved?: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  categoryId: string;
  brandId: string;
  basePrice: number | string;
  discountPercent: number;
  sellingPrice: number | string;
  fabric?: string | null;
  pattern?: string | null;
  occasion?: string | null;
  fit?: string | null;
  care?: string | null;
  countryOfOrigin?: string | null;
  isActive: boolean;
  isFeatured: boolean;
  averageRating: number;
  totalReviews: number;
  totalSold: number;
  tags: string[];
  createdAt: string;
  Brand?: Brand;
  Category?: Category;
  variants?: ProductVariant[];
  images?: ProductImage[];
}
