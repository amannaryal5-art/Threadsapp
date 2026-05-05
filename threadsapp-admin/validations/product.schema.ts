import { z } from "zod";

export const variantSchema = z.object({
  id: z.string().optional(),
  size: z.string().min(1),
  color: z.string().min(1),
  colorHex: z.string().min(1),
  sku: z.string().min(1),
  additionalPrice: z.coerce.number().min(0),
  quantity: z.coerce.number().min(0),
  lowStockThreshold: z.coerce.number().min(0),
});

export const productSchema = z.object({
  name: z.string().min(2),
  brandId: z.string().min(1),
  categoryId: z.string().min(1),
  fabric: z.string().optional().default(""),
  pattern: z.string().optional().default(""),
  occasion: z.string().optional().default(""),
  fit: z.string().optional().default(""),
  gender: z.string().optional().default(""),
  care: z.string().optional().default(""),
  countryOfOrigin: z.string().min(1),
  tags: z.array(z.string()).default([]),
  isFeatured: z.boolean().default(false),
  basePrice: z.coerce.number().min(1),
  discountPercent: z.coerce.number().min(0).max(100),
  description: z.string().optional().default(""),
  variants: z.array(variantSchema).min(1),
  images: z.array(z.object({
    id: z.string().optional(),
    url: z.string().url(),
    altText: z.string().optional(),
    isPrimary: z.boolean().default(false),
    variantId: z.string().nullable().optional(),
    displayOrder: z.number().default(0),
  })).max(6),
});

export type ProductFormValues = z.infer<typeof productSchema>;
