import { withAuth } from "next-auth/middleware";

// ✅ must be default export named "middleware"
export default withAuth({
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized: ({ token }) => Boolean(token?.accessToken),
  },
});

export const config = {
  matcher: [
    "/((?!login|forgot-password|reset-password|api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};