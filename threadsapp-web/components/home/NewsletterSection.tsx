"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { AppButton } from "@/components/shared/AppButton";
import { AppInput } from "@/components/shared/AppInput";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  return (
    <section className="rounded-[36px] bg-secondary p-8 text-white md:p-12">
      <h2 className="text-3xl font-bold">Get 10% off your first order</h2>
      <p className="mt-3 max-w-xl text-white/70">Fresh drops, sale alerts, and style notes straight to your inbox.</p>
      <div className="mt-6 flex flex-col gap-3 md:flex-row">
        <AppInput
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter your email"
          className="border-white/10 bg-white/5 text-white placeholder:text-white/40 md:max-w-md"
        />
        <AppButton
          onClick={() => {
            setEmail("");
            toast.success("Subscribed successfully");
          }}
        >
          Subscribe
        </AppButton>
      </div>
      <p className="mt-3 text-xs text-white/50">By subscribing, you agree to receive product updates and promo emails.</p>
    </section>
  );
}
