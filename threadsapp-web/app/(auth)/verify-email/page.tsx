"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, BadgeCheck, Clock3, Mail, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { AuthShell } from "@/components/auth/AuthShell";
import { OtpInput } from "@/components/auth/OtpInput";
import { AppButton } from "@/components/shared/AppButton";
import { useRegister, useSendEmailOtp } from "@/hooks/useAuth";

interface PendingRegistration {
  name: string;
  email: string;
  phone: string;
  password: string;
  gender: "male" | "female" | "other" | "prefer_not_to_say";
}

const pendingRegistrationKey = "threadsapp-pending-registration";

export default function VerifyEmailPage() {
  const [otp, setOtp] = useState("");
  const [pendingRegistration, setPendingRegistration] = useState<PendingRegistration | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const registerUser = useRegister();
  const sendEmailOtp = useSendEmailOtp();
  const email = searchParams.get("email") ?? "";

  useEffect(() => {
    const rawValue = window.sessionStorage.getItem(pendingRegistrationKey);
    if (!rawValue) {
      router.replace("/register");
      return;
    }

    const parsedValue = JSON.parse(rawValue) as PendingRegistration;
    if (!parsedValue.email || parsedValue.email !== email) {
      router.replace("/register");
      return;
    }

    setPendingRegistration(parsedValue);
  }, [email, router]);

  const handleRegister = () => {
    if (!pendingRegistration) return;
    registerUser.mutate(
      { ...pendingRegistration, emailOtp: otp },
      {
        onSuccess: () => {
          window.sessionStorage.removeItem(pendingRegistrationKey);
          toast.success("Account created successfully");
          router.push("/");
        }
      }
    );
  };

  const handleResend = () => {
    if (!pendingRegistration) return;
    sendEmailOtp.mutate(
      { email: pendingRegistration.email, name: pendingRegistration.name },
      {
        onSuccess: (data) => {
          toast.success(
            data.previewOtp
              ? `Email not configured locally. Use OTP ${data.previewOtp}`
              : `OTP resent to ${pendingRegistration.email}`
          );
        }
      }
    );
  };

  return (
    <div className="w-full">
      <AuthShell
        eyebrow="Email Verification"
        title="One last step before your account goes live."
        description="Use the one-time code from your inbox to finish creating your ThreadsApp account securely."
        alternateHref="/register"
        alternateLabel="Edit details"
        alternateText="Entered the wrong email?"
      >
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Verify your inbox</span>
          <h2 className="mt-3 text-3xl font-bold text-secondary">Confirm your email address</h2>
          <p className="mt-2 text-sm leading-6 text-secondary/60">
            Enter the 6-digit verification code sent to <span className="font-semibold text-secondary">{email || "your email"}</span>.
          </p>
        </div>

        <div className="mt-6 grid gap-3 rounded-[28px] border border-secondary/8 bg-secondary/[0.03] p-4">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary/12 text-primary">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-secondary">Check your inbox</p>
              <p className="text-xs leading-5 text-secondary/60">
                We just sent a code to your email. It expires in about 10 minutes.
              </p>
            </div>
          </div>
          <div className="grid gap-2 text-xs text-secondary/65 sm:grid-cols-2">
            <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2">
              <Clock3 className="h-4 w-4 text-primary" />
              Expires in 10 minutes
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2">
              <BadgeCheck className="h-4 w-4 text-primary" />
              Account activates after OTP
            </div>
          </div>
        </div>

        <div className="mt-8">
          <OtpInput value={otp} onChange={setOtp} />
        </div>

        <div className="mt-4 rounded-[24px] border border-primary/10 bg-primary/[0.05] px-4 py-3 text-xs leading-6 text-secondary/70">
          Did not receive the email? Check spam first, then resend a fresh OTP below.
        </div>

        <AppButton
          className="mt-6 w-full py-3.5"
          isLoading={registerUser.isPending}
          onClick={handleRegister}
          disabled={!pendingRegistration || otp.length !== 6}
        >
          Verify and create account
        </AppButton>

        <AppButton
          className="mt-3 w-full py-3.5"
          variant="outline"
          isLoading={sendEmailOtp.isPending}
          onClick={handleResend}
          disabled={!pendingRegistration}
        >
          <RefreshCw className="h-4 w-4" />
          Resend OTP
        </AppButton>

        <Link href="/register" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-secondary/60 transition hover:text-primary">
          <ArrowLeft className="h-4 w-4" />
          Back to account details
        </Link>
      </AuthShell>
    </div>
  );
}
