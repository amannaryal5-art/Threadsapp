import { type ClassValue, clsx } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number | string) {
  const amount = typeof value === "string" ? Number(value) : value;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0);
}

export function formatDate(value?: string | Date | null, pattern = "dd MMM yyyy") {
  if (!value) return "N/A";
  return format(new Date(value), pattern);
}

export function slugifyText(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function parseApiError(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: unknown }).response === "object" &&
    (error as { response?: { data?: unknown } }).response?.data &&
    typeof (error as { response?: { data?: { message?: unknown; errors?: Array<{ message?: unknown }> } } }).response?.data === "object"
  ) {
    const data = (error as { response?: { data?: { message?: unknown; errors?: Array<{ message?: unknown }> } } }).response?.data;
    const firstFieldError = data?.errors?.[0]?.message;
    if (typeof firstFieldError === "string" && firstFieldError.length) {
      return firstFieldError;
    }
    if (typeof data?.message === "string" && data.message.length) {
      return data.message;
    }
  }

  if (typeof error === "object" && error !== null && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return "Something went wrong. Please try again.";
}
