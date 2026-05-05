import { z } from "zod";

export const reviewSchema = z.object({
  productId: z.string().uuid(),
  orderItemId: z.string().uuid(),
  rating: z.number().min(1).max(5),
  title: z.string().min(2).max(120).optional(),
  comment: z.string().min(10).max(1000),
  photos: z.array(z.string().url()).max(3).default([])
});
