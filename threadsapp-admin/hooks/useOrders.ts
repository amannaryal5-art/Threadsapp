"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import type { ApiResponse, QueryParams } from "@/types/api.types";
import type { Order } from "@/types/order.types";
import { parseApiError } from "@/lib/utils";

export function useOrders(filters: QueryParams) {
  const { status } = useSession();

  return useQuery({
    queryKey: ["orders", filters],
    enabled: status === "authenticated",
    queryFn: async () => {
      const response = await api.get<ApiResponse<{ orders: Order[] }>>("/admin/orders", { params: filters });
      return response.data.data.orders;
    },
  });
}

export function useOrder(id: string) {
  const { status } = useSession();

  return useQuery({
    queryKey: ["order", id],
    enabled: Boolean(id) && status === "authenticated",
    queryFn: async () => {
      const response = await api.get<ApiResponse<{ order: Order }>>(`/admin/orders/${id}`);
      return response.data.data.order;
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await api.put<ApiResponse<{ order: Order }>>(`/admin/orders/${id}/status`, { status });
      return response.data.data.order;
    },
    onSuccess: (_, variables) => {
      toast.success("Order status updated");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", variables.id] });
    },
    onError: (error) => toast.error(parseApiError(error)),
  });
}

export function useShipOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.post<ApiResponse<{ order: Order }>>(`/admin/orders/${id}/ship`);
      return response.data.data.order;
    },
    onSuccess: (data) => {
      toast.success("Shipment created");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", data.id] });
    },
    onError: (error) => toast.error(parseApiError(error)),
  });
}
