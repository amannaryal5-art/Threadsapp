import Link from "next/link";
import { cn } from "@/lib/utils";

export function Pagination({
  currentPage,
  totalPages,
  createHref
}: {
  currentPage: number;
  totalPages: number;
  createHref: (page: number) => string;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: totalPages }).map((_, index) => {
        const page = index + 1;
        return (
          <Link
            key={page}
            href={createHref(page)}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full border text-sm font-medium",
              currentPage === page
                ? "border-primary bg-primary text-white"
                : "border-secondary/10 bg-white text-secondary"
            )}
          >
            {page}
          </Link>
        );
      })}
    </div>
  );
}
