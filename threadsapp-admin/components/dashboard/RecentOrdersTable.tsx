import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Order } from "@/types/order.types";

export function RecentOrdersTable({ orders }: { orders: Order[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {orders.slice(0, 10).map((order) => (
          <Link key={order.id} href={`/orders/${order.id}`} className="flex items-center justify-between rounded-xl border border-border p-3 hover:bg-slate-50">
            <div>
              <p className="font-medium text-slate-900">{order.orderNumber}</p>
              <p className="text-sm text-slate-500">{order.User?.name ?? "Customer"} · {formatDate(order.createdAt, "dd MMM, hh:mm a")}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-slate-900">{formatCurrency(order.totalAmount)}</p>
              <StatusBadge status={order.status} />
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
