"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthShell } from "@/components/auth/AuthShell";
import { SocialButtons } from "@/components/auth/SocialButtons";
import { AppButton } from "@/components/shared/AppButton";
import { AppInput } from "@/components/shared/AppInput";
import { useLogin } from "@/hooks/useAuth";
import { loginSchema } from "@/validations/auth.schema";
import type { z } from "zod";

type FormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const login = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", phone: "", otp: "" }
  });

  return (
    <div className="w-full">
      <AuthShell
        eyebrow="Welcome Back"
        title="Sign in and pick up right where you left off."
        description="Access your bag, wishlist, saved addresses, and order history in one place with a fast and familiar login experience."
        alternateHref="/register"
        alternateLabel="Create account"
        alternateText="New to ThreadsApp?"
      >
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Member login</span>
          <h2 className="mt-3 text-3xl font-bold text-secondary">Welcome back</h2>
          <p className="mt-2 text-sm leading-6 text-secondary/60">
            Sign in to continue with your bag, wishlist, and recent orders.
          </p>
        </div>

        <form
          onSubmit={handleSubmit((values) =>
            login.mutate(values as Record<string, string>, {
              onSuccess: () => router.push("/")
            })
          )}
          className="mt-8 grid gap-4"
        >
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
            placeholder="Enter your password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register("password")}
          />

          <div className="flex flex-col gap-3 text-sm text-secondary/65 sm:flex-row sm:items-center sm:justify-between">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" className="h-4 w-4 rounded border-secondary/20 text-primary focus:ring-primary/40" />
              Keep me signed in
            </label>
            <Link href="/forgot-password" className="font-medium text-primary">
              Forgot password?
            </Link>
          </div>

          <AppButton isLoading={login.isPending} className="mt-2 w-full py-3.5">
            Sign in
          </AppButton>
        </form>

        <div className="my-7 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-secondary/35">
          <div className="h-px flex-1 bg-secondary/10" />
          Or continue with
          <div className="h-px flex-1 bg-secondary/10" />
        </div>

        <SocialButtons />
      </AuthShell>
    </div>
  );
}
