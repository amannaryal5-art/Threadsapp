"use client";

import { LogOut, Menu, Search, ShieldCheck } from "lucide-react";
import { useSession } from "next-auth/react";
import { BreadCrumb } from "@/components/layout/BreadCrumb";
import { Button } from "@/components/ui/button";
import { useUiStore } from "@/store/uiStore";
import { useLogout } from "@/hooks/useAuth";

export function Topbar() {
  const setMobileSidebarOpen = useUiStore((state) => state.setMobileSidebarOpen);
  const { data: session } = useSession();
  const logout = useLogout();
  const user = session?.user;

  return (
    <div className="sticky top-0 z-20 border-b border-white/60 bg-white/70 px-4 py-4 backdrop-blur-xl md:px-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="icon" className="border-white/70 bg-white/80 md:hidden" onClick={() => setMobileSidebarOpen(true)}>
            <Menu className="h-4 w-4" />
          </Button>
          <div className="space-y-2">
            <BreadCrumb />
            <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 sm:inline-flex">
              <ShieldCheck className="h-3.5 w-3.5" />
              Secure admin workspace
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="hidden min-w-[280px] items-center gap-2 rounded-2xl border border-slate-200/80 bg-white/90 px-3 py-2 shadow-sm lg:flex">
            <Search className="h-4 w-4 text-slate-400" />
            <span className="text-sm text-slate-400">Quick search products, orders, and users</span>
          </div>
          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <div className="rounded-2xl border border-white/60 bg-white/90 px-4 py-2 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">{user?.name ?? "Admin"}</p>
              <p className="text-xs text-slate-500">{user?.email ?? "admin@threadsapp.in"}</p>
            </div>
            <Button variant="secondary" className="border-white/60 bg-white/90" onClick={logout}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
