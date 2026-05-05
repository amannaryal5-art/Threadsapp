"use client";

import { Button } from "@/components/ui/button";

export function Pagination({ page, hasNext, onPageChange }: { page: number; hasNext: boolean; onPageChange: (page: number) => void }) {
  return (
    <div className="flex items-center justify-end gap-2">
      <Button variant="secondary" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        Previous
      </Button>
      <span className="text-sm text-slate-500">Page {page}</span>
      <Button variant="secondary" disabled={!hasNext} onClick={() => onPageChange(page + 1)}>
        Next
      </Button>
    </div>
  );
}
