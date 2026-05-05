"use client";

import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { useOrders } from "@/hooks/useOrders";

export default function ReturnsPage() {
  const { data } = useOrders("return_requested");
  return (
    <main className="container py-8">
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <ProfileSidebar />
        <div className="rounded-[32px] bg-white p-6 shadow-soft">
          <h1 className="text-3xl font-bold text-secondary">Returns</h1>
          <div className="mt-6 space-y-4">
            {(data?.data.orders ?? []).map((order) => (
              <div key={order.id} className="rounded-2xl border border-secondary/10 p-4">
                <p className="font-semibold text-secondary">{order.orderNumber}</p>
                <p className="mt-2 text-sm text-secondary/60">{order.status.replaceAll("_", " ")}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
