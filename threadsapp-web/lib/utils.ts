import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number | string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

export function formatDate(value: string | Date, dateFormat = "EEE, d MMM") {
  return format(new Date(value), dateFormat);
}

export function safeNumber(value: number | string | null | undefined) {
  return Number(value ?? 0);
}

export function percentageFromMrp(mrp: number | string, sellingPrice: number | string) {
  const base = safeNumber(mrp);
  const sale = safeNumber(sellingPrice);
  if (!base || sale >= base) return 0;
  return Math.round(((base - sale) / base) * 100);
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function truncate(text: string, length: number) {
  return text.length > length ? `${text.slice(0, length - 1)}…` : text;
}

type QueryParamValue = string | number | boolean | string[] | number[] | undefined | null;

export function getQueryString(params: Record<string, QueryParamValue>) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (Array.isArray(value)) {
      if (value.length) searchParams.set(key, value.map(String).join(","));
      return;
    }
    searchParams.set(key, String(value));
  });
  return searchParams.toString();
}

export function cookieValue(name: string) {
  if (typeof document === "undefined") return undefined;
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];
}

export function setCookie(name: string, value: string, days = 7) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 86400000).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}

export function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
}
