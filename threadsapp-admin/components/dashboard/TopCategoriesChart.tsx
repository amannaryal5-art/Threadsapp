"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TopCategoriesChart({ data }: { data: Array<{ name: string; productCount: string | number }> }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Categories</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="productCount" nameKey="name" outerRadius={100}>
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={["#FF6B6B", "#2563EB", "#14B8A6", "#F59E0B", "#8B5CF6"][index % 5]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
