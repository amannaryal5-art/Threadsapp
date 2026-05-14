"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";

export function BreadCrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const currentLabel = segments.length
    ? segments[segments.length - 1].replace(/-/g, " ")
    : "dashboard";

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Admin panel</p>
      <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <Link href="/dashboard" className="font-medium text-slate-700">
          Home
        </Link>
        {segments.map((segment, index) => {
          const href = `/${segments.slice(0, index + 1).join("/")}`;
          return (
            <div key={href} className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4" />
              <Link href={href} className={index === segments.length - 1 ? "font-medium capitalize text-slate-900" : "capitalize"}>
                {segment.replace(/-/g, " ")}
              </Link>
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-xl font-semibold capitalize tracking-tight text-slate-950">{currentLabel}</p>
    </div>
  );
}
