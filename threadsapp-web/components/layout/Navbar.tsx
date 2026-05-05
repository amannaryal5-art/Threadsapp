"use client";

import Link from "next/link";
import { Heart, Search, ShoppingBag, User } from "lucide-react";
import { CategoryMegaMenu } from "@/components/layout/CategoryMegaMenu";
import { MobileNav } from "@/components/layout/MobileNav";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { SearchOverlay } from "@/components/layout/SearchOverlay";
import { MAIN_CATEGORIES } from "@/lib/constants";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useUiStore } from "@/store/uiStore";
import { useWishlistStore } from "@/store/wishlistStore";

export function Navbar() {
  const cartCount = useCartStore((state) => state.itemCount);
  const wishlistCount = useWishlistStore((state) => state.productIds.length);
  const openSearch = useUiStore((state) => state.openSearch);
  const openCartDrawer = useUiStore((state) => state.openCartDrawer);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-secondary/5 bg-white/95 backdrop-blur">
        <div className="container flex h-20 items-center justify-between gap-6">
          <Link href="/" className="text-2xl font-bold tracking-tight text-secondary">
            Threads<span className="text-primary">App</span>
          </Link>
          <nav className="hidden items-center gap-8 lg:flex">
            {MAIN_CATEGORIES.map((item) => (
              <div key={item} className="group relative">
                <Link href={`/search?q=${item.toLowerCase()}`} className="font-medium text-secondary">
                  {item}
                </Link>
                {item === "Men" ? <CategoryMegaMenu /> : null}
              </div>
            ))}
          </nav>
          <div className="hidden items-center gap-4 lg:flex">
            <button onClick={openSearch} aria-label="Search">
              <Search className="h-5 w-5" />
            </button>
            <Link href="/wishlist" className="relative" aria-label="Wishlist">
              <Heart className="h-5 w-5" />
              {wishlistCount ? <span className="absolute -right-2 -top-2 text-[10px]">{wishlistCount}</span> : null}
            </Link>
            <button onClick={openCartDrawer} className="relative" aria-label="Cart">
              <ShoppingBag className="h-5 w-5" />
              {cartCount ? <span className="absolute -right-2 -top-2 text-[10px]">{cartCount}</span> : null}
            </button>
            {isAuthenticated ? (
              <div className="group relative">
                <button aria-label="Account">
                  <User className="h-5 w-5" />
                </button>
                <div className="absolute right-0 top-full hidden min-w-48 rounded-3xl border border-secondary/10 bg-white p-3 shadow-soft group-hover:block">
                  <div className="grid gap-2 text-sm">
                    <Link href="/orders">My Orders</Link>
                    <Link href="/wishlist">Wishlist</Link>
                    <Link href="/profile">Profile</Link>
                    <button onClick={logout} className="text-left text-error">
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="rounded-full border border-secondary/15 px-4 py-2 text-sm font-semibold text-secondary transition hover:border-primary hover:text-primary"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:opacity-95"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
          <MobileNav />
        </div>
      </header>
      <SearchOverlay />
      <CartDrawer />
    </>
  );
}
