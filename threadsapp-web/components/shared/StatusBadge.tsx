import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  delivered: "bg-success/10 text-success",
  shipped: "bg-sky-500/10 text-sky-600",
  out_for_delivery: "bg-amber-500/10 text-amber-600",
  confirmed: "bg-indigo-500/10 text-indigo-600",
  placed: "bg-secondary/10 text-secondary",
  cancelled: "bg-error/10 text-error",
  return_requested: "bg-purple-500/10 text-purple-600"
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize",
        statusStyles[status] ?? "bg-secondary/10 text-secondary"
      )}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}
