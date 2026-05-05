"use client";

import { useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/DataTable";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Coupon } from "@/types/coupon.types";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CouponForm } from "@/components/coupons/CouponForm";
import type { CategoryLite } from "@/types/product.types";
import type { CouponFormValues } from "@/validations/coupon.schema";

const columnHelper = createColumnHelper<Coupon>();

export function CouponsTable({
  data,
  categories,
  onSave,
  onDelete,
}: {
  data: Coupon[];
  categories: CategoryLite[];
  onSave: (values: CouponFormValues, id?: string) => void;
  onDelete: (id: string) => void;
}) {
  const [editing, setEditing] = useState<Coupon | null>(null);
  const columns = [
    columnHelper.accessor("code", { header: "Code", cell: ({ getValue }) => <span className="rounded-full bg-slate-100 px-2 py-1 font-mono text-xs">{getValue()}</span> }),
    columnHelper.accessor("type", { header: "Type" }),
    columnHelper.accessor("value", { header: "Value", cell: ({ row }) => row.original.type === "percent" ? `${row.original.value}%` : formatCurrency(row.original.value) }),
    columnHelper.accessor("minOrderAmount", { header: "Min Order", cell: ({ getValue }) => formatCurrency(getValue()) }),
    columnHelper.accessor("maxDiscount", { header: "Max Discount", cell: ({ getValue }) => getValue() ? formatCurrency(getValue() as string | number) : "-" }),
    columnHelper.display({ id: "usage", header: "Used / Limit", cell: ({ row }) => `${row.original.usageCount} / ${row.original.usageLimit ?? "∞"}` }),
    columnHelper.display({ id: "expiry", header: "Expiry", cell: ({ row }) => row.original.expiresAt ? formatDate(row.original.expiresAt) : "-" }),
    columnHelper.display({ id: "status", header: "Status", cell: ({ row }) => <span className={row.original.isActive ? "rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700" : "rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700"}>{row.original.isActive ? "Active" : "Inactive"}</span> }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => setEditing(row.original)}>Edit</Button>
          <Button size="sm" variant="destructive" onClick={() => onDelete(row.original.id)}>Delete</Button>
        </div>
      ),
    }),
  ];

  return (
    <>
      <DataTable columns={columns} data={data} emptyTitle="No coupons found" emptyDescription="Create your first coupon to start promotions." />
      <Sheet open={Boolean(editing)} onOpenChange={(open) => !open && setEditing(null)}>
        <SheetContent>
          {editing ? <CouponForm coupon={editing} categories={categories} onSubmit={(values) => onSave(values, editing.id)} /> : null}
        </SheetContent>
      </Sheet>
    </>
  );
}
