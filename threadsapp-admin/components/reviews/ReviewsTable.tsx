"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { Star } from "lucide-react";
import { DataTable } from "@/components/shared/DataTable";
import { ImagePreview } from "@/components/shared/ImagePreview";
import { formatDate } from "@/lib/utils";
import type { ReviewItem } from "@/hooks/useReviews";
import { Button } from "@/components/ui/button";

const columnHelper = createColumnHelper<ReviewItem>();

export function ReviewsTable({ data, onDelete }: { data: ReviewItem[]; onDelete: (id: string) => void }) {
  const columns = [
    columnHelper.display({
      id: "product",
      header: "Product",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <ImagePreview src={row.original.Product?.images?.[0]?.url} alt={row.original.Product?.name ?? "Product"} />
          <span>{row.original.Product?.name ?? "-"}</span>
        </div>
      ),
    }),
    columnHelper.display({ id: "user", header: "User", cell: ({ row }) => row.original.User?.name ?? "-" }),
    columnHelper.display({ id: "rating", header: "Rating", cell: ({ row }) => <span className="inline-flex items-center gap-1"><Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />{row.original.rating}</span> }),
    columnHelper.display({ id: "comment", header: "Comment", cell: ({ row }) => <p className="max-w-xs truncate">{row.original.comment ?? row.original.title ?? "-"}</p> }),
    columnHelper.display({ id: "verified", header: "Verified", cell: ({ row }) => row.original.isVerifiedPurchase ? <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">Verified</span> : null }),
    columnHelper.display({ id: "date", header: "Date", cell: ({ row }) => formatDate(row.original.createdAt) }),
    columnHelper.display({ id: "actions", header: "Actions", cell: ({ row }) => <Button size="sm" variant="destructive" onClick={() => onDelete(row.original.id)}>Delete</Button> }),
  ];
  return <DataTable columns={columns} data={data} emptyTitle="No reviews yet" emptyDescription="Product reviews will be visible here." />;
}
