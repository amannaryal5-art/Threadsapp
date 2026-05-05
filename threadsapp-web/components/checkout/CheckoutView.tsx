"use client";

import { useState } from "react";
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
            onContinue={() => setStep(3)}
            onApplyCoupon={async (couponCode) => ({ couponCode, savedAmount: 260 })}
          />
        ) : null}
        {step === 3 && selectedAddressId ? (
          <PaymentStep
            addressId={selectedAddressId}
            items={cart.items}
            couponCode={cart.couponCode}
            totalAmount={Math.round(cart.subtotal + cart.taxAmount + cart.shippingCharge - cart.couponDiscount)}
            user={user}
          />
        ) : null}
      </div>
    </main>
  );
}
