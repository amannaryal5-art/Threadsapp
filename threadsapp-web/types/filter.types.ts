export interface ProductFilters {
  page?: number;
  limit?: number;
  sort?: "price_asc" | "price_desc" | "newest" | "popular" | "rating";
  category?: string;
  brand?: string;
  size?: string[];
  color?: string[];
  minPrice?: number;
  maxPrice?: number;
  fabric?: string[];
  occasion?: string[];
  rating?: number;
  discount?: number[];
  inStock?: boolean;
  q?: string;
}
