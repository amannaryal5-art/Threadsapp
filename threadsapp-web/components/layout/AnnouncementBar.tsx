"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { ANNOUNCEMENTS } from "@/lib/constants";
import { useUiStore } from "@/store/uiStore";

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const visible = useUiStore((state) => state.isAnnouncementVisible);
  const dismiss = useUiStore((state) => state.dismissAnnouncement);

  useEffect(() => {
    if (!visible) return;
    const timer = setInterval(() => setIndex((value) => (value + 1) % ANNOUNCEMENTS.length), 3000);
    return () => clearInterval(timer);
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="bg-secondary px-4 py-2 text-white">
      <div className="container flex items-center justify-between">
        <div className="mx-auto text-sm font-medium">
          <AnimatePresence mode="wait">
            <motion.span
              key={ANNOUNCEMENTS[index]}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
            >
              {ANNOUNCEMENTS[index]}
            </motion.span>
          </AnimatePresence>
        </div>
        <button aria-label="Dismiss announcement" onClick={dismiss}>
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
