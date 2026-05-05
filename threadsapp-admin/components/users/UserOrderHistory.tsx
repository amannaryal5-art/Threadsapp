import Link from "next/link";
import type { Order } from "@/types/order.types";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";

export function UserOrderHistory({ orders }: { orders: Order[] }) {
  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <Link key={order.id} href={`/orders/${order.id}`} className="flex items-center justify-between rounded-xl border border-border p-3">
          <div>
            <p className="font-medium">{order.orderNumber}</p>
            <p className="text-sm text-slate-500">{formatDate(order.createdAt)}</p>
          </div>
          <div className="text-right">
            <p className="font-semibold">{formatCurrency(order.totalAmount)}</p>
            <StatusBadge status={order.status} />
          </div>
        </Link>
      ))}
    </div>
  );
}
