"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import type { ApiResponse } from "@/types/api.types";
import type { Product, ProductFilters, ProductVariant } from "@/types/product.types";
import type { ProductFormValues } from "@/validations/product.schema";
import { parseApiError } from "@/lib/utils";
import type { UploadImageItem } from "@/components/products/ImageUploader";

interface ProductsPayload {
  products: Product[];
}

export function useProducts(filters: ProductFilters) {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: async () => {
      const response = await api.get<ApiResponse<ProductsPayload>>("/admin/products", { params: filters });
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
      return response.data.data.products.find((item) => item.id === id) ?? null;
    },
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ProductFormValues) => {
      const createPayload = {
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
        variants: payload.variants.map(({ size, color, colorHex, sku, additionalPrice, quantity, lowStockThreshold }) => ({
          size,
          color,
          colorHex,
          sku,
          additionalPrice,
          quantity,
          lowStockThreshold,
        })),
      };

      const response = await api.post<ApiResponse<{ product: Product }>>("/admin/products", createPayload);
      const product = response.data.data.product;

      const filesToUpload = payload.images
        .slice()
        .sort((left, right) => left.displayOrder - right.displayOrder)
        .filter((image): image is UploadImageItem & { file: File } => Boolean((image as UploadImageItem).file));

      if (filesToUpload.length) {
        const formData = new FormData();
        filesToUpload.forEach((image) => {
          formData.append("images", image.file);
        });

        try {
          await api.post<ApiResponse<{ images: unknown[] }>>(`/admin/products/${product.id}/images`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        } catch (error) {
          toast.error(`Product created, but image upload failed: ${parseApiError(error)}`);
        }
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
    mutationFn: async (payload: Partial<ProductFormValues>) => {
      const response = await api.put<ApiResponse<{ product: Product }>>(`/admin/products/${id}`, payload);
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
