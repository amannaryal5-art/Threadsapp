"use client";

import { useState } from "react";
import { OrderCard } from "@/components/orders/OrderCard";
import { Pagination } from "@/components/shared/Pagination";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { useOrders } from "@/hooks/useOrders";

const tabs = ["all", "active", "delivered", "cancelled", "returns"] as const;

export default function OrdersPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("all");
  const { data } = useOrders(tab === "all" ? undefined : tab === "active" ? "shipped" : tab);
  const orders = data?.data.orders ?? [];

  return (
    <main className="container py-8">
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <ProfileSidebar />
        <div>
          <div className="mb-6 flex flex-wrap gap-2">
            {tabs.map((item) => (
              <button key={item} onClick={() => setTab(item)} className={`rounded-full px-4 py-2 text-sm font-semibold ${tab === item ? "bg-primary text-white" : "bg-white text-secondary shadow-soft"}`}>
                {item.replaceAll("_", " ")}
              </button>
            ))}
          </div>
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
          <div className="mt-6">
            <Pagination currentPage={data?.meta?.page ?? 1} totalPages={data?.meta?.totalPages ?? 1} createHref={(page) => `/orders?page=${page}`} />
          </div>
        </div>
      </div>
    </main>
  );
}
