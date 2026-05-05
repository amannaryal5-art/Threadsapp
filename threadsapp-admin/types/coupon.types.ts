export interface Coupon {
  id: string;
  code: string;
  description?: string | null;
  type: "percent" | "flat";
  value: string | number;
  minOrderAmount: string | number;
  maxDiscount?: string | number | null;
  usageLimit?: number | null;
  usageCount: number;
  perUserLimit: number;
  isActive: boolean;
  expiresAt?: string | null;
  applicableCategories?: string[] | null;
}
