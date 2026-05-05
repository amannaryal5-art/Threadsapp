"use client";

import Link from "next/link";
import { Menu, Search, User, Heart, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { MAIN_CATEGORIES } from "@/lib/constants";
import { useAuthStore } from "@/store/authStore";
import { useUiStore } from "@/store/uiStore";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const openSearch = useUiStore((state) => state.openSearch);
  const openCartDrawer = useUiStore((state) => state.openCartDrawer);
  const cartCount = useCartStore((state) => state.itemCount);
  const wishlistCount = useWishlistStore((state) => state.productIds.length);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="lg:hidden">
      <div className="flex items-center gap-4">
        <button onClick={() => setOpen((value) => !value)} aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </button>
        <button onClick={openSearch} aria-label="Open search">
          <Search className="h-5 w-5" />
        </button>
        <Link href="/wishlist" className="relative">
          <Heart className="h-5 w-5" />
          {wishlistCount ? <span className="absolute -right-2 -top-2 text-[10px]">{wishlistCount}</span> : null}
        </Link>
        <button onClick={openCartDrawer} aria-label="Open cart" className="relative">
          <ShoppingBag className="h-5 w-5" />
          {cartCount ? <span className="absolute -right-2 -top-2 text-[10px]">{cartCount}</span> : null}
        </button>
        <Link href={isAuthenticated ? "/profile" : "/login"}>
          <User className="h-5 w-5" />
        </Link>
      </div>
      {open ? (
        <div className="absolute inset-x-0 top-full z-30 border-t border-secondary/10 bg-white p-5 shadow-soft">
          <div className="grid gap-3">
            {MAIN_CATEGORIES.map((item) => (
              <Link key={item} href={`/search?q=${item.toLowerCase()}`} onClick={() => setOpen(false)}>
                {item}
              </Link>
            ))}
          </div>
          <div className="mt-5 border-t border-secondary/10 pt-5">
            {isAuthenticated ? (
              <div className="grid gap-3">
                <Link href="/orders" onClick={() => setOpen(false)}>
                  My Orders
                </Link>
                <Link href="/wishlist" onClick={() => setOpen(false)}>
                  Wishlist
                </Link>
                <Link href="/profile" onClick={() => setOpen(false)}>
                  Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="text-left text-error"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid gap-3">
                <Link href="/login" onClick={() => setOpen(false)}>
                  Login
                </Link>
                <Link href="/signup" onClick={() => setOpen(false)}>
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
