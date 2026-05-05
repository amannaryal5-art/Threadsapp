"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";

export function BreadCrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
      <Link href="/dashboard" className="font-medium text-slate-700">
        Home
      </Link>
      {segments.map((segment, index) => {
        const href = `/${segments.slice(0, index + 1).join("/")}`;
        return (
          <div key={href} className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4" />
            <Link href={href} className={index === segments.length - 1 ? "font-medium text-slate-900" : ""}>
              {segment.replace(/-/g, " ")}
            </Link>
          </div>
        );
      })}
    </div>
  );
}
