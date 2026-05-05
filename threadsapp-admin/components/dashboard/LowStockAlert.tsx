import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LowStockAlert({
  items,
}: {
  items: Array<{ id: string; quantity: number; lowStockThreshold: number; ProductVariant?: { color: string; size: string; sku: string } }>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Low Stock Alerts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => (
          <Link key={item.id} href="/products" className="flex items-center justify-between rounded-xl border border-border p-3 hover:bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-red-100 p-2 text-red-600">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium text-slate-900">{item.ProductVariant?.size} / {item.ProductVariant?.color}</p>
                <p className="text-sm text-slate-500">{item.ProductVariant?.sku}</p>
              </div>
            </div>
            <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">{item.quantity} left</span>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
