"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bell,
  ImageIcon,
  LayoutDashboard,
  Package,
  RefreshCcw,
  Settings,
  Shirt,
  Star,
  TicketPercent,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/store/uiStore";
import { useReturns } from "@/hooks/useReturns";
import { SIDEBAR_ITEMS } from "@/lib/constants";

const iconMap = {
  LayoutDashboard,
  Shirt,
  Package,
  RefreshCcw,
  Users,
  Star,
  TicketPercent,
  Image: ImageIcon,
  BarChart3,
  Bell,
  Settings,
} as const;

export function Sidebar({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();
  const collapsed = useUiStore((state) => state.sidebarCollapsed);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);
  const { data: returns = [] } = useReturns({ status: "requested" });
  const pendingReturns = returns.filter((item) => item.status === "requested").length;

  return (
    <aside className={cn("flex h-full flex-col bg-sidebar text-white", collapsed && !mobile ? "w-[88px]" : "w-60")}>
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-5">
        <Link href="/dashboard" className="flex items-center gap-3">
          <Image src="/logo.svg" alt="ThreadsApp" width={128} height={32} className={cn(collapsed && !mobile ? "w-8" : "w-32")} />
        </Link>
        {!mobile ? (
          <button className="rounded-lg bg-white/10 px-2 py-1 text-xs" onClick={toggleSidebar} type="button">
            {collapsed ? ">" : "<"}
          </button>
        ) : null}
      </div>
      <nav className="flex-1 space-y-2 overflow-y-auto px-3 py-4">
        {SIDEBAR_ITEMS.map((item) => {
          const Icon = iconMap[item.icon];
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const children = "children" in item ? item.children : undefined;
          return (
            <div key={item.href} className="space-y-1">
              <Link
                href={item.href}
                className={cn(
                  "flex items-center justify-between rounded-xl px-3 py-2 text-sm transition",
                  active ? "bg-white text-sidebar" : "text-white/80 hover:bg-white/10 hover:text-white",
                )}
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-4 w-4" />
                  {collapsed && !mobile ? null : item.title}
                </span>
                {item.title === "Returns" && pendingReturns > 0 && !collapsed ? (
                  <span className="rounded-full bg-coral px-2 py-0.5 text-xs text-white">{pendingReturns}</span>
                ) : null}
              </Link>
              {!collapsed && children?.length ? (
                <div className="ml-8 space-y-1">
                  {children.map((child) => (
                    <Link key={child.href} href={child.href} className={cn("block rounded-lg px-3 py-1.5 text-sm text-white/70 hover:bg-white/10", pathname === child.href ? "bg-white/10 text-white" : "")}>
                      {child.title}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
