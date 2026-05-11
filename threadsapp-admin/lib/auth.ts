import axios from "axios";
import type { NextAuthConfig } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import type { ApiResponse } from "@/types/api.types";
import type { LoginResponse } from "@/types/auth.types";

const backendUrl = (process.env.BACKEND_URL ?? "").replace(/\/$/, "");
const configuredApiUrl = (process.env.NEXT_PUBLIC_API_URL ?? (backendUrl ? `${backendUrl}/api/v1` : "")).replace(/\/$/, "");
const apiUrl = configuredApiUrl.endsWith("/api/v1") ? configuredApiUrl : `${configuredApiUrl}/api/v1`;

function getTokenExpiry(accessToken?: string) {
  if (!accessToken) {
    return 0;
  }

  try {
    const [, payload] = accessToken.split(".");
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf-8")) as { exp?: number };
    return decoded.exp ? decoded.exp * 1000 : 0;
  } catch {
    return 0;
  }
}

async function refreshAccessToken(token: JWT) {
  try {
    if (!token.refreshToken) {
      throw new Error("Missing refresh token");
    }

    const response = await axios.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(`${apiUrl}/auth/refresh-token`, {
      refreshToken: token.refreshToken,
    });

    return {
      ...token,
      accessToken: response.data.data.accessToken,
      refreshToken: response.data.data.refreshToken,
      accessTokenExpires: getTokenExpiry(response.data.data.accessToken),
      error: undefined,
    };
  } catch (error) {
    console.error("NextAuth refreshAccessToken failed", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const email = typeof credentials?.email === "string" ? credentials.email.trim() : "";
          const password = typeof credentials?.password === "string" ? credentials.password : "";

          if (!email || !password) {
            return null;
          }

          if (!apiUrl) {
            console.error("NextAuth authorize error:", new Error("API URL is not configured"));
            return null;
          }

          const response = await axios.post<ApiResponse<LoginResponse>>(
            `${apiUrl}/auth/admin/login`,
            {
              email,
              password,
            },
            {
              timeout: 10000,
            },
          );

          const payload = response.data.data;

          return {
            id: payload.user.id,
            name: payload.user.name,
            email: payload.user.email,
            role: payload.user.role,
            phone: payload.user.phone,
            profilePhoto: payload.user.profilePhoto ?? null,
            accessToken: payload.tokens.accessToken,
            refreshToken: payload.tokens.refreshToken,
            accessTokenExpires: getTokenExpiry(payload.tokens.accessToken),
          };
        } catch (error) {
          console.error("NextAuth authorize error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpires = user.accessTokenExpires;
        token.error = undefined;
        token.user = {
          id: user.id ?? "",
          name: user.name,
          email: user.email ?? null,
          role: user.role,
          phone: user.phone,
          profilePhoto: user.profilePhoto ?? null,
        };
      }

      if (token.accessToken && token.accessTokenExpires && Date.now() < token.accessTokenExpires - 30_000) {
        return token;
      }

      if (token.refreshToken) {
        return refreshAccessToken(token);
      }

      return token;
    },
    async session({ session, token }) {
      const tokenUser = token.user;
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.error = token.error;
      session.user = {
        ...session.user,
        id: tokenUser?.id ?? session.user?.id ?? "",
        name: tokenUser?.name ?? session.user?.name ?? null,
        email: tokenUser?.email ?? session.user?.email ?? null,
        role: tokenUser?.role ?? session.user?.role ?? "admin",
        phone: tokenUser?.phone ?? session.user?.phone ?? "",
        profilePhoto: tokenUser?.profilePhoto ?? null,
      };

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
} satisfies NextAuthConfig;
