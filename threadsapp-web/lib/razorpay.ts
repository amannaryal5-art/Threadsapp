"use client";

import api from "@/lib/axios";
import { APP_NAME, RAZORPAY_KEY } from "@/lib/constants";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
    };
  }
}

interface LaunchCheckoutParams {
  orderId: string;
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
  orderId: string;
}) {
  const response = await api.post("/payments/create-order", payload);
  return response.data.data.razorpayOrder;
}

export async function launchRazorpayCheckout({
  orderId,
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

  if (!RAZORPAY_KEY) {
    onFailure?.();
    throw new Error("NEXT_PUBLIC_RAZORPAY_KEY is missing");
  }

  const razorpayOrder = await createPaymentOrder({
    orderId
  });

  const checkout = new window.Razorpay({
    key: RAZORPAY_KEY,
    order_id: razorpayOrder.id,
    currency: "INR",
    name: APP_NAME,
    prefill: { email, contact },
    theme: { color: "#FF6B6B" },
    handler: async (response: Record<string, string>) => {
      try {
        await api.post("/payments/verify", {
          orderId,
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
          method: "razorpay"
        });
        onSuccess(orderId);
      } catch (error) {
        console.error("Razorpay verification failed", error);
        onFailure?.();
      }
    },
    modal: {
      ondismiss: async () => {
        try {
          const syncResponse = await api.post(`/payments/${orderId}/sync`);
          if (syncResponse.data?.data?.paymentStatus === "paid") {
            onSuccess(orderId);
            return;
          }
        } catch (error) {
          console.error("Razorpay payment sync after dismiss failed", error);
        }

        onFailure?.();
      }
    }
  });

  checkout.open();
}
