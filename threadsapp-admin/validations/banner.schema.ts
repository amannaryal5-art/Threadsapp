import { z } from "zod";

export const bannerSchema = z.object({
  title: z.string().min(2),
  image: z.string().url(),
  targetType: z.enum(["category", "product", "url", "none"]),
  targetId: z.string().nullable().optional(),
  targetUrl: z.string().url().nullable().optional().or(z.literal("")),
  startsAt: z.date().nullable().optional(),
  endsAt: z.date().nullable().optional(),
  isActive: z.boolean().default(true),
  displayOrder: z.coerce.number().min(0).default(0),
});

export type BannerFormValues = z.infer<typeof bannerSchema>;
