"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import type { ApiResponse } from "@/types/api.types";
import type { BrandLite } from "@/types/product.types";
import { parseApiError } from "@/lib/utils";

export function useBrands() {
  const { status } = useSession();

  return useQuery({
    queryKey: ["brands"],
    enabled: status === "authenticated",
    queryFn: async () => {
      const response = await api.get<ApiResponse<{ brands: BrandLite[] }>>("/admin/brands");
      return response.data.data.brands;
    },
  });
}

export function useSaveBrand() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id?: string; payload: Partial<BrandLite> }) => {
      if (id) {
        const response = await api.put<ApiResponse<{ brand: BrandLite }>>(`/admin/brands/${id}`, payload);
        return response.data.data.brand;
      }
      const response = await api.post<ApiResponse<{ brand: BrandLite }>>("/admin/brands", payload);
      return response.data.data.brand;
    },
    onSuccess: () => {
      toast.success("Brand saved");
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    },
    onError: (error) => toast.error(parseApiError(error)),
  });
}

export function useDeleteBrand() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => api.delete(`/admin/brands/${id}`),
    onSuccess: () => {
      toast.success("Brand deleted");
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    },
    onError: (error) => toast.error(parseApiError(error)),
  });
}
