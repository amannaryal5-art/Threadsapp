"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import type { ApiResponse } from "@/types/api.types";
import type { BannerFormValues } from "@/validations/banner.schema";
import { parseApiError } from "@/lib/utils";

export interface Banner {
  id: string;
  title: string;
  image: string;
  targetType: string;
  targetId?: string | null;
  targetUrl?: string | null;
  isActive: boolean;
  displayOrder: number;
  startsAt?: string | null;
  endsAt?: string | null;
}

export function useBanners() {
  return useQuery({
    queryKey: ["banners"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<{ banners: Banner[] }>>("/admin/banners");
      return response.data.data.banners;
    },
  });
}

export function useSaveBanner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id?: string; payload: BannerFormValues }) => {
      if (id) {
        const response = await api.put<ApiResponse<{ banner: Banner }>>(`/admin/banners/${id}`, payload);
        return response.data.data.banner;
      }
      const response = await api.post<ApiResponse<{ banner: Banner }>>("/admin/banners", payload);
      return response.data.data.banner;
    },
    onSuccess: () => {
      toast.success("Banner saved");
      queryClient.invalidateQueries({ queryKey: ["banners"] });
    },
    onError: (error) => toast.error(parseApiError(error)),
  });
}

export function useDeleteBanner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => api.delete(`/admin/banners/${id}`),
    onSuccess: () => {
      toast.success("Banner deleted");
      queryClient.invalidateQueries({ queryKey: ["banners"] });
    },
    onError: (error) => toast.error(parseApiError(error)),
  });
}
