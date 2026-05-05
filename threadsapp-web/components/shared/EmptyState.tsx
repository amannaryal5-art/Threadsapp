"use client";

import { ShoppingBag } from "lucide-react";
import { AppButton } from "@/components/shared/AppButton";

export function EmptyState({
  title,
  description,
  ctaHref = "/",
  ctaLabel = "Go Home"
}: {
  title: string;
  description: string;
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <div className="rounded-[32px] bg-white p-10 text-center shadow-soft">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <ShoppingBag className="h-8 w-8" />
      </div>
      <h3 className="text-2xl font-semibold text-secondary">{title}</h3>
      <p className="mx-auto mt-3 max-w-md text-sm text-secondary/60">{description}</p>
      <AppButton className="mt-6" onClick={() => (window.location.href = ctaHref)}>
        {ctaLabel}
      </AppButton>
    </div>
  );
}
