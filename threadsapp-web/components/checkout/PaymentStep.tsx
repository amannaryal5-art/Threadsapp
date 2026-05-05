"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { PAYMENT_METHODS } from "@/lib/constants";
import { launchRazorpayCheckout } from "@/lib/razorpay";
import { AppButton } from "@/components/shared/AppButton";
import { AppInput } from "@/components/shared/AppInput";
import api from "@/lib/axios";
import { useCartStore } from "@/store/cartStore";
import type { ApiResponse } from "@/types/api.types";
import type { CartItem } from "@/types/cart.types";
import type { Order } from "@/types/order.types";
import type { User } from "@/types/user.types";

export function PaymentStep({
  addressId,
  items,
  couponCode,
  totalAmount,
  user,
}: {
  addressId: string;
  items: CartItem[];
  couponCode?: string;
  totalAmount: number;
  user?: User | null;
}) {
  const [method, setMethod] = useState<(typeof PAYMENT_METHODS)[number]["id"]>("upi");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const clearCart = useCartStore((state) => state.clearCart);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-5">
        <h2 className="text-2xl font-semibold text-secondary">Payment</h2>
        <div className="space-y-3 rounded-[32px] bg-white p-5 shadow-soft">
          {PAYMENT_METHODS.map((item) => (
            <label key={item.id} className="flex items-center gap-3 rounded-2xl border border-secondary/10 px-4 py-3">
              <input type="radio" checked={method === item.id} onChange={() => setMethod(item.id)} />
              <span>{item.label}</span>
            </label>
          ))}
          {method === "upi" ? <AppInput label="UPI ID" placeholder="name@upi" /> : null}
          {method === "card" ? (
            <div className="grid gap-3 md:grid-cols-3">
              <AppInput label="Card Number" placeholder="1234 5678 9012 3456" className="md:col-span-3" />
              <AppInput label="Expiry" placeholder="MM/YY" />
              <AppInput label="CVV" placeholder="123" />
              <AppInput label="Name on Card" placeholder="Aarav Singh" />
            </div>
          ) : null}
        </div>
      </div>
      <div className="rounded-[32px] bg-white p-6 shadow-soft">
        <h3 className="text-lg font-semibold text-secondary">Order Summary</h3>
        <p className="mt-3 text-sm text-secondary/55">Secure payment protected by Razorpay.</p>
        <AppButton
          className="mt-6 w-full"
          isLoading={submitting}
          disabled={!items.length}
          onClick={async () => {
            try {
              setSubmitting(true);

              const response = await api.post<ApiResponse<{ order: Order }>>("/orders", {
                addressId,
                items: items.map((item) => ({
                  productId: item.productId,
                  variantId: item.variantId,
                  quantity: item.quantity,
                })),
                couponCode: couponCode || null,
                paymentMethod: method,
              });

              const order = response.data.data.order;

              if (method === "cod") {
                await api.post(`/payments/${order.id}/cod`);
                await clearCart();
                router.push(`/checkout/success?orderId=${order.id}&orderNumber=${encodeURIComponent(order.orderNumber)}`);
                return;
              }

              await launchRazorpayCheckout({
                orderId: order.id,
                totalAmount,
                email: user?.email,
                contact: user?.phone,
                onSuccess: async (id) => {
                  await clearCart();
                  router.push(`/checkout/success?orderId=${id}&orderNumber=${encodeURIComponent(order.orderNumber)}`);
                },
                onFailure: () => toast.error("Payment interrupted. Please retry."),
              });
            } catch {
              toast.error("Payment failed. Please retry.");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          Pay Rs.{totalAmount.toLocaleString("en-IN")}
        </AppButton>
      </div>
    </div>
  );
}
