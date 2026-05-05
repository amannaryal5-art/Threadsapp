"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import type { ApiResponse, QueryParams } from "@/types/api.types";
import type { User } from "@/types/user.types";
import { parseApiError } from "@/lib/utils";
import type { Order } from "@/types/order.types";

export function useUsers(filters: QueryParams) {
  return useQuery({
    queryKey: ["users", filters],
    queryFn: async () => {
      const response = await api.get<ApiResponse<{ users: User[] }>>("/admin/users", { params: filters });
      return response.data.data.users;
    },
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ["user", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const response = await api.get<ApiResponse<{ user: User }>>(`/admin/users/${id}`);
      return response.data.data.user;
    },
  });
}

export function useBlockUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.put<ApiResponse<{ user: User }>>(`/admin/users/${id}/block`);
      return response.data.data.user;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["users"] });
      const previous = queryClient.getQueriesData<User[]>({ queryKey: ["users"] });
      previous.forEach(([key, value]) => {
        if (!value) return;
        queryClient.setQueryData<User[]>(key, value.map((item) => item.id === id ? { ...item, isActive: !item.isActive } : item));
      });
      return { previous };
    },
    onError: (error, _id, context) => {
      context?.previous.forEach(([key, value]) => queryClient.setQueryData(key, value));
      toast.error(parseApiError(error));
    },
    onSuccess: (_, id) => {
      toast.success("User status updated");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", id] });
    },
  });
}

export function useUserOrders(id: string) {
  return useQuery({
    queryKey: ["user-orders", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const response = await api.get<ApiResponse<{ orders: Order[] }>>("/admin/orders");
      return response.data.data.orders.filter((order) => order.userId === id);
    },
  });
}
