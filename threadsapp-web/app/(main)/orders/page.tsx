"use client";

import { useEffect, useRef, useState } from "react";
import { OrderCard } from "@/components/orders/OrderCard";
import { Pagination } from "@/components/shared/Pagination";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { useOrders, useSyncPayment } from "@/hooks/useOrders";

const tabs = ["all", "active", "delivered", "cancelled", "returns"] as const;

export default function OrdersPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("all");
  const { data } = useOrders(tab === "all" ? undefined : tab === "active" ? "shipped" : tab);
  const syncPayment = useSyncPayment();
  const syncedOrdersRef = useRef<Set<string>>(new Set());
  const orders = data?.data.orders ?? [];

  useEffect(() => {
    const pendingOrders = orders.filter((order) => order.status === "pending_payment" || order.paymentStatus === "pending");

    pendingOrders.forEach((order) => {
      if (syncedOrdersRef.current.has(order.id) || syncPayment.isPending) return;
      syncedOrdersRef.current.add(order.id);
      syncPayment.mutate(order.id, {
        onError: () => {
          syncedOrdersRef.current.delete(order.id);
        },
      });
    });
  }, [orders, syncPayment]);

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
