"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { BrandLite } from "@/types/product.types";

export function BrandForm({ brand, onSubmit }: { brand?: BrandLite; onSubmit: (values: Partial<BrandLite>) => void }) {
  const form = useForm<Partial<BrandLite>>({
    defaultValues: {
      name: brand?.name ?? "",
      slug: brand?.slug ?? "",
      logo: brand?.logo ?? "",
    },
  });

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div><Label>Name</Label><Input {...form.register("name")} /></div>
      <div><Label>Slug</Label><Input {...form.register("slug")} /></div>
      <div><Label>Logo URL</Label><Input {...form.register("logo")} /></div>
      <Button type="submit">Save brand</Button>
    </form>
  );
}
