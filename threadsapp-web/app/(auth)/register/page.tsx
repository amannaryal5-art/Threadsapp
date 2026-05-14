"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Mail, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { AuthShell } from "@/components/auth/AuthShell";
import { SocialButtons } from "@/components/auth/SocialButtons";
import { AppButton } from "@/components/shared/AppButton";
import { AppInput } from "@/components/shared/AppInput";
import { useSendEmailOtp } from "@/hooks/useAuth";
import { registerSchema } from "@/validations/auth.schema";
import type { z } from "zod";

type FormData = z.infer<typeof registerSchema>;

const pendingRegistrationKey = "threadsapp-pending-registration";

export default function RegisterPage() {
  const router = useRouter();
  const sendEmailOtp = useSendEmailOtp();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", phone: "", password: "", gender: "prefer_not_to_say" }
  });

  return (
    <div className="w-full">
      <AuthShell
        eyebrow="New Account"
        title="Create your account and make shopping faster."
        description="Save your favorites, track orders, and move through checkout with fewer steps every time you come back."
        alternateHref="/login"
        alternateLabel="Sign in"
        alternateText="Already have an account?"
      >
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Join ThreadsApp</span>
          <h2 className="mt-3 text-3xl font-bold text-secondary">Create your account</h2>
          <p className="mt-2 text-sm leading-6 text-secondary/60">
            Add your details, confirm your email with a one-time code, and unlock a safer shopping account.
          </p>
        </div>

        <div className="mt-6 grid gap-3 rounded-[28px] border border-secondary/8 bg-secondary/[0.03] p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/12 text-primary">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-secondary">Secure email verification</p>
              <p className="text-xs leading-5 text-secondary/60">We send a 6-digit OTP to your inbox before your account is created.</p>
            </div>
          </div>
          <div className="grid gap-2 text-xs text-secondary/65 sm:grid-cols-3">
            <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Enter details
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2">
              <Mail className="h-4 w-4 text-primary" />
              Receive OTP
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Activate account
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit((values) =>
            sendEmailOtp.mutate(
              { email: values.email, name: values.name },
              {
                onSuccess: (data) => {
                  window.sessionStorage.setItem(pendingRegistrationKey, JSON.stringify(values));
                  if (data.emailDelivered === false) {
                    toast.success("OTP created. Check backend terminal because local email delivery is unavailable.");
                  } else {
                    toast.success(`OTP sent to ${values.email}`);
                  }
                  router.push(`/verify-email?email=${encodeURIComponent(values.email)}`);
                }
              }
            )
          )}
          className="mt-8 grid gap-4"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <AppInput
              label="Full name"
              placeholder="Your name"
              autoComplete="name"
              error={errors.name?.message}
              {...register("name")}
            />
            <AppInput
              label="Phone number"
              placeholder="9876543210"
              autoComplete="tel"
              error={errors.phone?.message}
              {...register("phone")}
            />
          </div>

          <AppInput
            label="Email address"
            placeholder="you@example.com"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email")}
          />
          <AppInput
            label="Password"
            type="password"
            placeholder="Minimum 6 characters"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register("password")}
          />

          <label className="text-sm font-medium text-secondary">
            <span>Gender</span>
            <select
              className="mt-2 w-full rounded-2xl border border-secondary/10 bg-white px-4 py-3 text-sm text-secondary outline-none transition focus:border-primary"
              {...register("gender")}
            >
              <option value="prefer_not_to_say">Prefer not to say</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender?.message ? <span className="mt-2 block text-xs text-error">{errors.gender.message}</span> : null}
          </label>

          <div className="rounded-[24px] border border-primary/10 bg-primary/[0.05] px-4 py-3 text-xs leading-6 text-secondary/70">
            Your account is created only after email verification. Keep this tab open so you can enter the OTP on the next step.
          </div>

          <p className="text-xs leading-6 text-secondary/50">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>

          <AppButton isLoading={sendEmailOtp.isPending} className="w-full py-3.5">
            Send verification OTP
          </AppButton>
        </form>

        <div className="my-7 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-secondary/35">
          <div className="h-px flex-1 bg-secondary/10" />
          Or sign up with
          <div className="h-px flex-1 bg-secondary/10" />
        </div>

        <SocialButtons />

        <p className="mt-6 text-center text-xs leading-6 text-secondary/45">
          Prefer a phone-based flow?{" "}
          <Link href="/otp" className="font-semibold text-primary">
            Verify OTP first
          </Link>
          .
        </p>
      </AuthShell>
    </div>
  );
}
