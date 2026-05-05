"use client";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Sidebar } from "@/components/layout/Sidebar";
import { useUiStore } from "@/store/uiStore";

export function MobileSidebar() {
  const mobileSidebarOpen = useUiStore((state) => state.mobileSidebarOpen);
  const setMobileSidebarOpen = useUiStore((state) => state.setMobileSidebarOpen);

  return (
    <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
      <SheetContent className="max-w-[280px] p-0">
        <Sidebar mobile />
      </SheetContent>
    </Sheet>
  );
}
