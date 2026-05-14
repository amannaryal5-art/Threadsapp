"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { ApiResponse } from "@/types/api.types";
import type { Order, TrackingResponse } from "@/types/order.types";

export function useOrders(status?: string, page = 1) {
  const query = new URLSearchParams();
  if (status) query.set("status", status);
  query.set("page", String(page));
  return useQuery({
    queryKey: ["orders", status, page],
    queryFn: async () => {
      const response = await api.get<ApiResponse<{ orders: Order[] }>>(`/orders?${query.toString()}`);
      return response.data;
    }
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const response = await api.get<ApiResponse<{ order: Order }>>(`/orders/${id}`);
      return response.data.data.order;
    },
    enabled: Boolean(id)
  });
}

export function useTrackOrder(id: string) {
  return useQuery({
    queryKey: ["track-order", id],
    queryFn: async () => {
      const response = await api.get<ApiResponse<TrackingResponse>>(`/orders/${id}/track`);
      return response.data.data;
    },
    enabled: Boolean(id)
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.post<ApiResponse<{ order: Order }>>(`/orders/${id}/cancel`);
      return response.data.data.order;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", id] });
    }
  });
}

export function useRequestReturn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      orderId,
      payload
    }: {
      orderId: string;
      payload: {
        orderItemId: string;
        reason: string;
        description?: string;
        photos: string[];
      };
    }) => {
      const response = await api.post(`/orders/${orderId}/return`, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    }
  });
}

export function useSyncPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderId: string) => {
      const response = await api.post<ApiResponse<{ order: Order; paymentStatus: string }>>(`/payments/${orderId}/sync`);
      return response.data.data;
    },
    onSuccess: (data, orderId) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      return data;
    }
  });
}
