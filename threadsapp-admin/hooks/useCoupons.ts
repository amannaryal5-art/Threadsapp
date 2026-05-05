"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import type { ApiResponse } from "@/types/api.types";
import type { Coupon } from "@/types/coupon.types";
import type { CouponFormValues } from "@/validations/coupon.schema";
import { parseApiError } from "@/lib/utils";

export function useCoupons() {
  return useQuery({
    queryKey: ["coupons"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<{ coupons: Coupon[] }>>("/admin/coupons");
      return response.data.data.coupons;
    },
  });
}

export function useSaveCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id?: string; payload: CouponFormValues }) => {
      if (id) {
        const response = await api.put<ApiResponse<{ coupon: Coupon }>>(`/admin/coupons/${id}`, payload);
        return response.data.data.coupon;
      }
      const response = await api.post<ApiResponse<{ coupon: Coupon }>>("/admin/coupons", payload);
      return response.data.data.coupon;
    },
    onSuccess: () => {
      toast.success("Coupon saved");
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
    },
    onError: (error) => toast.error(parseApiError(error)),
  });
}

export function useDeleteCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => api.delete(`/admin/coupons/${id}`),
    onSuccess: () => {
      toast.success("Coupon deleted");
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
    },
    onError: (error) => toast.error(parseApiError(error)),
  });
}
