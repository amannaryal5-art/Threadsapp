import { z } from "zod";

export const addressSchema = z.object({
  fullName: z.string().min(2),
  phone: z
    .string()
    .transform((val) => val.replace(/\D/g, "").replace(/^0+(?=\d{10,15}$)/, ""))
    .refine((val) => /^[0-9]{10,15}$/.test(val), "Phone must contain 10 to 15 digits"),
  flatNo: z.string().optional(),
  building: z.string().optional(),
  street: z.string().optional(),
  area: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  pincode: z
    .string()
    .transform((val) => val.replace(/\D/g, "").slice(0, 6))
    .refine((val) => /^[0-9]{6}$/.test(val), "Pincode must be exactly 6 digits"),
  country: z.string().min(2).default("India"),
  type: z.enum(["home", "work", "other"]).default("home"),
  isDefault: z.boolean().default(false),
  lat: z.number().nullable().optional(),
  lng: z.number().nullable().optional()
});
