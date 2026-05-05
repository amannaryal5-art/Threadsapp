"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DayPicker } from "react-day-picker";
import { bannerSchema, type BannerFormValues } from "@/validations/banner.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Banner } from "@/hooks/useBanners";
import type { CategoryLite, Product } from "@/types/product.types";

export function BannerForm({
  banner,
  categories,
  products,
  onSubmit,
}: {
  banner?: Banner;
  categories: CategoryLite[];
  products: Product[];
  onSubmit: (values: BannerFormValues) => void;
}) {
  const form = useForm<BannerFormValues>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      title: banner?.title ?? "",
      image: banner?.image ?? "",
      targetType: (banner?.targetType as BannerFormValues["targetType"]) ?? "none",
      targetId: banner?.targetId ?? null,
      targetUrl: banner?.targetUrl ?? "",
      startsAt: banner?.startsAt ? new Date(banner.startsAt) : null,
      endsAt: banner?.endsAt ? new Date(banner.endsAt) : null,
      isActive: banner?.isActive ?? true,
      displayOrder: banner?.displayOrder ?? 0,
    },
  });

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div><Label>Title</Label><Input {...form.register("title")} /></div>
      <div><Label>Image URL</Label><Input {...form.register("image")} /></div>
      <div><Label>Target type</Label><Select value={form.watch("targetType")} onValueChange={(value) => form.setValue("targetType", value as BannerFormValues["targetType"])}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">None</SelectItem><SelectItem value="category">Category</SelectItem><SelectItem value="product">Product</SelectItem><SelectItem value="url">URL</SelectItem></SelectContent></Select></div>
      {form.watch("targetType") === "category" ? <div><Label>Category</Label><Select value={form.watch("targetId") ?? ""} onValueChange={(value) => form.setValue("targetId", value)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{categories.map((category) => <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>)}</SelectContent></Select></div> : null}
      {form.watch("targetType") === "product" ? <div><Label>Product</Label><Select value={form.watch("targetId") ?? ""} onValueChange={(value) => form.setValue("targetId", value)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{products.map((product) => <SelectItem key={product.id} value={product.id}>{product.name}</SelectItem>)}</SelectContent></Select></div> : null}
      {form.watch("targetType") === "url" ? <div><Label>Target URL</Label><Input {...form.register("targetUrl")} /></div> : null}
      <div><Label>Start date</Label><DayPicker mode="single" selected={form.watch("startsAt") ?? undefined} onSelect={(value) => form.setValue("startsAt", value ?? null)} /></div>
      <div><Label>End date</Label><DayPicker mode="single" selected={form.watch("endsAt") ?? undefined} onSelect={(value) => form.setValue("endsAt", value ?? null)} /></div>
      <Button type="submit">Save banner</Button>
    </form>
  );
}
