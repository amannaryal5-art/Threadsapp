"use client";

import { useState } from "react";
import { AppButton } from "@/components/shared/AppButton";
import { AppInput } from "@/components/shared/AppInput";

export function DeliveryChecker() {
  const [result, setResult] = useState("");
  const [pincode, setPincode] = useState("");

  return (
    <div className="rounded-[28px] border border-secondary/10 p-5">
      <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary/40">Delivery</h3>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <AppInput value={pincode} onChange={(event) => setPincode(event.target.value)} placeholder="Enter pincode" />
        <AppButton onClick={() => setResult("Delivered by Thu, 3 Oct — FREE Delivery")}>Check</AppButton>
      </div>
      {result ? <p className="mt-3 text-sm font-medium text-success">{result}</p> : null}
    </div>
  );
}
