import { z } from "zod";

export const addressSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(10).max(15),
  flatNo: z.string().optional(),
  building: z.string().optional(),
  street: z.string().optional(),
  area: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  pincode: z.string().min(6).max(6),
  country: z.string().min(2).default("India"),
  type: z.enum(["home", "work", "other"]).default("home"),
  isDefault: z.boolean().default(false),
  lat: z.number().nullable().optional(),
  lng: z.number().nullable().optional()
});
