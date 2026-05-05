import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { ReturnRequest } from "@/types/return.types";

export function ReturnDetail({ itemReturn }: { itemReturn: ReturnRequest }) {
  const flow = ["requested", "approved", "pickup_scheduled", "picked", "refunded"];
  const currentIndex = flow.indexOf(itemReturn.status);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold">Return {itemReturn.id}</h1>
        <StatusBadge status={itemReturn.status} />
      </div>
      <Card>
        <CardHeader><CardTitle>Return Request</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <p><span className="font-medium">Reason:</span> {itemReturn.reason.replace(/_/g, " ")}</p>
          <p className="text-slate-600">{itemReturn.description}</p>
          <p className="text-sm text-slate-500">Requested on {formatDate(itemReturn.createdAt, "dd MMM yyyy, hh:mm a")}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Uploaded Photos</CardTitle></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {itemReturn.photos.map((photo) => (
            <div key={photo} className="relative h-44 overflow-hidden rounded-2xl bg-slate-100">
              <Image src={photo} alt="Return upload" fill className="object-cover" />
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Original Item</CardTitle></CardHeader>
        <CardContent>
          <p className="font-medium">{itemReturn.OrderItem?.productName}</p>
          <p className="text-sm text-slate-500">{itemReturn.OrderItem?.variantDetails.size} / {itemReturn.OrderItem?.variantDetails.color}</p>
          <p className="mt-2 font-semibold">{formatCurrency(itemReturn.refundAmount ?? 0)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Status Timeline</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {flow.map((step, index) => (
            <div key={step} className="flex items-center gap-3">
              <div className={`h-4 w-4 rounded-full ${index < currentIndex ? "bg-green-500" : index === currentIndex ? "animate-pulse bg-coral" : "bg-slate-200"}`} />
              <div>
                <p className="capitalize">{step.replace(/_/g, " ")}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
