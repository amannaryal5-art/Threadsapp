"use client";

import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import toast from "react-hot-toast";
import { BROWSER_API_URL } from "@/lib/constants";
import { useAuthStore } from "@/store/authStore";
import type { ApiResponse } from "@/types/api.types";
import type { User } from "@/types/user.types";

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  _retryCount?: number;
}

interface RefreshPayload {
  accessToken: string;
  refreshToken: string;
  user?: User;
}

const api = axios.create({
  baseURL: BROWSER_API_URL,
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiResponse<unknown>>) => {
    const originalRequest = error.config as RetryConfig | undefined;
    
    // Handle rate limiting with exponential backoff
    if (error.response?.status === 429 && originalRequest) {
      const retryCount = originalRequest._retryCount || 0;
      if (retryCount < 3) {
        originalRequest._retryCount = retryCount + 1;
        const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
        await new Promise(resolve => setTimeout(resolve, delay));
        return api(originalRequest);
      }
    }

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { refreshToken, user } = useAuthStore.getState();
        const response = await axios.post<ApiResponse<RefreshPayload>>(
          "/api/auth/refresh",
          { refreshToken },
          { withCredentials: true }
        );

        const refreshedToken = response.data.data.accessToken;
        if (!user && !response.data.data.user) {
          throw new Error("Session user missing during refresh");
        }
        useAuthStore.getState().setAuth({
          user: response.data.data.user ?? user!,
          accessToken: refreshedToken,
          refreshToken: response.data.data.refreshToken
        });

        originalRequest.headers.Authorization = `Bearer ${refreshedToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        if (typeof window !== "undefined") {
          toast.error("Your session has expired");
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
