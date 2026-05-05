export const ORDER_STATUSES = [
  "pending_payment",
  "confirmed",
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
  "return_requested",
  "return_picked",
  "refunded",
] as const;

export const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"] as const;
export const PRODUCT_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "Free Size"] as const;
export const GENDERS = ["men", "women", "kids", "unisex"] as const;
export const FABRICS = ["Cotton", "Polyester", "Silk", "Denim", "Linen", "Fleece", "Georgette", "Satin"] as const;
export const OCCASIONS = ["Casual", "Formal", "Party", "Ethnic", "Sports"] as const;
export const FITS = ["Regular", "Slim", "Oversized", "Relaxed"] as const;
export const PATTERNS = ["Solid", "Striped", "Floral", "Printed", "Embroidered"] as const;
export const STOCK_FILTERS = ["all", "in_stock", "low", "out"] as const;

export const SIDEBAR_ITEMS = [
  { title: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { title: "Products", href: "/products", icon: "Shirt", children: [
    { title: "All Products", href: "/products" },
    { title: "Categories", href: "/categories" },
    { title: "Brands", href: "/brands" },
  ] },
  { title: "Orders", href: "/orders", icon: "Package" },
  { title: "Returns", href: "/returns", icon: "RefreshCcw" },
  { title: "Users", href: "/users", icon: "Users" },
  { title: "Reviews", href: "/reviews", icon: "Star" },
  { title: "Coupons", href: "/coupons", icon: "TicketPercent" },
  { title: "Banners", href: "/banners", icon: "Image" },
  { title: "Analytics", href: "/analytics", icon: "BarChart3" },
  { title: "Notifications", href: "/notifications", icon: "Bell" },
  { title: "Settings", href: "/settings", icon: "Settings" },
] as const;
