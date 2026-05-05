import { ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StatsCard({
  title,
  value,
  trend,
  action,
}: {
  title: string;
  value: string;
  trend: string;
  action?: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-slate-500">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-end justify-between">
        <div>
          <p className="text-3xl font-semibold text-slate-900">{value}</p>
          <p className="mt-2 inline-flex items-center gap-1 text-xs text-green-600">
            <ArrowUpRight className="h-3 w-3" />
            {trend}
          </p>
        </div>
        {action}
      </CardContent>
    </Card>
  );
}
