import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Order } from "@/types/order.types";
import { OrderTimeline } from "@/components/orders/OrderTimeline";
import { ImagePreview } from "@/components/shared/ImagePreview";

export function OrderDetail({ order }: { order: Order }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold">{order.orderNumber}</h1>
        <StatusBadge status={order.status} />
        <StatusBadge status={order.paymentStatus} />
        <span className="text-sm text-slate-500">{formatDate(order.createdAt, "dd MMM yyyy, hh:mm a")}</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <Card><CardHeader><CardTitle>Customer</CardTitle></CardHeader><CardContent><p>{order.User?.name}</p><p className="text-sm text-slate-500">{order.User?.phone}</p><p className="text-sm text-slate-500">{order.User?.email}</p></CardContent></Card>
        <Card><CardHeader><CardTitle>Delivery Address</CardTitle></CardHeader><CardContent><p>{order.Address?.fullName}</p><p className="text-sm text-slate-500">{order.Address?.flatNo} {order.Address?.building} {order.Address?.street}</p><p className="text-sm text-slate-500">{order.Address?.city}, {order.Address?.state} {order.Address?.pincode}</p></CardContent></Card>
        <Card><CardHeader><CardTitle>Payment</CardTitle></CardHeader><CardContent><p>{order.payment?.method ?? "N/A"}</p><p className="text-sm text-slate-500">{order.payment?.razorpayPaymentId ?? "No Razorpay ID"}</p><p className="font-semibold">{formatCurrency(order.payment?.amount ?? order.totalAmount)}</p></CardContent></Card>
        <Card><CardHeader><CardTitle>Shipping</CardTitle></CardHeader><CardContent><p>{order.courierName ?? "Not assigned"}</p><p className="text-sm text-slate-500">{order.trackingNumber ?? "AWB pending"}</p>{order.trackingUrl ? <a className="text-sm text-coral" href={order.trackingUrl} target="_blank">Track package</a> : null}</CardContent></Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        <Card>
          <CardHeader><CardTitle>Order Items</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {order.items?.map((item) => (
              <div key={item.id} className="grid grid-cols-[64px_1fr_auto] gap-4 rounded-2xl border border-border p-4">
                <ImagePreview src={item.productImage} alt={item.productName} className="h-16 w-16" />
                <div>
                  <p className="font-medium">{item.productName}</p>
                  <p className="text-sm text-slate-500">{item.variantDetails.size} / {item.variantDetails.color}</p>
                  <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold">{formatCurrency(item.totalPrice)}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span></div>
              <div className="flex justify-between"><span>Coupon Discount</span><span>- {formatCurrency(order.couponDiscount)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{formatCurrency(order.shippingCharge)}</span></div>
              <div className="flex justify-between"><span>GST</span><span>{formatCurrency(order.taxAmount)}</span></div>
              <div className="flex justify-between border-t border-border pt-3 text-base font-semibold"><span>Total</span><span>{formatCurrency(order.totalAmount)}</span></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Status Timeline</CardTitle></CardHeader>
            <CardContent><OrderTimeline status={order.status} /></CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
