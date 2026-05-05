import { z } from "zod";

export const couponSchema = z.object({
  code: z.string().min(3).transform((value) => value.toUpperCase()),
  description: z.string().optional().default(""),
  type: z.enum(["percent", "flat"]),
  value: z.coerce.number().positive(),
  minOrderAmount: z.coerce.number().min(0),
  maxDiscount: z.coerce.number().min(0).nullable().optional(),
  usageLimit: z.coerce.number().min(1).nullable().optional(),
  perUserLimit: z.coerce.number().min(1),
  expiresAt: z.date().nullable().optional(),
  applicableCategories: z.array(z.string()).optional().default([]),
  isActive: z.boolean().default(true),
});

export type CouponFormValues = z.infer<typeof couponSchema>;
