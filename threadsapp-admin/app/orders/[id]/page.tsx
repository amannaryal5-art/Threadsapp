"use client";

import { useParams } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { ShippingModal } from "@/components/orders/ShippingModal";
import { OrderDetail } from "@/components/orders/OrderDetail";
import { useOrder, useShipOrder, useUpdateOrderStatus } from "@/hooks/useOrders";
import { useState } from "react";

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const { data: order } = useOrder(params.id);
  const updateStatus = useUpdateOrderStatus();
  const shipOrder = useShipOrder();
  const [nextStatus, setNextStatus] = useState("processing");

  if (!order) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Order Detail"
        description="Inspect the order, update status, and manage shipping."
        action={
          <div className="flex flex-wrap gap-3">
            <Select value={nextStatus} onValueChange={setNextStatus}>
              <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => updateStatus.mutate({ id: order.id, status: nextStatus })}>Update Status</Button>
            <ShippingModal onConfirm={() => shipOrder.mutate(order.id)} />
            <ConfirmDialog trigger={<Button variant="destructive">Cancel Order</Button>} title="Cancel order?" description="This action cannot be undone." onConfirm={() => updateStatus.mutate({ id: order.id, status: "cancelled" })} />
            {order.invoiceUrl ? <Button variant="secondary" asChild><a href={order.invoiceUrl} target="_blank">Download Invoice</a></Button> : null}
          </div>
        }
      />
      <OrderDetail order={order} />
    </div>
  );
}
