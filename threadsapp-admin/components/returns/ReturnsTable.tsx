"use client";

import Link from "next/link";
import { createColumnHelper } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDate } from "@/lib/utils";
import type { ReturnRequest } from "@/types/return.types";
import { Button } from "@/components/ui/button";

const columnHelper = createColumnHelper<ReturnRequest>();

export function ReturnsTable({ data, isLoading }: { data: ReturnRequest[]; isLoading?: boolean }) {
  const columns = [
    columnHelper.accessor("id", { header: "Return ID" }),
    columnHelper.display({ id: "orderNumber", header: "Order", cell: ({ row }) => row.original.Order?.orderNumber ?? "-" }),
    columnHelper.display({ id: "customer", header: "Customer", cell: ({ row }) => row.original.User?.name ?? row.original.Order?.User?.name ?? "-" }),
    columnHelper.display({ id: "product", header: "Product", cell: ({ row }) => row.original.OrderItem?.productName ?? "-" }),
    columnHelper.accessor("reason", { header: "Reason" }),
    columnHelper.display({ id: "status", header: "Status", cell: ({ row }) => <StatusBadge status={row.original.status} /> }),
    columnHelper.display({ id: "date", header: "Requested", cell: ({ row }) => formatDate(row.original.createdAt) }),
    columnHelper.display({ id: "actions", header: "Actions", cell: ({ row }) => <Button size="sm" variant="secondary" asChild><Link href={`/returns/${row.original.id}`}>View</Link></Button> }),
  ];
  return <DataTable columns={columns} data={data} isLoading={isLoading} emptyTitle="No return requests" emptyDescription="Return requests will appear here when customers raise them." />;
}
