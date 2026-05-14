"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, BadgeCheck, Clock3, Mail, RefreshCw, ShieldCheck, Sparkles } from "lucide-react";
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
          if (data.emailDelivered === false) {
            toast.success("OTP regenerated. Check backend terminal because local email delivery is unavailable.");
          } else {
            toast.success(`OTP resent to ${pendingRegistration.email}`);
          }
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
          <h2 className="mt-3 text-3xl font-bold leading-tight text-secondary sm:text-[2.15rem]">Confirm your email address</h2>
          <p className="mt-3 text-sm leading-6 text-secondary/60">
            Enter the 6-digit verification code sent to{" "}
            <span className="inline-flex rounded-full bg-secondary/[0.06] px-3 py-1 font-semibold text-secondary">
              {email || "your email"}
            </span>
            .
          </p>
        </div>

        <div className="mt-7 overflow-hidden rounded-[30px] border border-secondary/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,248,250,0.92))] shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
          <div className="border-b border-secondary/8 px-5 py-4 sm:px-6">
            <div className="flex items-start gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary/12 text-primary">
                <Mail className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-secondary">Check your inbox</p>
                <p className="mt-1 text-sm leading-6 text-secondary/60">
                  We sent a verification code to your email. Keep this tab open while you grab it.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 px-5 py-4 text-sm text-secondary/72 sm:grid-cols-3 sm:px-6">
            <div className="rounded-2xl border border-secondary/8 bg-white px-4 py-3 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
              <div className="flex items-center gap-2 text-secondary/85">
                <Clock3 className="h-4 w-4 text-primary" />
                <span className="font-medium">Expires soon</span>
              </div>
              <p className="mt-1 text-xs leading-5 text-secondary/55">Use the code within 10 minutes.</p>
            </div>

            <div className="rounded-2xl border border-secondary/8 bg-white px-4 py-3 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
              <div className="flex items-center gap-2 text-secondary/85">
                <BadgeCheck className="h-4 w-4 text-primary" />
                <span className="font-medium">Activates account</span>
              </div>
              <p className="mt-1 text-xs leading-5 text-secondary/55">Your profile goes live after verification.</p>
            </div>

            <div className="rounded-2xl border border-secondary/8 bg-white px-4 py-3 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
              <div className="flex items-center gap-2 text-secondary/85">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span className="font-medium">Safe signup</span>
              </div>
              <p className="mt-1 text-xs leading-5 text-secondary/55">We verify ownership before creating access.</p>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-[28px] border border-secondary/8 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)] sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-secondary">Enter your verification code</p>
              <p className="mt-1 text-xs leading-5 text-secondary/55">Type the 6 digits exactly as they appear in the email.</p>
            </div>
            <div className="hidden rounded-full bg-primary/[0.06] px-3 py-1 text-xs font-semibold text-primary sm:inline-flex">
              6-digit OTP
            </div>
          </div>

          <div className="mt-5">
            <OtpInput value={otp} onChange={setOtp} />
          </div>

          <div className="mt-4 flex items-start gap-3 rounded-[22px] border border-primary/10 bg-primary/[0.05] px-4 py-3 text-xs leading-6 text-secondary/70">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p>Did not receive the email? Check spam first, then resend a fresh OTP below.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
          <AppButton
            className="w-full py-3.5"
            isLoading={registerUser.isPending}
            onClick={handleRegister}
            disabled={!pendingRegistration || otp.length !== 6}
          >
            Verify and create account
          </AppButton>

          <AppButton
            className="w-full px-5 py-3.5 sm:w-auto"
            variant="outline"
            isLoading={sendEmailOtp.isPending}
            onClick={handleResend}
            disabled={!pendingRegistration}
          >
            <RefreshCw className="h-4 w-4" />
            Resend OTP
          </AppButton>
        </div>

        <Link
          href="/register"
          className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-secondary/60 transition hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to account details
        </Link>
      </AuthShell>
    </div>
  );
}
