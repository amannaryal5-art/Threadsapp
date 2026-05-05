"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { OrdersChart } from "@/components/dashboard/OrdersChart";
import { RecentOrdersTable } from "@/components/dashboard/RecentOrdersTable";
import { LowStockAlert } from "@/components/dashboard/LowStockAlert";
import { TopProductsTable } from "@/components/dashboard/TopProductsTable";
import { TopCategoriesChart } from "@/components/dashboard/TopCategoriesChart";
import { useDashboardStats, useOrdersByStatusAnalytics, useRevenueAnalytics, useTopCategoriesAnalytics, useTopProductsAnalytics } from "@/hooks/useAnalytics";
import { useOrders } from "@/hooks/useOrders";
import { formatCurrency } from "@/lib/utils";

function DashboardHydrationSkeleton() {
  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Track sales, orders, stock, and customer growth in one place." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="space-y-2 pb-2">
              <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="h-8 w-24 animate-pulse rounded bg-slate-200" />
              <div className="h-3 w-32 animate-pulse rounded bg-slate-100" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />
            </CardHeader>
            <CardContent className="h-[320px]">
              <div className="h-full animate-pulse rounded-xl bg-slate-100" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="h-5 w-36 animate-pulse rounded bg-slate-200" />
            </CardHeader>
            <CardContent className="h-64">
              <div className="h-full animate-pulse rounded-xl bg-slate-100" />
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />
              </CardHeader>
              <CardContent className="h-64">
                <div className="h-full animate-pulse rounded-xl bg-slate-100" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Card>
        <CardHeader>
          <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />
        </CardHeader>
        <CardContent className="h-72">
          <div className="h-full animate-pulse rounded-xl bg-slate-100" />
        </CardContent>
      </Card>
    </div>
  );
}

export default function DashboardOverviewPage() {
  const { status } = useSession();

  if (status === "loading") {
    return <DashboardHydrationSkeleton />;
  }

  if (status !== "authenticated") {
    return null;
  }

  return <DashboardOverviewContent />;
}

function DashboardOverviewContent() {
  const { data: stats } = useDashboardStats();
  const { data: revenue = [] } = useRevenueAnalytics();
  const { data: topProducts = [] } = useTopProductsAnalytics();
  const { data: categories = [] } = useTopCategoriesAnalytics();
  const { data: statusRows = [] } = useOrdersByStatusAnalytics();
  const { data: orders = [] } = useOrders({ limit: 10 });
  const lowStockAlerts = stats?.lowStockAlerts ?? [];

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Track sales, orders, stock, and customer growth in one place." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard title="Total Revenue (Today)" value={formatCurrency(stats?.todayRevenue ?? 0)} trend="+12.4% vs last week" />
        <StatsCard title="Total Orders (Today)" value={String(stats?.todayOrders ?? 0)} trend="+8.1% vs last week" />
        <StatsCard title="New Users (Today)" value={String(stats?.newUsers ?? 0)} trend="+5.6% vs last week" />
        <StatsCard title="Low Stock Items" value={String(lowStockAlerts.length)} trend="-2.3% vs last week" action={<Button asChild size="sm" variant="secondary"><Link href="/products">View</Link></Button>} />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <RevenueChart data={revenue} />
          <TopProductsTable data={topProducts.slice(0, 5)} />
        </div>
        <div className="space-y-6">
          <OrdersChart data={statusRows} />
          <RecentOrdersTable orders={orders.slice(0, 10)} />
          <LowStockAlert items={lowStockAlerts} />
        </div>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <TopCategoriesChart data={categories} />
      </div>
    </div>
  );
}
