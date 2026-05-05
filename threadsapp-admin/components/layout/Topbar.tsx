"use client";

import { Menu, LogOut } from "lucide-react";
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
    <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/90 px-4 py-4 backdrop-blur md:px-6">
      <div className="flex items-center gap-3">
        <Button variant="secondary" size="icon" className="md:hidden" onClick={() => setMobileSidebarOpen(true)}>
          <Menu className="h-4 w-4" />
        </Button>
        <div>
          <BreadCrumb />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden text-right md:block">
          <p className="text-sm font-semibold text-slate-900">{user?.name ?? "Admin"}</p>
          <p className="text-xs text-slate-500">{user?.email ?? "admin@threadsapp.in"}</p>
        </div>
        <Button variant="secondary" onClick={logout}>
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
