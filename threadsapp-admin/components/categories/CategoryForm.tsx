"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema, type CategoryFormValues } from "@/validations/category.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CategoryLite } from "@/types/product.types";

export function CategoryForm({ category, categories, onSubmit }: { category?: CategoryLite; categories: CategoryLite[]; onSubmit: (values: CategoryFormValues) => void }) {
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name ?? "",
      slug: category?.slug ?? "",
      description: "",
      image: category?.image ?? "",
      parentId: category?.parentId ?? null,
      displayOrder: category?.displayOrder ?? 0,
      isActive: true,
    },
  });

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div><Label>Name</Label><Input {...form.register("name")} /></div>
      <div><Label>Slug</Label><Input {...form.register("slug")} /></div>
      <div><Label>Description</Label><Textarea {...form.register("description")} /></div>
      <div><Label>Image URL</Label><Input {...form.register("image")} /></div>
      <div><Label>Parent Category</Label><Select value={form.watch("parentId") ?? ""} onValueChange={(value) => form.setValue("parentId", value === "none" ? null : value)}><SelectTrigger><SelectValue placeholder="Select parent" /></SelectTrigger><SelectContent><SelectItem value="none">No parent</SelectItem>{categories.map((item) => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}</SelectContent></Select></div>
      <Button type="submit">Save category</Button>
    </form>
  );
}
