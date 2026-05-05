import axios from "axios";
import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import type { ApiResponse } from "@/types/api.types";
import type { LoginResponse } from "@/types/auth.types";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
  throw new Error("Missing NEXT_PUBLIC_API_URL environment variable");
}

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
  } catch {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim();
        const password = credentials?.password;

        if (!email || !password) {
          throw new Error("Email and password are required");
        }

        const response = await axios.post<ApiResponse<LoginResponse>>(`${apiUrl}/auth/login`, {
          email,
          password,
        });

        const payload = response.data.data;

        if (payload.user.role !== "admin") {
          throw new Error("Admin access only. Sign in with an admin account.");
        }

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
          id: user.id,
          name: user.name,
          email: user.email,
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
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.error = token.error;
      session.user = {
        ...session.user,
        ...token.user,
      };

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
