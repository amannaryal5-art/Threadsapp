"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/DataTable";
import { ImagePreview } from "@/components/shared/ImagePreview";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { getProductThumbnail } from "@/lib/product-media";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types/product.types";

const columnHelper = createColumnHelper<Product>();

export function ProductsTable({
  data,
  isLoading,
  onToggleFeatured,
}: {
  data: Product[];
  isLoading?: boolean;
  onToggleFeatured: (id: string) => void;
}) {
  const columns = [
    columnHelper.accessor("images", {
      header: "Thumbnail",
      cell: ({ row }) => <ImagePreview src={getProductThumbnail(row.original)} alt={row.original.name} />,
    }),
    columnHelper.display({
      id: "name",
      header: "Product",
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-slate-900">{row.original.name}</p>
          <p className="text-sm text-slate-500">{row.original.Brand?.name ?? "No brand"}</p>
        </div>
      ),
    }),
    columnHelper.accessor((row) => row.Category?.name ?? "-", { id: "category", header: "Category" }),
    columnHelper.display({
      id: "pricing",
      header: "Pricing",
      cell: ({ row }) => {
        const variantAdditions = row.original.variants?.map((variant) => Number(variant.additionalPrice ?? 0)) ?? [0];
        const minAddition = Math.min(...variantAdditions);
        const maxAddition = Math.max(...variantAdditions);
        const baseMrp = Number(row.original.basePrice);
        const discountPercent = Number(row.original.discountPercent ?? 0);
        const minMrp = baseMrp + minAddition;
        const maxMrp = baseMrp + maxAddition;
        const minSelling = minMrp - (minMrp * discountPercent) / 100;
        const maxSelling = maxMrp - (maxMrp * discountPercent) / 100;

        return (
          <div className="text-sm">
            <p>
              {formatCurrency(minSelling)}{minSelling !== maxSelling ? ` - ${formatCurrency(maxSelling)}` : ""} /{" "}
              {formatCurrency(minMrp)}{minMrp !== maxMrp ? ` - ${formatCurrency(maxMrp)}` : ""}
            </p>
            <p className="text-slate-500">{row.original.discountPercent}% off</p>
          </div>
        );
      },
    }),
    columnHelper.display({
      id: "variants",
      header: "Variants",
      cell: ({ row }) => row.original.variants?.length ?? 0,
    }),
    columnHelper.display({
      id: "rating",
      header: "Rating",
      cell: ({ row }) => (
        <div className="inline-flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          {row.original.averageRating.toFixed(1)}
        </div>
      ),
    }),
    columnHelper.accessor("totalSold", { header: "Sold" }),
    columnHelper.display({
      id: "stock",
      header: "Stock",
      cell: ({ row }) => {
        const quantities = row.original.variants?.map((variant) => variant.inventory?.quantity ?? 0) ?? [];
        const totalStock = quantities.reduce((sum, quantity) => sum + quantity, 0);
        const low = quantities.some((quantity) => quantity > 0 && quantity < 5);
        if (totalStock <= 0) return <StatusBadge status="cancelled" />;
        if (low) return <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-700">Low</span>;
        return <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">In stock</span>;
      },
    }),
    columnHelper.display({
      id: "featured",
      header: "Featured",
      cell: ({ row }) => <Switch checked={row.original.isFeatured} onCheckedChange={() => onToggleFeatured(row.original.id)} />,
    }),
    columnHelper.display({
      id: "status",
      header: "Status",
      cell: ({ row }) => (
        <span className={row.original.isActive ? "rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700" : "rounded-full bg-slate-200 px-2 py-1 text-xs font-semibold text-slate-600"}>
          {row.original.isActive ? "Active" : "Inactive"}
        </span>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" asChild><Link href={`/products/${row.original.id}`}>Edit</Link></Button>
          <Button size="sm" variant="outline" asChild><Link href={`/products/${row.original.id}/inventory`}>Inventory</Link></Button>
        </div>
      ),
    }),
  ];

  return <DataTable columns={columns} data={data} isLoading={isLoading} emptyTitle="No products yet" emptyDescription="Start by creating your first product." />;
}
