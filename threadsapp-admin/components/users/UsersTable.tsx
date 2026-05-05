"use client";

import Link from "next/link";
import { createColumnHelper } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/DataTable";
import { ImagePreview } from "@/components/shared/ImagePreview";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { User } from "@/types/user.types";
import { Button } from "@/components/ui/button";

const columnHelper = createColumnHelper<User>();

export function UsersTable({ data, isLoading }: { data: User[]; isLoading?: boolean }) {
  const columns = [
    columnHelper.display({
      id: "name",
      header: "User",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <ImagePreview src={row.original.profilePhoto} alt={row.original.name} />
          <div>
            <p className="font-medium">{row.original.name}</p>
            <p className="text-sm text-slate-500">{row.original.email}</p>
          </div>
        </div>
      ),
    }),
    columnHelper.accessor("phone", { header: "Phone" }),
    columnHelper.accessor("loyaltyPoints", { header: "Loyalty Points" }),
    columnHelper.display({ id: "joined", header: "Joined", cell: ({ row }) => formatDate(row.original.createdAt) }),
    columnHelper.display({
      id: "status",
      header: "Status",
      cell: ({ row }) => (
        <span className={row.original.isActive ? "rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700" : "rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700"}>
          {row.original.isActive ? "Active" : "Blocked"}
        </span>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => <Button size="sm" variant="secondary" asChild><Link href={`/users/${row.original.id}`}>View</Link></Button>,
    }),
  ];

  return <DataTable columns={columns} data={data} isLoading={isLoading} emptyTitle="No users found" emptyDescription="Your user base will show up here." />;
}
