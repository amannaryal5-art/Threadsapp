"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { parseApiError } from "@/lib/utils";
import type { ApiResponse, ApiErrorItem } from "@/types/api.types";
import type { Address } from "@/types/user.types";

export interface AddressPayload {
  fullName: string;
  phone: string;
  flatNo?: string;
  building?: string;
  street?: string;
  area?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  type: "home" | "work" | "other";
  isDefault: boolean;
  lat?: number | null;
  lng?: number | null;
}

export function useAddresses() {
  return useQuery({
    queryKey: ["addresses"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<{ addresses: Address[] }>>("/addresses");
      return response.data.data.addresses;
    },
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();

  return useMutation<
    Address,
    unknown,
    AddressPayload,
    unknown
  >({
    mutationFn: async (payload) => {
      console.log("[address.formData]", payload);
      const response = await api.post<ApiResponse<{ address: Address }>>("/addresses", payload, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("[address.response]", response.data);
      return response.data.data.address;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
    onError: (error) => {
      console.log("[address.error]", error);
      if (apiErrorItems(error).length) {
        console.log("[address.validation-errors]", apiErrorItems(error));
      }
    },
  });
}

export function apiErrorItems(error: unknown): ApiErrorItem[] {
  const axiosError = (error as { response?: { data?: ApiResponse<unknown> } })?.response?.data;
  return axiosError?.errors ?? [];
}

export function getAddressErrorMessage(error: unknown) {
  return parseApiError(error);
}
