"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { FilterSidebar } from "@/components/listing/FilterSidebar";
import type { ComponentProps } from "react";

export function FilterDrawer(props: ComponentProps<typeof FilterSidebar>) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-full border border-secondary/10 px-4 py-3 lg:hidden">
        <SlidersHorizontal className="h-4 w-4" />
        Filters
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 bg-secondary/40" onClick={() => setOpen(false)}>
          <div className="absolute bottom-0 left-0 right-0 rounded-t-[32px] bg-white p-5" onClick={(event) => event.stopPropagation()}>
            <FilterSidebar {...props} mobile />
          </div>
        </div>
      ) : null}
    </>
  );
}
