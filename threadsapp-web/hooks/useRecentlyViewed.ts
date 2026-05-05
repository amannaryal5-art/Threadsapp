"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/types/product.types";

const STORAGE_KEY = "threadsapp-recently-viewed";

export function useRecentlyViewed(currentProduct?: Product) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? (JSON.parse(stored) as Product[]) : [];
    setProducts(parsed);
  }, []);

  useEffect(() => {
    if (!currentProduct) return;
    const next = [currentProduct, ...products.filter((item) => item.id !== currentProduct.id)].slice(0, 10);
    setProducts(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, [currentProduct?.id]);

  return products.filter((item) => item.id !== currentProduct?.id);
}
