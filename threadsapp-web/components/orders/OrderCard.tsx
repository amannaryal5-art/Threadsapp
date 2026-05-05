import Link from "next/link";
import { formatDate, formatCurrency } from "@/lib/utils";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { Order } from "@/types/order.types";

export function OrderCard({ order }: { order: Order }) {
  return (
    <div className="rounded-[28px] bg-white p-5 shadow-soft">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-secondary/50">{formatDate(order.createdAt, "d MMM yyyy")}</p>
          <h3 className="mt-1 text-lg font-semibold text-secondary">{order.orderNumber}</h3>
          <p className="mt-1 text-sm text-secondary/60">{order.items?.length ?? 0} items</p>
        </div>
        <StatusBadge status={order.status} />
        <div className="text-right">
          <p className="font-semibold text-primary">{formatCurrency(order.totalAmount)}</p>
          <div className="mt-3 flex gap-3 text-sm font-semibold">
            <Link href={`/orders/${order.id}`} className="text-primary">Track Order</Link>
            <Link href={`/orders/${order.id}`} className="text-secondary/60">
              {order.status === "delivered" ? "Rate & Review" : order.status === "return_requested" ? "Return" : "Details"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
