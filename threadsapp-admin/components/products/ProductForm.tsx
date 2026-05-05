"use client";

import { AlertCircle, CheckCircle2, ImageIcon, Layers3, Package2, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useRouter } from "next/navigation";
import { productSchema, type ProductFormValues } from "@/validations/product.schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { VariantManager } from "@/components/products/VariantManager";
import { ImageUploader } from "@/components/products/ImageUploader";
import { InventoryTable } from "@/components/products/InventoryTable";
import { FABRICS, FITS, OCCASIONS, PATTERNS } from "@/lib/constants";
import type { BrandLite, CategoryLite, Product } from "@/types/product.types";
import toast from "react-hot-toast";
import { useSaveBrand } from "@/hooks/useBrands";
import { useSaveCategory } from "@/hooks/useCategories";
import { slugifyText } from "@/lib/utils";

export function ProductForm({
  brands,
  categories,
  product,
  onSubmit,
  onInventorySave,
  submitting,
  metaLoading,
  refreshBrands,
  refreshCategories,
}: {
  brands: BrandLite[];
  categories: CategoryLite[];
  product?: Product | null;
  onSubmit: (payload: ProductFormValues) => Promise<unknown>;
  onInventorySave?: (payload: { variantId: string; quantity: number; lowStockThreshold: number }) => void;
  submitting?: boolean;
  metaLoading?: boolean;
  refreshBrands?: () => Promise<unknown>;
  refreshCategories?: () => Promise<unknown>;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("basic");
  const [quickBrandName, setQuickBrandName] = useState("");
  const [quickCategoryName, setQuickCategoryName] = useState("");
  const [availableBrands, setAvailableBrands] = useState(brands);
  const [availableCategories, setAvailableCategories] = useState(categories);
  const saveBrand = useSaveBrand();
  const saveCategory = useSaveCategory();
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name ?? "",
      brandId: product?.brandId ?? "",
      categoryId: product?.categoryId ?? "",
      fabric: product?.fabric ?? "",
      pattern: product?.pattern ?? "",
      occasion: product?.occasion ?? "",
      fit: product?.fit ?? "",
      gender: "",
      care: product?.care ?? "",
      countryOfOrigin: product?.countryOfOrigin ?? "India",
      tags: product?.tags ?? [],
      isFeatured: product?.isFeatured ?? false,
      basePrice: Number(product?.basePrice ?? 0),
      discountPercent: product?.discountPercent ?? 0,
      description: product?.description ?? "",
      variants:
        product?.variants?.map((variant) => ({
          id: variant.id,
          size: variant.size,
          color: variant.color,
          colorHex: variant.colorHex ?? "#111827",
          sku: variant.sku,
          additionalPrice: Number(variant.additionalPrice),
          quantity: variant.inventory?.quantity ?? 0,
          lowStockThreshold: variant.inventory?.lowStockThreshold ?? 5,
        })) ?? [],
      images:
        product?.images?.map((image) => ({
          id: image.id,
          url: image.url,
          altText: image.altText ?? "",
          isPrimary: image.isPrimary,
          variantId: image.variantId ?? null,
          displayOrder: image.displayOrder,
        })) ?? [],
    },
  });

  const editor = useEditor({
    extensions: [StarterKit],
    content: form.watch("description"),
    onUpdate: ({ editor: currentEditor }) => {
      form.setValue("description", currentEditor.getHTML(), { shouldValidate: true });
    },
  });

  useEffect(() => {
    if (editor && product?.description) {
      editor.commands.setContent(product.description);
    }
  }, [editor, product?.description]);

  useEffect(() => {
    setAvailableBrands(brands);
  }, [brands]);

  useEffect(() => {
    setAvailableCategories(categories);
  }, [categories]);

  const basePrice = form.watch("basePrice");
  const discountPercent = form.watch("discountPercent");
  const variants = form.watch("variants");
  const images = form.watch("images");
  const sellingPrice = useMemo(() => basePrice - (basePrice * discountPercent) / 100, [basePrice, discountPercent]);
  const expectedMargin = useMemo(() => Math.max(basePrice - sellingPrice, 0), [basePrice, sellingPrice]);
  const hasExistingProduct = Boolean(product?.id);

  const setFieldValue = <T extends keyof ProductFormValues>(field: T, value: ProductFormValues[T]) => {
    form.setValue(field as never, value as never, { shouldDirty: true, shouldValidate: true });
  };

  const fieldError = (name: keyof ProductFormValues) => form.formState.errors[name]?.message;
  const errorCount = Object.keys(form.formState.errors).length;
  const findBrandByName = (name: string) => availableBrands.find((brand) => slugifyText(brand.name) === slugifyText(name));
  const findCategoryByName = (name: string) => availableCategories.find((category) => slugifyText(category.name) === slugifyText(name));

  const tabsByField: Array<{ fields: Array<keyof ProductFormValues>; tab: string }> = [
    { fields: ["name", "brandId", "categoryId", "fabric", "pattern", "occasion", "fit", "care", "countryOfOrigin", "tags"], tab: "basic" },
    { fields: ["basePrice", "discountPercent"], tab: "pricing" },
    { fields: ["description"], tab: "description" },
    { fields: ["variants"], tab: "variants" },
    { fields: ["images"], tab: "images" },
  ];

  return (
    <form
      className="space-y-6"
      onSubmit={form.handleSubmit(
        async (values) => {
          await onSubmit(values);
          router.push("/products");
        },
        (errors) => {
          const firstField = Object.keys(errors)[0] as keyof ProductFormValues | undefined;
          const nextTab = tabsByField.find((item) => firstField && item.fields.includes(firstField))?.tab ?? "basic";
          setActiveTab(nextTab);
          toast.error("Please complete the required product fields before creating it.");
        },
      )}
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="flex w-full flex-wrap gap-2 bg-transparent p-0">
              {["basic", "pricing", "description", "variants", "images", "inventory"].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="border border-slate-200 bg-white capitalize data-[state=active]:border-coral data-[state=active]:bg-coral/5"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>

            {errorCount > 0 ? (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorCount} field{errorCount > 1 ? "s" : ""} still need attention before this product can be created.
              </div>
            ) : null}

            <TabsContent value="basic">
              <Card className="border-slate-200 shadow-sm">
                <CardContent className="grid gap-5 pt-6 md:grid-cols-2">
                  <div className="md:col-span-2 flex items-start justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Core product identity</p>
                      <p className="text-sm text-slate-500">Set the catalog mapping and product attributes that drive search, filters, and merchandising.</p>
                    </div>
                    {metaLoading ? <span className="text-xs font-medium text-slate-500">Loading metadata…</span> : null}
                  </div>

                  {!metaLoading && (!availableBrands.length || !availableCategories.length) ? (
                    <div className="md:col-span-2 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                      <p className="text-sm font-semibold text-slate-900">Catalog setup required</p>
                      <p className="mt-1 text-sm text-slate-600">You need at least one brand and one category before a product can be created. Create them here and the form will auto-select them.</p>
                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <div className="space-y-2 rounded-2xl bg-white p-4">
                          <Label>Quick create brand</Label>
                          <Input value={quickBrandName} onChange={(event) => setQuickBrandName(event.target.value)} placeholder="e.g. Threads Essentials" />
                          <Button
                            type="button"
                            variant="secondary"
                            loading={saveBrand.isPending}
                            disabled={!quickBrandName.trim()}
                            onClick={async () => {
                              const rawName = quickBrandName.trim();
                              const existingBrand = findBrandByName(rawName);
                              if (existingBrand) {
                                setFieldValue("brandId", existingBrand.id);
                                toast.success("Existing brand selected");
                                return;
                              }

                              try {
                                const brand = await saveBrand.mutateAsync({
                                  payload: {
                                    name: rawName,
                                    slug: slugifyText(rawName),
                                  },
                                });
                                setAvailableBrands((current) => [...current, brand]);
                                setFieldValue("brandId", brand.id);
                                setQuickBrandName("");
                                toast.success("Brand created and selected");
                              } catch {
                                const refreshed = await refreshBrands?.();
                                const refreshedBrands = ((refreshed as { data?: BrandLite[] } | undefined)?.data ?? availableBrands) as BrandLite[];
                                setAvailableBrands(refreshedBrands);
                                const matchedBrand = refreshedBrands.find((brand) => slugifyText(brand.name) === slugifyText(rawName));
                                if (matchedBrand) {
                                  setFieldValue("brandId", matchedBrand.id);
                                  toast.success("Existing brand selected");
                                }
                              }
                            }}
                          >
                            Create brand
                          </Button>
                        </div>
                        <div className="space-y-2 rounded-2xl bg-white p-4">
                          <Label>Quick create category</Label>
                          <Input value={quickCategoryName} onChange={(event) => setQuickCategoryName(event.target.value)} placeholder="e.g. Bottomwear" />
                          <Button
                            type="button"
                            variant="secondary"
                            loading={saveCategory.isPending}
                            disabled={!quickCategoryName.trim()}
                            onClick={async () => {
                              const rawName = quickCategoryName.trim();
                              const existingCategory = findCategoryByName(rawName);
                              if (existingCategory) {
                                setFieldValue("categoryId", existingCategory.id);
                                toast.success("Existing category selected");
                                return;
                              }

                              try {
                                const category = await saveCategory.mutateAsync({
                                  payload: {
                                    name: rawName,
                                    slug: slugifyText(rawName),
                                    description: "",
                                    image: "",
                                    parentId: null,
                                    displayOrder: 0,
                                    isActive: true,
                                  },
                                });
                                setAvailableCategories((current) => [...current, category]);
                                setFieldValue("categoryId", category.id);
                                setQuickCategoryName("");
                                toast.success("Category created and selected");
                              } catch {
                                const refreshed = await refreshCategories?.();
                                const refreshedCategories = ((refreshed as { data?: CategoryLite[] } | undefined)?.data ?? availableCategories) as CategoryLite[];
                                setAvailableCategories(refreshedCategories);
                                const matchedCategory = refreshedCategories.find((category) => slugifyText(category.name) === slugifyText(rawName));
                                if (matchedCategory) {
                                  setFieldValue("categoryId", matchedCategory.id);
                                  toast.success("Existing category selected");
                                }
                              }
                            }}
                          >
                            Create category
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  <div>
                    <Label>Product name</Label>
                    <Input {...form.register("name")} placeholder="Straight Fit Cotton Pants" />
                    {fieldError("name") ? <p className="mt-1 text-xs text-red-600">{fieldError("name")}</p> : null}
                  </div>

                  <div>
                    <Label>Brand</Label>
                    <Select value={form.watch("brandId")} onValueChange={(value) => setFieldValue("brandId", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder={availableBrands.length ? "Select brand" : "No brands available"} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableBrands.map((brand) => (
                          <SelectItem key={brand.id} value={brand.id}>
                            {brand.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldError("brandId") ? <p className="mt-1 text-xs text-red-600">{fieldError("brandId")}</p> : null}
                  </div>

                  <div>
                    <Label>Category</Label>
                    <Select value={form.watch("categoryId")} onValueChange={(value) => setFieldValue("categoryId", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder={availableCategories.length ? "Select category" : "No categories available"} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldError("categoryId") ? <p className="mt-1 text-xs text-red-600">{fieldError("categoryId")}</p> : null}
                  </div>

                  <div>
                    <Label>Country of origin</Label>
                    <Input {...form.register("countryOfOrigin")} />
                    {fieldError("countryOfOrigin") ? <p className="mt-1 text-xs text-red-600">{fieldError("countryOfOrigin")}</p> : null}
                  </div>

                  <div>
                    <Label>Fabric</Label>
                    <Select value={form.watch("fabric")} onValueChange={(value) => setFieldValue("fabric", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select fabric" />
                      </SelectTrigger>
                      <SelectContent>
                        {FABRICS.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Pattern</Label>
                    <Select value={form.watch("pattern")} onValueChange={(value) => setFieldValue("pattern", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select pattern" />
                      </SelectTrigger>
                      <SelectContent>
                        {PATTERNS.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Occasion</Label>
                    <Select value={form.watch("occasion")} onValueChange={(value) => setFieldValue("occasion", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select occasion" />
                      </SelectTrigger>
                      <SelectContent>
                        {OCCASIONS.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Fit</Label>
                    <Select value={form.watch("fit")} onValueChange={(value) => setFieldValue("fit", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select fit" />
                      </SelectTrigger>
                      <SelectContent>
                        {FITS.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2">
                    <Label>Care instructions</Label>
                    <Textarea {...form.register("care")} placeholder="Machine wash cold, gentle cycle. Do not tumble dry." />
                  </div>

                  <div className="md:col-span-2">
                    <Label>Tags</Label>
                    <Input
                      placeholder="formal, breathable, summer"
                      defaultValue={form.watch("tags").join(", ")}
                      onBlur={(event) =>
                        setFieldValue(
                          "tags",
                          event.target.value
                            .split(",")
                            .map((tag) => tag.trim())
                            .filter(Boolean),
                        )
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pricing">
              <Card className="border-slate-200 shadow-sm">
                <CardContent className="grid gap-5 pt-6 md:grid-cols-2">
                  <div>
                    <Label>MRP</Label>
                    <Input type="number" {...form.register("basePrice", { valueAsNumber: true })} />
                    {fieldError("basePrice") ? <p className="mt-1 text-xs text-red-600">{fieldError("basePrice")}</p> : null}
                  </div>

                  <div>
                    <Label>Discount %</Label>
                    <Input type="number" {...form.register("discountPercent", { valueAsNumber: true })} />
                    {fieldError("discountPercent") ? <p className="mt-1 text-xs text-red-600">{fieldError("discountPercent")}</p> : null}
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 md:col-span-2">
                    <p className="text-sm text-slate-500">Selling price</p>
                    <p className="mt-1 text-3xl font-semibold text-slate-900">Rs. {sellingPrice.toFixed(2)}</p>
                    <div className="mt-3 flex flex-wrap gap-3 text-sm">
                      <span className="rounded-full bg-white px-3 py-1 text-slate-700 shadow-sm">{discountPercent}% discount</span>
                      <span className="rounded-full bg-white px-3 py-1 text-slate-700 shadow-sm">Margin retained: Rs. {expectedMargin.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="description">
              <Card className="border-slate-200 shadow-sm">
                <CardContent className="space-y-4 pt-6">
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="secondary" onClick={() => editor?.chain().focus().toggleBold().run()}>
                      Bold
                    </Button>
                    <Button type="button" variant="secondary" onClick={() => editor?.chain().focus().toggleItalic().run()}>
                      Italic
                    </Button>
                    <Button type="button" variant="secondary" onClick={() => editor?.chain().focus().toggleBulletList().run()}>
                      Bullets
                    </Button>
                    <Button type="button" variant="secondary" onClick={() => editor?.chain().focus().toggleOrderedList().run()}>
                      Numbers
                    </Button>
                  </div>
                  <div className="prose-editor min-h-[260px] rounded-2xl border border-border p-4">
                    <EditorContent editor={editor} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="variants">
              <Card className="border-slate-200 shadow-sm">
                <CardContent className="pt-6">
                  <VariantManager control={form.control} register={form.register} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="images">
              <Card className="border-slate-200 shadow-sm">
                <CardContent className="pt-6">
                  <ImageUploader value={images} onChange={(nextImages) => setFieldValue("images", nextImages)} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="inventory">
              <Card className="border-slate-200 shadow-sm">
                <CardContent className="pt-6">
                  {hasExistingProduct ? (
                    <InventoryTable variants={product?.variants ?? []} onSave={(payload) => onInventorySave?.(payload)} />
                  ) : (
                    <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                      <Package2 className="mx-auto h-8 w-8 text-slate-400" />
                      <p className="mt-3 text-sm font-semibold text-slate-900">Inventory becomes editable after the product is created</p>
                      <p className="mt-1 text-sm text-slate-500">Set stock per variant in the Variants tab now. Fine-grained inventory management appears after the first save.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-4">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-coral/10 text-coral">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Publishing checklist</p>
                  <p className="text-sm text-slate-500">A real catalog workflow should be complete before it goes live.</p>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  {form.watch("name") && form.watch("brandId") && form.watch("categoryId") ? <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" /> : <AlertCircle className="mt-0.5 h-4 w-4 text-amber-500" />}
                  <span className="text-slate-700">Product identity and catalog mapping</span>
                </div>
                <div className="flex items-start gap-3">
                  {variants.length > 0 && variants.every((variant) => variant.size && variant.color && variant.sku) ? <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" /> : <AlertCircle className="mt-0.5 h-4 w-4 text-amber-500" />}
                  <span className="text-slate-700">At least one sellable variant</span>
                </div>
                <div className="flex items-start gap-3">
                  {images.length > 0 ? <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" /> : <AlertCircle className="mt-0.5 h-4 w-4 text-amber-500" />}
                  <span className="text-slate-700">Gallery images ready for upload</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-center gap-3">
                <Layers3 className="h-5 w-5 text-slate-700" />
                <p className="font-semibold text-slate-900">Listing summary</p>
              </div>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Variants</span>
                  <span className="font-medium text-slate-900">{variants.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Images</span>
                  <span className="font-medium text-slate-900">{images.length}/6</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Base price</span>
                  <span className="font-medium text-slate-900">Rs. {Number(basePrice || 0).toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Live selling price</span>
                  <span className="font-semibold text-slate-900">Rs. {sellingPrice.toFixed(2)}</span>
                </div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                <div className="flex items-start gap-2">
                  <ImageIcon className="mt-0.5 h-4 w-4 text-slate-400" />
                  <p>Images are uploaded to the backend after the product record is created, so this flow now matches a real admin workflow instead of a front-end mock.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3">
            <Button type="submit" loading={submitting} size="lg">
              {product ? "Update product" : "Create product"}
            </Button>
            <Button type="button" variant="secondary" size="lg" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
