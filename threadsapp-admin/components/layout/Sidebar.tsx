"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
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
    <aside
      className={cn(
        "flex h-full flex-col border-r border-white/10 bg-[linear-gradient(180deg,_#121933_0%,_#1a1f36_42%,_#11172b_100%)] text-white shadow-[18px_0_50px_rgba(15,23,42,0.18)]",
        collapsed && !mobile ? "w-[96px]" : "w-[280px]",
      )}
    >
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-coral to-[#ff8d72] shadow-[0_12px_30px_rgba(255,107,107,0.35)]">
            <span className="text-lg font-black tracking-[0.2em] text-white">T</span>
          </div>
          {collapsed && !mobile ? null : (
            <div>
              <p className="text-sm font-semibold tracking-[0.24em] text-white/65">THREADSAPP</p>
              <p className="text-base font-semibold text-white">Admin Console</p>
            </div>
          )}
        </Link>
        {!mobile ? (
          <button
            className="rounded-xl border border-white/10 bg-white/10 px-2.5 py-1.5 text-xs text-white/80 transition hover:bg-white/15 hover:text-white"
            onClick={toggleSidebar}
            type="button"
          >
            {collapsed ? ">" : "<"}
          </button>
        ) : null}
      </div>
      {!collapsed || mobile ? (
        <div className="mx-4 mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/45">Operations snapshot</p>
          <div className="mt-3 flex items-end justify-between">
            <div>
              <p className="text-2xl font-semibold text-white">{pendingReturns}</p>
              <p className="text-sm text-white/65">pending returns</p>
            </div>
            <span className="rounded-full border border-emerald-400/25 bg-emerald-400/15 px-2.5 py-1 text-xs font-medium text-emerald-200">
              Live
            </span>
          </div>
        </div>
      ) : null}
      <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-5">
        {SIDEBAR_ITEMS.map((item) => {
          const Icon = iconMap[item.icon];
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const children = "children" in item ? item.children : undefined;
          return (
            <div key={item.href} className="space-y-1">
              <Link
                href={item.href}
                className={cn(
                  "group flex items-center justify-between rounded-2xl px-3.5 py-3 text-sm transition",
                  active
                    ? "bg-white text-sidebar shadow-[0_14px_32px_rgba(15,23,42,0.22)]"
                    : "text-white/76 hover:bg-white/8 hover:text-white",
                )}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-xl transition",
                      active ? "bg-slate-100 text-sidebar" : "bg-white/8 text-white/70 group-hover:bg-white/12 group-hover:text-white",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  {collapsed && !mobile ? null : <span className="font-medium">{item.title}</span>}
                </span>
                {item.title === "Returns" && pendingReturns > 0 && !collapsed ? (
                  <span className="rounded-full bg-coral px-2 py-0.5 text-xs text-white">{pendingReturns}</span>
                ) : active && !collapsed ? (
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                ) : null}
              </Link>
              {!collapsed && children?.length ? (
                <div className="ml-12 space-y-1">
                  {children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={cn(
                        "block rounded-xl px-3 py-2 text-sm text-white/62 transition hover:bg-white/8 hover:text-white",
                        pathname === child.href ? "bg-white/10 text-white" : "",
                      )}
                    >
                      {child.title}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </nav>
      {!collapsed || mobile ? (
        <div className="m-4 rounded-2xl border border-coral/25 bg-coral/12 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coral">Merchandising tip</p>
          <p className="mt-2 text-sm leading-6 text-white/82">Refresh banners and feature low-stock alerts daily to keep the storefront conversion-ready.</p>
        </div>
      ) : null}
    </aside>
  );
}
