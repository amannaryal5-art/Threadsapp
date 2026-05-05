export interface DashboardStats {
  todayOrders: number;
  todayRevenue: number;
  newUsers: number;
  lowStockAlerts: Array<{
    id: string;
    quantity: number;
    lowStockThreshold: number;
    ProductVariant?: {
      id: string;
      size: string;
      color: string;
      sku: string;
    };
  }>;
}

export interface RevenuePoint {
  period: string;
  revenue: string | number;
}

export interface StatusBreakdown {
  status: string;
  count: string | number;
}

export interface TopProduct {
  id: string;
  name: string;
  totalSold: number;
  sellingPrice: string | number;
}
