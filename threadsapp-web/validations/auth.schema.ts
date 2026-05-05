import { z } from "zod";

export const loginSchema = z
  .object({
    email: z.string().email().optional().or(z.literal("")),
    password: z.string().min(6).optional().or(z.literal("")),
    phone: z.string().min(10).max(15).optional().or(z.literal("")),
    otp: z.string().length(6).optional().or(z.literal(""))
  })
  .refine((value) => (value.email && value.password) || (value.phone && value.otp), {
    message: "Provide email + password or phone + OTP"
  });

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10).max(15),
  password: z.string().min(6),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]).default("prefer_not_to_say")
});

export const otpSchema = z.object({
  phone: z.string().min(10).max(15),
  otp: z.string().length(6)
});

export const emailOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6)
});

export const forgotPasswordSchema = z.object({
  email: z.string().email()
});
