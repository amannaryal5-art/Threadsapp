"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/products/ProductCard";
import type { Product } from "@/types/product.types";

function getRemainingTime() {
  const target = new Date();
  target.setHours(23, 59, 59, 999);
  const diff = target.getTime() - Date.now();
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return [hours, minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
}

export function FlashSaleBanner({ products }: { products: Product[] }) {
  const [remaining, setRemaining] = useState(getRemainingTime());

  useEffect(() => {
    const timer = setInterval(() => setRemaining(getRemainingTime()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="rounded-[36px] bg-[#ff817d] p-8 text-white">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/75">⚡ Flash Sale</p>
          <h2 className="mt-2 text-3xl font-bold">Deal clock is ticking</h2>
        </div>
        <div className="rounded-full bg-white/20 px-5 py-3 text-lg font-semibold backdrop-blur">{remaining}</div>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} compact />
        ))}
      </div>
      <Link href="/search?discount=30" className="mt-6 inline-block text-sm font-semibold">
        View All Deals →
      </Link>
    </section>
  );
}
