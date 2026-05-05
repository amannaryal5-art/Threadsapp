"use client";

import { useState } from "react";
import { useRequestReturn } from "@/hooks/useOrders";
import { AppButton } from "@/components/shared/AppButton";
import type { OrderItem } from "@/types/order.types";

export function ReturnModal({ orderId, items }: { orderId: string; items: OrderItem[] }) {
  const [open, setOpen] = useState(false);
  const [orderItemId, setOrderItemId] = useState(items[0]?.id ?? "");
  const [reason, setReason] = useState("wrong_size");
  const [description, setDescription] = useState("");
  const mutation = useRequestReturn();

  return (
    <>
      <AppButton variant="outline" onClick={() => setOpen(true)}>
        Return Item
      </AppButton>
      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-secondary/40 p-4">
          <div className="w-full max-w-xl rounded-[32px] bg-white p-6">
            <h3 className="text-xl font-semibold text-secondary">Request Return</h3>
            <div className="mt-5 grid gap-4">
              <label className="text-sm font-medium">
                Item
                <select className="mt-2 w-full rounded-2xl border border-secondary/10 px-4 py-3" value={orderItemId} onChange={(event) => setOrderItemId(event.target.value)}>
                  {items.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.productName}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-medium">
                Reason
                <select className="mt-2 w-full rounded-2xl border border-secondary/10 px-4 py-3" value={reason} onChange={(event) => setReason(event.target.value)}>
                  {["wrong_size", "wrong_item", "damaged", "not_as_described", "changed_mind"].map((item) => (
                    <option key={item} value={item}>
                      {item.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-medium">
                Description
                <textarea className="mt-2 min-h-28 w-full rounded-2xl border border-secondary/10 px-4 py-3" value={description} onChange={(event) => setDescription(event.target.value)} />
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <AppButton variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </AppButton>
              <AppButton
                isLoading={mutation.isPending}
                onClick={() =>
                  mutation.mutate(
                    { orderId, payload: { orderItemId, reason, description, photos: [] } },
                    { onSuccess: () => setOpen(false) }
                  )
                }
              >
                Submit
              </AppButton>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
