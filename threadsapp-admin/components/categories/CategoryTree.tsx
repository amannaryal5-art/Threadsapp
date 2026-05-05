"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CategoryForm } from "@/components/categories/CategoryForm";
import type { CategoryLite } from "@/types/product.types";
import type { CategoryFormValues } from "@/validations/category.schema";

function TreeItem({
  item,
  level,
  onSave,
  onDelete,
  categories,
}: {
  item: CategoryLite;
  level: number;
  onSave: (values: CategoryFormValues, id?: string) => void;
  onDelete: (id: string) => void;
  categories: CategoryLite[];
}) {
  const [open, setOpen] = useState(true);
  const [editing, setEditing] = useState(false);
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between rounded-xl border border-border bg-white p-3" style={{ marginLeft: level * 16 }}>
        <div className="flex items-center gap-2">
          {(item.children?.length ?? 0) > 0 ? (
            <button type="button" onClick={() => setOpen((state) => !state)}>
              {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          ) : <span className="w-4" />}
          <div>
            <p className="font-medium">{item.name}</p>
            <p className="text-sm text-slate-500">{item.slug}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => setEditing(true)}>Edit</Button>
          <Button size="sm" variant="destructive" onClick={() => onDelete(item.id)}>Delete</Button>
        </div>
      </div>
      {open ? item.children?.map((child) => <TreeItem key={child.id} item={child} level={level + 1} onSave={onSave} onDelete={onDelete} categories={categories} />) : null}
      <Dialog open={editing} onOpenChange={setEditing}>
        <DialogContent>{editing ? <CategoryForm category={item} categories={categories} onSubmit={(values) => onSave(values, item.id)} /> : null}</DialogContent>
      </Dialog>
    </div>
  );
}

export function CategoryTree({
  categories,
  onSave,
  onDelete,
}: {
  categories: CategoryLite[];
  onSave: (values: CategoryFormValues, id?: string) => void;
  onDelete: (id: string) => void;
}) {
  const roots = categories.filter((item) => !item.parentId);
  const withChildren = roots.map((root) => ({
    ...root,
    children: categories.filter((item) => item.parentId === root.id),
  }));
  return <div className="space-y-3">{withChildren.map((item) => <TreeItem key={item.id} item={item} level={0} onSave={onSave} onDelete={onDelete} categories={categories} />)}</div>;
}
