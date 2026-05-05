"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StatusBreakdown } from "@/types/analytics.types";

const colors = ["#64748B", "#2563EB", "#F59E0B", "#8B5CF6", "#F97316", "#16A34A", "#DC2626", "#EC4899", "#14B8A6"];

export function OrdersChart({ data }: { data: StatusBreakdown[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders by Status</CardTitle>
      </CardHeader>
      <CardContent className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="count" nameKey="status" innerRadius={72} outerRadius={108}>
              {data.map((entry, index) => (
                <Cell key={entry.status} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
