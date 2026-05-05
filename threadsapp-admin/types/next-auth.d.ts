import { DefaultSession } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    error?: string;
    user: DefaultSession["user"] & {
      id: string;
      role: "admin" | "user";
      phone: string;
      profilePhoto?: string | null;
    };
  }

  interface User {
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    role: "admin" | "user";
    phone: string;
    profilePhoto?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    error?: string;
    user?: {
      id: string;
      name?: string | null;
      email?: string | null;
      role: "admin" | "user";
      phone: string;
      profilePhoto?: string | null;
    };
  }
}
