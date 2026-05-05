"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DayPicker } from "react-day-picker";
import { couponSchema, type CouponFormValues } from "@/validations/coupon.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Coupon } from "@/types/coupon.types";
import type { CategoryLite } from "@/types/product.types";

export function CouponForm({ coupon, categories, onSubmit, submitting }: { coupon?: Coupon; categories: CategoryLite[]; onSubmit: (values: CouponFormValues) => void; submitting?: boolean }) {
  const form = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: coupon?.code ?? "",
      description: coupon?.description ?? "",
      type: coupon?.type ?? "percent",
      value: Number(coupon?.value ?? 0),
      minOrderAmount: Number(coupon?.minOrderAmount ?? 0),
      maxDiscount: coupon?.maxDiscount ? Number(coupon.maxDiscount) : null,
      usageLimit: coupon?.usageLimit ?? null,
      perUserLimit: coupon?.perUserLimit ?? 1,
      expiresAt: coupon?.expiresAt ? new Date(coupon.expiresAt) : null,
      applicableCategories: coupon?.applicableCategories ?? [],
      isActive: coupon?.isActive ?? true,
    },
  });

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div><Label>Code</Label><Input {...form.register("code")} onChange={(event) => form.setValue("code", event.target.value.toUpperCase())} /></div>
      <div><Label>Description</Label><Textarea {...form.register("description")} /></div>
      <div className="grid gap-4 md:grid-cols-2">
        <div><Label>Type</Label><Select value={form.watch("type")} onValueChange={(value) => form.setValue("type", value as "percent" | "flat")}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="percent">Percent</SelectItem><SelectItem value="flat">Flat</SelectItem></SelectContent></Select></div>
        <div><Label>Value</Label><Input type="number" {...form.register("value", { valueAsNumber: true })} /></div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div><Label>Min order</Label><Input type="number" {...form.register("minOrderAmount", { valueAsNumber: true })} /></div>
        <div><Label>Max discount</Label><Input type="number" {...form.register("maxDiscount", { valueAsNumber: true })} /></div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div><Label>Usage limit</Label><Input type="number" {...form.register("usageLimit", { valueAsNumber: true })} /></div>
        <div><Label>Per user limit</Label><Input type="number" {...form.register("perUserLimit", { valueAsNumber: true })} /></div>
      </div>
      <div><Label>Expiry date</Label><DayPicker mode="single" selected={form.watch("expiresAt") ?? undefined} onSelect={(date) => form.setValue("expiresAt", date ?? null)} /></div>
      <div><Label>Applicable categories</Label><div className="grid gap-2 md:grid-cols-2">{categories.map((category) => <label key={category.id} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.watch("applicableCategories").includes(category.id)} onChange={(event) => form.setValue("applicableCategories", event.target.checked ? [...form.watch("applicableCategories"), category.id] : form.watch("applicableCategories").filter((id) => id !== category.id))} />{category.name}</label>)}</div></div>
      <Button type="submit" loading={submitting}>Save coupon</Button>
    </form>
  );
}
