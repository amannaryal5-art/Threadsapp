"use client";

import axios, { AxiosHeaders } from "axios";
import { getSession, signOut } from "next-auth/react";
import type { ApiResponse } from "@/types/api.types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

api.interceptors.request.use(async (config) => {
  const session = await getSession();

  config.headers = AxiosHeaders.from(config.headers);
  if (session?.accessToken) {
    config.headers.set("Authorization", `Bearer ${session.accessToken}`);
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await signOut({ redirect: false });
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
