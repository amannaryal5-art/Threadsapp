"use client";

import { useState } from "react";
import { AppButton } from "@/components/shared/AppButton";
import { AppInput } from "@/components/shared/AppInput";

export function CouponInput({
  onApply
}: {
  onApply: (couponCode: string) => Promise<{ couponCode: string; savedAmount: number }>;
}) {
  const [coupon, setCoupon] = useState("");
  const [message, setMessage] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);

  return (
    <div className="rounded-[28px] bg-white p-5 shadow-soft">
      <div className="flex flex-col gap-3 md:flex-row">
        <AppInput value={coupon} onChange={(event) => setCoupon(event.target.value)} placeholder="Enter coupon code" />
        <AppButton
          onClick={async () => {
            if (coupon.toUpperCase() === "FIRST20") {
              const result = await onApply(coupon);
              setMessage(`${result.couponCode.toUpperCase()} — ₹${result.savedAmount} saved!`);
              setIsValid(true);
            } else {
              setMessage("Invalid coupon code");
              setIsValid(false);
            }
          }}
        >
          Apply
        </AppButton>
      </div>
      {message ? (
        <p className={`mt-3 inline-flex rounded-full px-3 py-1 text-sm ${isValid ? "bg-success/10 text-success" : "bg-error/10 text-error"}`}>
          {message}
        </p>
      ) : null}
    </div>
  );
}
