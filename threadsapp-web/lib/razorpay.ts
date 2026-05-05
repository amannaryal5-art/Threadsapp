"use client";

import api from "@/lib/axios";
import { APP_NAME, RAZORPAY_KEY } from "@/lib/constants";
import type { Address } from "@/types/user.types";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
    };
  }
}

interface LaunchCheckoutParams {
  orderId: string;
  totalAmount: number;
  email?: string | null;
  contact?: string | null;
  onSuccess: (orderId: string) => void;
  onFailure?: () => void;
}

export async function loadRazorpayScript() {
  if (window.Razorpay) return true;
  return new Promise<boolean>((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function createPaymentOrder(payload: {
  amount: number;
  currency?: string;
  receipt: string;
}) {
  const response = await api.post("/payments/create-order", payload);
  return response.data.data.razorpayOrder;
}

export async function launchRazorpayCheckout({
  orderId,
  totalAmount,
  email,
  contact,
  onSuccess,
  onFailure
}: LaunchCheckoutParams) {
  const isReady = await loadRazorpayScript();
  if (!isReady || !window.Razorpay) {
    onFailure?.();
    return;
  }

  const razorpayOrder = await createPaymentOrder({
    amount: totalAmount,
    currency: "INR",
    receipt: orderId
  });

  const checkout = new window.Razorpay({
    key: RAZORPAY_KEY,
    amount: totalAmount * 100,
    currency: "INR",
    name: APP_NAME,
    order_id: razorpayOrder.id,
    prefill: { email, contact },
    theme: { color: "#FF6B6B" },
    handler: async (response: Record<string, string>) => {
      await api.post("/payments/verify", {
        orderId,
        razorpayOrderId: response.razorpay_order_id,
        razorpayPaymentId: response.razorpay_payment_id,
        razorpaySignature: response.razorpay_signature,
        method: "razorpay"
      });
      onSuccess(orderId);
    },
    modal: {
      ondismiss: onFailure
    }
  });

  checkout.open();
}
