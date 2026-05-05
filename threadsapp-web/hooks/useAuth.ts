"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import type { ApiResponse } from "@/types/api.types";
import type { AppNotification, LoyaltyPointsResponse, User } from "@/types/user.types";

interface TokensPayload {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

interface EmailOtpPayload {
  email: string;
  previewOtp?: string;
}

function getApiErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    return error.response?.data?.message ?? error.message;
  }
  return error instanceof Error ? error.message : "Something went wrong";
}

function compactPayload<T extends Record<string, string | undefined>>(payload: T) {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined && value !== "")
  ) as Record<string, string>;
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Record<string, string>) => {
      const response = await api.post<ApiResponse<TokensPayload>>("/auth/login", compactPayload(payload));
      return response.data.data;
    },
    onSuccess: (data) => {
      useAuthStore.getState().setAuth({
        user: data.user,
        accessToken: data.tokens.accessToken,
        refreshToken: data.tokens.refreshToken
      });
      queryClient.invalidateQueries();
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    }
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: async (payload: Record<string, string>) => {
      const response = await api.post<ApiResponse<TokensPayload>>("/auth/register", compactPayload(payload));
      return response.data.data;
    },
    onSuccess: (data) => {
      useAuthStore.getState().setAuth({
        user: data.user,
        accessToken: data.tokens.accessToken,
        refreshToken: data.tokens.refreshToken
      });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    }
  });
}

export function useSendOtp() {
  return useMutation({
    mutationFn: async (payload: { phone: string }) => {
      const response = await api.post<ApiResponse<{ phone: string }>>("/auth/send-otp", payload);
      return response.data.data;
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    }
  });
}

export function useSendEmailOtp() {
  return useMutation({
    mutationFn: async (payload: { email: string; name?: string }) => {
      const response = await api.post<ApiResponse<EmailOtpPayload>>("/auth/send-email-otp", payload);
      return response.data.data;
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    }
  });
}

export function useVerifyOtp() {
  return useMutation({
    mutationFn: async (payload: { phone: string; otp: string }) => {
      const response = await api.post<ApiResponse<{ verified: boolean }>>("/auth/verify-otp", payload);
      return response.data.data;
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    }
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (payload: { email: string }) => {
      const response = await api.post<ApiResponse<{ resetLink: string }>>("/auth/forgot-password", payload);
      return response.data.data;
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    }
  });
}

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<{ user: User }>>("/users/profile");
      const user = response.data.data.user;
      useAuthStore.getState().setUser(user);
      return user;
    },
    enabled: useAuthStore((state) => state.isAuthenticated)
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<User>) => {
      const response = await api.put<ApiResponse<{ user: User }>>("/users/profile", payload);
      return response.data.data.user;
    },
    onSuccess: (user) => {
      useAuthStore.getState().setUser(user);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    }
  });
}

export function useNotifications(page = 1) {
  return useQuery({
    queryKey: ["notifications", page],
    queryFn: async () => {
      const response = await api.get<ApiResponse<{ notifications: AppNotification[] }>>(`/users/notifications?page=${page}`);
      return response.data;
    },
    enabled: useAuthStore((state) => state.isAuthenticated)
  });
}

export function useLoyaltyPoints() {
  return useQuery({
    queryKey: ["loyalty-points"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<LoyaltyPointsResponse>>("/users/loyalty-points");
      return response.data.data;
    },
    enabled: useAuthStore((state) => state.isAuthenticated)
  });
}
