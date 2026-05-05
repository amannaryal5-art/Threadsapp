"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import type { ApiResponse } from "@/types/api.types";
import { parseApiError } from "@/lib/utils";

export interface ReviewItem {
  id: string;
  rating: number;
  comment?: string | null;
  title?: string | null;
  isVerifiedPurchase: boolean;
  createdAt: string;
  Product?: { id: string; name: string; images?: { url: string }[] };
  User?: { id: string; name: string };
}

export function useReviews() {
  return useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<{ reviews: ReviewItem[] }>>("/admin/reviews");
      return response.data.data.reviews;
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => api.delete(`/admin/reviews/${id}`),
    onSuccess: () => {
      toast.success("Review removed");
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: (error) => toast.error(parseApiError(error)),
  });
}
