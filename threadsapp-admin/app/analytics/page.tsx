"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { RevenueAreaChart } from "@/components/analytics/RevenueAreaChart";
import { OrdersByStatusPie } from "@/components/analytics/OrdersByStatusPie";
import { TopProductsBar } from "@/components/analytics/TopProductsBar";
import { SalesByCategory } from "@/components/analytics/SalesByCategory";
import { useDashboardStats, useOrdersByStatusAnalytics, useRevenueAnalytics, useTopCategoriesAnalytics, useTopProductsAnalytics } from "@/hooks/useAnalytics";
import { formatCurrency } from "@/lib/utils";

const ranges = ["Today", "7 days", "30 days", "90 days", "Custom"] as const;

export default function AnalyticsPage() {
  const [range, setRange] = useState<(typeof ranges)[number]>("30 days");
  const { data: stats } = useDashboardStats();
  const { data: revenue = [] } = useRevenueAnalytics();
  const { data: statuses = [] } = useOrdersByStatusAnalytics();
  const { data: topProducts = [] } = useTopProductsAnalytics();
  const { data: categories = [] } = useTopCategoriesAnalytics();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Dive deeper into revenue, product, category, and user performance."
        action={<div className="flex gap-2">{ranges.map((item) => <Button key={item} variant={range === item ? "default" : "secondary"} onClick={() => setRange(item)}>{item}</Button>)}</div>}
      />
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-border bg-white p-5 shadow-soft"><p className="text-sm text-slate-500">Total Revenue</p><p className="text-2xl font-semibold">{formatCurrency(stats?.todayRevenue ?? 0)}</p></div>
        <div className="rounded-2xl border border-border bg-white p-5 shadow-soft"><p className="text-sm text-slate-500">Average Order Value</p><p className="text-2xl font-semibold">{formatCurrency((stats?.todayRevenue ?? 0) / Math.max(stats?.todayOrders ?? 1, 1))}</p></div>
        <div className="rounded-2xl border border-border bg-white p-5 shadow-soft"><p className="text-sm text-slate-500">Total Orders</p><p className="text-2xl font-semibold">{stats?.todayOrders ?? 0}</p></div>
        <div className="rounded-2xl border border-border bg-white p-5 shadow-soft"><p className="text-sm text-slate-500">Conversion Rate</p><p className="text-2xl font-semibold">4.8%</p></div>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <RevenueAreaChart data={revenue} />
        <OrdersByStatusPie data={statuses} />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <TopProductsBar data={topProducts.slice(0, 10)} />
        <SalesByCategory data={categories} />
      </div>
    </div>
  );
}
