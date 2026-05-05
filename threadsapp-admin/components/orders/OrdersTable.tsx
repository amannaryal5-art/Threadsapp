"use client";

import Link from "next/link";
import { createColumnHelper } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Order } from "@/types/order.types";
import { Button } from "@/components/ui/button";

const columnHelper = createColumnHelper<Order>();

export function OrdersTable({ data, isLoading }: { data: Order[]; isLoading?: boolean }) {
  const columns = [
    columnHelper.display({
      id: "orderNumber",
      header: "Order",
      cell: ({ row }) => <Link href={`/orders/${row.original.id}`} className="font-medium text-coral">{row.original.orderNumber}</Link>,
    }),
    columnHelper.display({
      id: "customer",
      header: "Customer",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.User?.name ?? "Customer"}</p>
          <p className="text-sm text-slate-500">{row.original.User?.phone ?? "-"}</p>
        </div>
      ),
    }),
    columnHelper.display({
      id: "items",
      header: "Items",
      cell: ({ row }) => `${row.original.items?.length ?? 0} items`,
    }),
    columnHelper.display({
      id: "amount",
      header: "Total Amount",
      cell: ({ row }) => formatCurrency(row.original.totalAmount),
    }),
    columnHelper.display({
      id: "paymentStatus",
      header: "Payment",
      cell: ({ row }) => <StatusBadge status={row.original.paymentStatus} />,
    }),
    columnHelper.display({
      id: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    }),
    columnHelper.display({
      id: "createdAt",
      header: "Date",
      cell: ({ row }) => formatDate(row.original.createdAt, "dd MMM yyyy"),
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => <Button size="sm" variant="secondary" asChild><Link href={`/orders/${row.original.id}`}>View</Link></Button>,
    }),
  ];

  return <DataTable columns={columns} data={data} isLoading={isLoading} emptyTitle="No orders found" emptyDescription="Orders will appear here once customers start purchasing." />;
}
