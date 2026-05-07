"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { BannerForm } from "@/components/banners/BannerForm";
import { BannersTable } from "@/components/banners/BannersTable";
import { useBanners, useDeleteBanner, useSaveBanner } from "@/hooks/useBanners";
import { useCategories } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";

export default function BannersPage() {
  const [open, setOpen] = useState(false);
  const { data: banners = [] } = useBanners();
  const { data: categories = [] } = useCategories();
  const { data: products = [] } = useProducts({});
  const createBanner = useSaveBanner();
  const deleteBanner = useDeleteBanner();

  return (
    <div className="space-y-6">
      <PageHeader title="Banners" description="Manage promotional banners, targets, schedules, and order." action={<Button onClick={() => setOpen(true)}>Add Banner</Button>} />
      <BannersTable data={banners} categories={categories} products={products} onSave={(values, id) => createBanner.mutate({ id, payload: values })} onDelete={(id) => deleteBanner.mutate(id)} />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <BannerForm categories={categories} products={products} onSubmit={(values) => createBanner.mutate({ payload: values })} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
