"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TopProduct } from "@/types/analytics.types";

export function TopProductsTable({ data }: { data: TopProduct[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Selling Products</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" width={130} />
            <Tooltip />
            <Bar dataKey="totalSold" fill="#FF6B6B" radius={[8, 8, 8, 8]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
