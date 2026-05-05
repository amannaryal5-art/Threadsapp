"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import type { ApiResponse } from "@/types/api.types";
import type { CategoryLite } from "@/types/product.types";
import type { CategoryFormValues } from "@/validations/category.schema";
import { parseApiError } from "@/lib/utils";

export function useCategories() {
  const { status } = useSession();

  return useQuery({
    queryKey: ["categories"],
    enabled: status === "authenticated",
    queryFn: async () => {
      const response = await api.get<ApiResponse<{ categories: CategoryLite[] }>>("/admin/categories");
      return response.data.data.categories;
    },
  });
}

export function useSaveCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id?: string; payload: CategoryFormValues }) => {
      if (id) {
        const response = await api.put<ApiResponse<{ category: CategoryLite }>>(`/admin/categories/${id}`, payload);
        return response.data.data.category;
      }
      const response = await api.post<ApiResponse<{ category: CategoryLite }>>("/admin/categories", payload);
      return response.data.data.category;
    },
    onSuccess: () => {
      toast.success("Category saved");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => toast.error(parseApiError(error)),
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => api.delete(`/admin/categories/${id}`),
    onSuccess: () => {
      toast.success("Category deleted");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => toast.error(parseApiError(error)),
  });
}
