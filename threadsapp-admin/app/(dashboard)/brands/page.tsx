"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { BrandsTable } from "@/components/brands/BrandsTable";
import { BrandForm } from "@/components/brands/BrandForm";
import { useBrands, useDeleteBrand, useSaveBrand } from "@/hooks/useBrands";

export default function BrandsPage() {
  const [open, setOpen] = useState(false);
  const { data: brands = [] } = useBrands();
  const createBrand = useSaveBrand();
  const deleteBrand = useDeleteBrand();

  return (
    <div className="space-y-6">
      <PageHeader title="Brands" description="Manage supported brands and logo assets." action={<Button onClick={() => setOpen(true)}>Add Brand</Button>} />
      <BrandsTable data={brands} onSave={(values, id) => createBrand.mutate({ id, payload: values })} onDelete={(id) => deleteBrand.mutate(id)} />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent><BrandForm onSubmit={(values) => createBrand.mutate({ payload: values })} /></DialogContent>
      </Dialog>
    </div>
  );
}
