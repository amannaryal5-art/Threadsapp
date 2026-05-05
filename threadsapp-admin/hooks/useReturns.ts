"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import type { ApiResponse, QueryParams } from "@/types/api.types";
import type { ReturnRequest } from "@/types/return.types";
import { parseApiError } from "@/lib/utils";

export function useReturns(filters: QueryParams) {
  const { status } = useSession();

  return useQuery({
    queryKey: ["returns", filters],
    enabled: status === "authenticated",
    queryFn: async () => {
      const response = await api.get<ApiResponse<{ returns: ReturnRequest[] }>>("/admin/returns", { params: filters });
      return response.data.data.returns;
    },
  });
}

export function useReturn(id: string) {
  const { status } = useSession();

  return useQuery({
    queryKey: ["return", id],
    enabled: Boolean(id) && status === "authenticated",
    queryFn: async () => {
      const response = await api.get<ApiResponse<{ return: ReturnRequest }>>(`/admin/returns/${id}`);
      return response.data.data.return;
    },
  });
}

function createReturnMutation(path: string, successMessage: string) {
  return function useReturnMutation() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async ({ id, payload }: { id: string; payload?: Record<string, string> }) => {
        const response = await api.put<ApiResponse<{ return: ReturnRequest }>>(`/admin/returns/${id}/${path}`, payload);
        return response.data.data.return;
      },
      onSuccess: (data) => {
        toast.success(successMessage);
        queryClient.invalidateQueries({ queryKey: ["returns"] });
        queryClient.invalidateQueries({ queryKey: ["return", data.id] });
      },
      onError: (error) => toast.error(parseApiError(error)),
    });
  };
}

export const useApproveReturn = createReturnMutation("approve", "Return approved");
export const useRejectReturn = createReturnMutation("reject", "Return rejected");
export const useRefundReturn = createReturnMutation("refund", "Refund initiated");
