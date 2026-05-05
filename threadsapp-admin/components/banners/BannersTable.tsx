"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { BannerForm } from "@/components/banners/BannerForm";
import type { Banner } from "@/hooks/useBanners";
import type { CategoryLite, Product } from "@/types/product.types";
import type { BannerFormValues } from "@/validations/banner.schema";
import { formatDate } from "@/lib/utils";

export function BannersTable({
  data,
  categories,
  products,
  onSave,
  onDelete,
}: {
  data: Banner[];
  categories: CategoryLite[];
  products: Product[];
  onSave: (values: BannerFormValues, id?: string) => void;
  onDelete: (id: string) => void;
}) {
  const [editing, setEditing] = useState<Banner | null>(null);
  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {data.map((banner) => (
          <div key={banner.id} className="rounded-2xl border border-border bg-white p-4 shadow-soft">
            <div className="relative h-44 overflow-hidden rounded-xl">
              <Image src={banner.image} alt={banner.title} fill className="object-cover" />
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{banner.title}</h3>
                <span className={banner.isActive ? "rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700" : "rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700"}>{banner.isActive ? "Active" : "Inactive"}</span>
              </div>
              <p className="text-sm text-slate-500">Target: {banner.targetType}</p>
              <p className="text-sm text-slate-500">{banner.startsAt ? formatDate(banner.startsAt) : "Any time"} - {banner.endsAt ? formatDate(banner.endsAt) : "Open ended"}</p>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setEditing(banner)}>Edit</Button>
                <Button variant="destructive" onClick={() => onDelete(banner.id)}>Delete</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Dialog open={Boolean(editing)} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          {editing ? <BannerForm banner={editing} categories={categories} products={products} onSubmit={(values) => onSave(values, editing.id)} /> : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
