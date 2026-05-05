export interface BrandLite {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
}

export interface CategoryLite {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  displayOrder?: number;
  image?: string | null;
  children?: CategoryLite[];
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
  additionalPrice: string | number;
  inventory?: Inventory;
  variantImages?: ProductImage[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  categoryId: string;
  brandId: string;
  basePrice: string | number;
  discountPercent: number;
  sellingPrice: string | number;
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
  Brand?: BrandLite;
  Category?: CategoryLite;
  variants?: ProductVariant[];
  images?: ProductImage[];
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  brand?: string;
  stock?: string;
  featured?: string;
  minPrice?: number;
  maxPrice?: number;
}
