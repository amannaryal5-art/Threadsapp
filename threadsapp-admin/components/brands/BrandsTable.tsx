"use client";

import { useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/DataTable";
import { ImagePreview } from "@/components/shared/ImagePreview";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { BrandForm } from "@/components/brands/BrandForm";
import type { BrandLite } from "@/types/product.types";

const columnHelper = createColumnHelper<BrandLite>();

export function BrandsTable({ data, onSave, onDelete }: { data: BrandLite[]; onSave: (values: Partial<BrandLite>, id?: string) => void; onDelete: (id: string) => void }) {
  const [editing, setEditing] = useState<BrandLite | null>(null);
  const columns = [
    columnHelper.display({ id: "logo", header: "Logo", cell: ({ row }) => <ImagePreview src={row.original.logo} alt={row.original.name} /> }),
    columnHelper.accessor("name", { header: "Name" }),
    columnHelper.accessor("slug", { header: "Slug" }),
    columnHelper.display({ id: "status", header: "Status", cell: () => <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">Active</span> }),
    columnHelper.display({ id: "actions", header: "Actions", cell: ({ row }) => <div className="flex gap-2"><Button size="sm" variant="secondary" onClick={() => setEditing(row.original)}>Edit</Button><Button size="sm" variant="destructive" onClick={() => onDelete(row.original.id)}>Delete</Button></div> }),
  ];
  return (
    <>
      <DataTable columns={columns} data={data} emptyTitle="No brands yet" emptyDescription="Add brands to structure your catalog." />
      <Dialog open={Boolean(editing)} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>{editing ? <BrandForm brand={editing} onSubmit={(values) => onSave(values, editing.id)} /> : null}</DialogContent>
      </Dialog>
    </>
  );
}
