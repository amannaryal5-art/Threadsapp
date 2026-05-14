"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import { debugProductMedia } from "@/lib/product-media";
import type { ApiResponse } from "@/types/api.types";
import type { Product, ProductFilters, ProductVariant } from "@/types/product.types";
import type { ProductFormValues } from "@/validations/product.schema";
import { parseApiError } from "@/lib/utils";
import type { UploadImageItem } from "@/components/products/ImageUploader";

interface ProductsPayload {
  products: Product[];
}

function buildProductPayload(payload: ProductFormValues | Partial<ProductFormValues>) {
  return {
    name: payload.name,
    brandId: payload.brandId,
    categoryId: payload.categoryId,
    fabric: payload.fabric,
    pattern: payload.pattern,
    occasion: payload.occasion,
    fit: payload.fit,
    care: payload.care,
    countryOfOrigin: payload.countryOfOrigin,
    tags: payload.tags,
    isFeatured: payload.isFeatured,
    basePrice: payload.basePrice,
    discountPercent: payload.discountPercent,
    description: payload.description,
    variants:
      payload.variants?.map(({ id, size, color, colorHex, sku, additionalPrice, quantity, lowStockThreshold }) => ({
        id,
        size,
        color,
        colorHex,
        sku,
        additionalPrice,
        quantity,
        lowStockThreshold,
      })) ?? [],
  };
}

async function uploadProductImages(productId: string, images: UploadImageItem[]) {
  const filesToUpload = images
    .slice()
    .sort((left, right) => left.displayOrder - right.displayOrder)
    .filter((image): image is UploadImageItem & { file: File } => Boolean(image.file));

  if (!filesToUpload.length) return;

  const formData = new FormData();
  filesToUpload.forEach((image) => {
    formData.append("images", image.file);
  });

  await api.post<ApiResponse<{ images: unknown[] }>>(`/admin/products/${productId}/images`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export function useProducts(filters: ProductFilters) {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: async () => {
      const response = await api.get<ApiResponse<ProductsPayload>>("/admin/products", { params: filters });
      if (process.env.NODE_ENV !== "production") {
        response.data.data.products.forEach((product) => debugProductMedia(`admin.useProducts:${product.slug}`, product));
      }
      return response.data.data.products;
    },
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["product", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const response = await api.get<ApiResponse<{ products: Product[] }>>("/admin/products");
      const product = response.data.data.products.find((item) => item.id === id) ?? null;
      debugProductMedia(`admin.useProduct:${id}`, product);
      return product;
    },
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ProductFormValues) => {
      const response = await api.post<ApiResponse<{ product: Product }>>("/admin/products", buildProductPayload(payload));
      const product = response.data.data.product;

      try {
        await uploadProductImages(product.id, payload.images);
      } catch (error) {
        toast.error(`Product created, but image upload failed: ${parseApiError(error)}`);
      }

      return product;
    },
    onSuccess: () => {
      toast.success("Product created successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => toast.error(parseApiError(error)),
  });
}

export function useUpdateProduct(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ProductFormValues) => {
      const response = await api.put<ApiResponse<{ product: Product }>>(`/admin/products/${id}`, buildProductPayload(payload));

      try {
        await uploadProductImages(id, payload.images);
      } catch (error) {
        toast.error(`Product updated, but image upload failed: ${parseApiError(error)}`);
      }

      return response.data.data.product;
    },
    onSuccess: () => {
      toast.success("Product updated successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", id] });
    },
    onError: (error) => toast.error(parseApiError(error)),
  });
}

export function useToggleFeatured() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.put<ApiResponse<{ product: Product }>>(`/admin/products/${id}/featured`);
      return response.data.data.product;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["products"] });
      const previous = queryClient.getQueriesData<Product[]>({ queryKey: ["products"] });
      previous.forEach(([key, value]) => {
        if (!value) return;
        queryClient.setQueryData<Product[]>(key, value.map((item) => item.id === id ? { ...item, isFeatured: !item.isFeatured } : item));
      });
      return { previous };
    },
    onError: (error, _variables, context) => {
      context?.previous.forEach(([key, value]) => queryClient.setQueryData(key, value));
      toast.error(parseApiError(error));
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useDeactivateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => api.delete(`/admin/products/${id}`),
    onSuccess: () => {
      toast.success("Product deactivated");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => toast.error(parseApiError(error)),
  });
}

export function useUpdateInventory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ variantId, quantity, lowStockThreshold }: { variantId: string; quantity: number; lowStockThreshold: number }) =>
      api.put(`/admin/inventory/${variantId}`, { quantity, lowStockThreshold }),
    onSuccess: () => {
      toast.success("Inventory updated");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => toast.error(parseApiError(error)),
  });
}
