"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CategoryTree } from "@/components/categories/CategoryTree";
import { CategoryForm } from "@/components/categories/CategoryForm";
import { useCategories, useDeleteCategory, useSaveCategory } from "@/hooks/useCategories";

export default function CategoriesPage() {
  const [open, setOpen] = useState(false);
  const { data: categories = [] } = useCategories();
  const createCategory = useSaveCategory();
  const deleteCategory = useDeleteCategory();

  return (
    <div className="space-y-6">
      <PageHeader title="Categories" description="Organize parent and child categories for the catalog." action={<Button onClick={() => setOpen(true)}>Add Category</Button>} />
      <CategoryTree categories={categories} onSave={(values, id) => createCategory.mutate({ id, payload: values })} onDelete={(id) => deleteCategory.mutate(id)} />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <CategoryForm categories={categories} onSubmit={(values) => createCategory.mutate({ payload: values })} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
