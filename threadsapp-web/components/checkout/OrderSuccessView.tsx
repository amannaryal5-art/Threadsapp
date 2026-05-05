"use client";

import { useEffect } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { CheckCircle2 } from "lucide-react";
import { AppButton } from "@/components/shared/AppButton";

export function OrderSuccessView({ orderId, orderNumber }: { orderId: string; orderNumber?: string }) {
  useEffect(() => {
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
  }, []);

  return (
    <div className="rounded-[36px] bg-white p-10 text-center shadow-soft">
      <CheckCircle2 className="mx-auto h-16 w-16 text-success" />
      <h1 className="mt-5 text-3xl font-bold text-secondary">Order Placed Successfully!</h1>
      <p className="mt-3 text-secondary/60">Order number: #{orderNumber || orderId || "Order placed"}</p>
      <p className="mt-2 text-secondary/60">Estimated delivery: Thu, 3 Oct</p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link href={`/orders/${orderId}`}>
          <AppButton>Track Order</AppButton>
        </Link>
        <Link href="/">
          <AppButton variant="outline">Continue Shopping</AppButton>
        </Link>
      </div>
    </div>
  );
}
