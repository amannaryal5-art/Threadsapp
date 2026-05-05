"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import api from "@/lib/axios";
import type { ApiResponse } from "@/types/api.types";
import type { DashboardStats, RevenuePoint, StatusBreakdown, TopProduct } from "@/types/analytics.types";

function useProtectedQueryEnabled() {
  const { status } = useSession();

  return status === "authenticated";
}

export function useDashboardStats() {
  const enabled = useProtectedQueryEnabled();

  return useQuery({
    queryKey: ["analytics", "dashboard"],
    enabled,
    queryFn: async () => {
      const response = await api.get<ApiResponse<DashboardStats>>("/admin/dashboard");
      return response.data.data;
    },
  });
}

export function useRevenueAnalytics() {
  const enabled = useProtectedQueryEnabled();

  return useQuery({
    queryKey: ["analytics", "revenue"],
    enabled,
    queryFn: async () => {
      const response = await api.get<ApiResponse<{ rows: RevenuePoint[] }>>("/admin/analytics/revenue");
      return response.data.data.rows;
    },
  });
}

export function useTopProductsAnalytics() {
  const enabled = useProtectedQueryEnabled();

  return useQuery({
    queryKey: ["analytics", "top-products"],
    enabled,
    queryFn: async () => {
      const response = await api.get<ApiResponse<{ rows: TopProduct[] }>>("/admin/analytics/top-products");
      return response.data.data.rows;
    },
  });
}

export function useTopCategoriesAnalytics() {
  const enabled = useProtectedQueryEnabled();

  return useQuery({
    queryKey: ["analytics", "top-categories"],
    enabled,
    queryFn: async () => {
      const response = await api.get<ApiResponse<{ rows: Array<{ id: string; name: string; productCount: string | number }> }>>("/admin/analytics/top-categories");
      return response.data.data.rows;
    },
  });
}

export function useOrdersByStatusAnalytics() {
  const enabled = useProtectedQueryEnabled();

  return useQuery({
    queryKey: ["analytics", "orders-status"],
    enabled,
    queryFn: async () => {
      const response = await api.get<ApiResponse<{ rows: StatusBreakdown[] }>>("/admin/analytics/orders-by-status");
      return response.data.data.rows;
    },
  });
}
