export const dynamic = 'force-dynamic';
"use client";

import { Download } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { OrdersTable } from "@/components/orders/OrdersTable";
import { OrderFilters } from "@/components/orders/OrderFilters";
import { useOrders } from "@/hooks/useOrders";
import { useSearchParams } from "next/navigation";

export default function OrdersPage() {
  const searchParams = useSearchParams();
  const filters = {
    search: searchParams.get("search") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    startDate: searchParams.get("startDate") ?? undefined,
    endDate: searchParams.get("endDate") ?? undefined,
    paymentStatus: searchParams.get("paymentStatus") ?? undefined,
  };
  const { data: orders = [], isLoading } = useOrders(filters);

  const exportCsv = () => {
    const lines = ["orderNumber,customer,totalAmount,status,paymentStatus"];
    orders.forEach((order) => lines.push(`${order.orderNumber},${order.User?.name ?? ""},${order.totalAmount},${order.status},${order.paymentStatus}`));
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "orders.csv";
    link.click();
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Orders" description="Review and manage all customer orders." action={<Button variant="secondary" onClick={exportCsv}><Download className="h-4 w-4" />Export CSV</Button>} />
      <OrderFilters />
      <OrdersTable data={orders} isLoading={isLoading} />
    </div>
  );
}
