"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { OtpInput } from "@/components/auth/OtpInput";
import { AppButton } from "@/components/shared/AppButton";
import { useVerifyOtp } from "@/hooks/useAuth";

export default function OtpPage() {
  const [otp, setOtp] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const verifyOtp = useVerifyOtp();
  const phone = searchParams.get("phone") ?? "";

  return (
    <div className="w-full max-w-lg rounded-[36px] bg-white p-8 shadow-card">
      <h1 className="text-3xl font-bold text-secondary">Verify OTP</h1>
      <p className="mt-2 text-secondary/60">Enter the 6-digit code sent to {phone}.</p>
      <div className="mt-6">
        <OtpInput value={otp} onChange={setOtp} />
      </div>
      <AppButton
        className="mt-6"
        isLoading={verifyOtp.isPending}
        onClick={() => verifyOtp.mutate({ phone, otp }, { onSuccess: () => router.push("/register") })}
      >
        Verify
      </AppButton>
    </div>
  );
}
