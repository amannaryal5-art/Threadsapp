"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Cookies from "js-cookie";
import type { AuthTokens, AuthUser } from "@/types/auth.types";

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  setAuth: (payload: { user: AuthUser; tokens: AuthTokens }) => void;
  updateTokens: (tokens: Partial<AuthTokens>) => void;
  setHasHydrated: (value: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      hasHydrated: false,
      setAuth: ({ user, tokens }) => {
        Cookies.set("threadsapp_access_token", tokens.accessToken);
        Cookies.set("threadsapp_refresh_token", tokens.refreshToken);
        set({
          user,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          isAuthenticated: true,
        });
      },
      updateTokens: (tokens) => {
        if (tokens.accessToken) {
          Cookies.set("threadsapp_access_token", tokens.accessToken);
        }
        if (tokens.refreshToken) {
          Cookies.set("threadsapp_refresh_token", tokens.refreshToken);
        }

        set((state) => ({
          accessToken: tokens.accessToken ?? state.accessToken,
          refreshToken: tokens.refreshToken ?? state.refreshToken,
          isAuthenticated: Boolean(tokens.accessToken ?? state.accessToken),
        }));
      },
      setHasHydrated: (value) => set({ hasHydrated: value }),
      logout: () => {
        Cookies.remove("threadsapp_access_token");
        Cookies.remove("threadsapp_refresh_token");
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
      },
    }),
    {
      name: "threadsapp-admin-auth",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error("Failed to hydrate auth store", error);
        }

        state?.setHasHydrated(true);
      },
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
