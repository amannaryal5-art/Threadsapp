import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional().default(""),
  image: z.string().url().optional().or(z.literal("")),
  parentId: z.string().nullable().optional(),
  displayOrder: z.coerce.number().min(0).default(0),
  isActive: z.boolean().default(true),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
