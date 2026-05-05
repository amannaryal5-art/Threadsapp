"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/user.types";
import { AUTH_COOKIE, REFRESH_COOKIE } from "@/lib/constants";
import { deleteCookie, setCookie } from "@/lib/utils";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (payload: { user: User; accessToken: string; refreshToken: string }) => void;
  updateAccessToken: (token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      setAuth: ({ user, accessToken, refreshToken }) => {
        set({ user, accessToken, refreshToken, isAuthenticated: true });
        setCookie(AUTH_COOKIE, "1");
        setCookie(REFRESH_COOKIE, refreshToken);
      },
      updateAccessToken: (accessToken) => set({ accessToken, isAuthenticated: true }),
      setUser: (user) => set({ user }),
      logout: () => {
        deleteCookie(AUTH_COOKIE);
        deleteCookie(REFRESH_COOKIE);
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
      }
    }),
    {
      name: "threadsapp-auth"
    }
  )
);
