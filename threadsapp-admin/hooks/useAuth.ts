"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { signIn, signOut } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import type { ApiResponse } from "@/types/api.types";
import type { LoginPayload } from "@/types/auth.types";
import { parseApiError } from "@/lib/utils";

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const result = await signIn("credentials", {
        ...payload,
        redirect: false,
      });

      if (!result) {
        throw new Error("Unable to complete sign in");
      }

      if (result.error) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: () => {
      toast.success("Signed in successfully");
      router.replace("/dashboard");
    },
    onError: (error) => {
      toast.error(parseApiError(error));
    },
  });
}

export function useLogout() {
  const router = useRouter();

  return () => {
    signOut({ redirect: false }).finally(() => router.replace("/login"));
  };
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (email: string) => {
      const response = await axios.post<ApiResponse<{ resetLink?: string }>>(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`,
        { email },
      );
      return response.data.data;
    },
    onSuccess: () => {
      toast.success("Password reset link sent. Check your email.");
    },
    onError: (error) => {
      toast.error(parseApiError(error));
    },
  });
}

export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ token, password }: { token: string; password: string }) => {
      const response = await axios.post<ApiResponse<Record<string, never>>>(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`,
        { token, password },
      );
      return response.data.data;
    },
    onSuccess: () => {
      toast.success("Password reset successfully. Sign in with your new password.");
      router.replace("/login");
    },
    onError: (error) => {
      toast.error(parseApiError(error));
    },
  });
}
