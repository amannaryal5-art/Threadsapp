"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { OrderTimeline } from "@/components/orders/OrderTimeline";
import { ReturnModal } from "@/components/orders/ReturnModal";
import { TrackingView } from "@/components/orders/TrackingView";
import { AppButton } from "@/components/shared/AppButton";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useOrder, useTrackOrder } from "@/hooks/useOrders";

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const { data: order } = useOrder(params.id);
  const { data: tracking } = useTrackOrder(params.id);

  if (!order) return null;

  return (
    <main className="container py-8">
      <Link href="/orders" className="mb-6 inline-flex items-center gap-2 text-sm text-secondary/60">
        <ChevronLeft className="h-4 w-4" />
        Back to orders
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary">{order.orderNumber}</h1>
          <p className="mt-2 text-sm text-secondary/60">{formatDate(order.createdAt, "d MMM yyyy")}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>
      <div className="mt-8 space-y-8">
        <OrderTimeline currentStatus={order.status} />
        <TrackingView tracking={tracking?.tracking ?? null} />
        <div className="rounded-[32px] bg-white p-6 shadow-soft">
          <h2 className="text-xl font-semibold text-secondary">Order Items</h2>
          <div className="mt-4 space-y-4">
            {(order.items ?? []).map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b border-secondary/10 pb-4 last:border-b-0">
                <div>
                  <p className="font-medium text-secondary">{item.productName}</p>
                  <p className="text-sm text-secondary/50">{item.variantDetails.size} | {item.variantDetails.color} | Qty {item.quantity}</p>
                </div>
                <span className="font-semibold text-primary">{formatCurrency(item.totalPrice)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="rounded-[32px] bg-white p-6 shadow-soft">
            <h3 className="font-semibold text-secondary">Delivery Address</h3>
            <p className="mt-3 text-sm text-secondary/60">{order.Address?.fullName}</p>
            <p className="mt-2 text-sm text-secondary/60">{order.Address?.city}, {order.Address?.state} {order.Address?.pincode}</p>
          </div>
          <div className="rounded-[32px] bg-white p-6 shadow-soft">
            <h3 className="font-semibold text-secondary">Payment</h3>
            <p className="mt-3 text-sm text-secondary/60">{order.payment?.method ?? "Razorpay"}</p>
            <p className="mt-2 text-sm text-secondary/60">{order.payment?.razorpayPaymentId ?? "TXN pending"}</p>
          </div>
          <div className="rounded-[32px] bg-white p-6 shadow-soft">
            <h3 className="font-semibold text-secondary">Price Breakdown</h3>
            <p className="mt-3 text-sm text-secondary/60">Total: {formatCurrency(order.totalAmount)}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          {order.status !== "shipped" && order.status !== "out_for_delivery" && order.status !== "delivered" ? <AppButton variant="outline">Cancel</AppButton> : null}
          {order.invoiceUrl ? <Link href={order.invoiceUrl}><AppButton variant="outline">Download Invoice</AppButton></Link> : null}
          {order.status === "delivered" ? <ReturnModal orderId={order.id} items={order.items ?? []} /> : null}
          {order.status === "delivered" ? <AppButton>Rate & Review</AppButton> : null}
        </div>
      </div>
    </main>
  );
}
