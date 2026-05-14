"use client";

import { usePathname } from "next/navigation";
import { MobileSidebar } from "@/components/layout/MobileSidebar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

const AUTH_ROUTES = new Set(["/login", "/forgot-password", "/reset-password"]);

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (!pathname || AUTH_ROUTES.has(pathname) || pathname.startsWith("/api/")) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,107,107,0.18),_transparent_30%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)]">
      <MobileSidebar />
      <div className="mx-auto flex min-h-screen max-w-[1680px]">
        <div className="sticky top-0 hidden h-screen shrink-0 md:flex">
          <Sidebar />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar />
          <main className="flex-1 px-4 py-6 md:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
