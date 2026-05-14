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
    <Card className="panel-surface overflow-hidden border-white/80">
      <div className="h-1.5 bg-gradient-to-r from-coral via-[#ff9671] to-[#ffd166]" />
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-slate-500">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-end justify-between">
        <div>
          <p className="text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
          <p className="mt-3 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-green-700">
            <ArrowUpRight className="h-3 w-3" />
            {trend}
          </p>
        </div>
        {action}
      </CardContent>
    </Card>
  );
}
