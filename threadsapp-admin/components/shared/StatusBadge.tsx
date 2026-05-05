import { Badge } from "@/components/ui/badge";

const styles: Record<string, string> = {
  pending_payment: "bg-slate-100 text-slate-700",
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-yellow-100 text-yellow-700",
  shipped: "bg-violet-100 text-violet-700",
  out_for_delivery: "bg-orange-100 text-orange-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  return_requested: "bg-pink-100 text-pink-700",
  return_picked: "bg-fuchsia-100 text-fuchsia-700",
  refunded: "bg-teal-100 text-teal-700",
  paid: "bg-green-100 text-green-700",
  pending: "bg-slate-100 text-slate-700",
  failed: "bg-red-100 text-red-700",
};

export function StatusBadge({ status }: { status: string }) {
  return <Badge className={styles[status] || "bg-slate-100 text-slate-700"}>{status.replace(/_/g, " ")}</Badge>;
}
