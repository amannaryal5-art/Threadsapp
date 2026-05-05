export { authMiddleware as middleware } from "@/app/middleware";

export const config = {
  matcher: ["/dashboard/:path*", "/products/:path*", "/categories/:path*", "/brands/:path*", "/orders/:path*", "/returns/:path*", "/users/:path*", "/reviews/:path*", "/coupons/:path*", "/banners/:path*", "/analytics/:path*", "/notifications/:path*"],
};
