"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { CouponForm } from "@/components/coupons/CouponForm";
import { CouponsTable } from "@/components/coupons/CouponsTable";
import { useCategories } from "@/hooks/useCategories";
import { useCoupons, useDeleteCoupon, useSaveCoupon } from "@/hooks/useCoupons";

export default function CouponsPage() {
  const [open, setOpen] = useState(false);
  const { data: coupons = [] } = useCoupons();
  const { data: categories = [] } = useCategories();
  const createCoupon = useSaveCoupon();
  const deleteCoupon = useDeleteCoupon();

  return (
    <div className="space-y-6">
      <PageHeader title="Coupons" description="Create promotions, configure limits, and monitor expiry." action={<Button onClick={() => setOpen(true)}>Add Coupon</Button>} />
      <CouponsTable data={coupons} categories={categories} onSave={(values, id) => createCoupon.mutate({ id, payload: values })} onDelete={(id) => deleteCoupon.mutate(id)} />
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent>
          <CouponForm categories={categories} onSubmit={(values) => createCoupon.mutate({ payload: values })} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
