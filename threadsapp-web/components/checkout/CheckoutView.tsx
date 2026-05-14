"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { CheckoutStepper } from "@/components/checkout/CheckoutStepper";
import { AddressStep } from "@/components/checkout/AddressStep";
import { ReviewStep } from "@/components/checkout/ReviewStep";
import { PaymentStep } from "@/components/checkout/PaymentStep";

export function CheckoutView() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedAddressId, setSelectedAddressId] = useState<string>();
  const cart = useCartStore();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!selectedAddressId && step > 1) {
      setStep(1);
    }
  }, [selectedAddressId, step]);

  useEffect(() => {
    if (!cart.items.length && step > 1) {
      setStep(1);
    }
  }, [cart.items.length, step]);

  return (
    <main className="container py-8">
      <div className="space-y-8">
        <CheckoutStepper currentStep={step} />
        {step === 1 ? (
          <AddressStep selectedAddressId={selectedAddressId} onSelectAddress={setSelectedAddressId} onContinue={() => setStep(2)} />
        ) : null}
        {step === 2 ? (
          <ReviewStep
            items={cart.items}
            subtotal={cart.subtotal}
            taxAmount={cart.taxAmount}
            shippingCharge={cart.shippingCharge}
            onContinue={() => {
              if (!selectedAddressId) {
                setStep(1);
                return;
              }
              setStep(3);
            }}
            onApplyCoupon={async (couponCode) => ({ couponCode, savedAmount: 260 })}
          />
        ) : null}
        {step === 3 && selectedAddressId ? (
          <PaymentStep
            addressId={selectedAddressId}
            items={cart.items}
            couponCode={cart.couponCode}
            totalAmount={cart.totalAmount}
            user={user}
          />
        ) : null}
      </div>
    </main>
  );
}
