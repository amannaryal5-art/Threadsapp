export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "ThreadsApp";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001";
const normalizeApiUrl = (value?: string) => {
  const normalized = (value ?? "").trim().replace(/\/$/, "");
  if (!normalized) return "";
  return normalized.endsWith("/api/v1") ? normalized : `${normalized}/api/v1`;
};

const publicApiUrl = normalizeApiUrl(process.env.NEXT_PUBLIC_API_URL);
const serverBackendUrl = normalizeApiUrl(process.env.BACKEND_URL);
const localApiUrl = "http://localhost:5000/api/v1";

export const BROWSER_API_URL =
  process.env.NODE_ENV === "production"
    ? "/api/backend"
    : publicApiUrl || localApiUrl;
export const SERVER_API_URL = serverBackendUrl || publicApiUrl || localApiUrl;
export const API_URL = typeof window === "undefined" ? SERVER_API_URL || BROWSER_API_URL : BROWSER_API_URL;
export const RAZORPAY_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY ?? "";
export const GOOGLE_MAPS_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ??
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ??
  "";

export const QUERY_STALE_TIME = 1000 * 60 * 5;
export const AUTH_COOKIE = "threadsapp_session";
export const ACCESS_COOKIE = "threadsapp_access";
export const REFRESH_COOKIE = "threadsapp_refresh";
export const PRODUCT_GRID_LIMIT = 12;

export const MAIN_CATEGORIES = [
  "Men",
  "Women",
  "Kids",
  "Ethnic",
  "Western",
  "Sale"
] as const;

export const ANNOUNCEMENTS = [
  "Free shipping above ₹499",
  "Easy 7-day returns",
  "Authentic brands"
];

export const FILTER_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
export const FILTER_DISCOUNTS = [10, 20, 30, 50];
export const FILTER_RATINGS = [4, 3];

export const PAYMENT_METHODS = [
  { id: "upi", label: "UPI" },
  { id: "card", label: "Credit / Debit Card" },
  { id: "netbanking", label: "Net Banking" },
  { id: "wallet", label: "Wallets" },
  { id: "cod", label: "Cash on Delivery" }
] as const;
