"use client";
export const dynamic = 'force-dynamic';

import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useResetPassword } from "@/hooks/useAuth";

const schema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm your password"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordValues = z.infer<typeof schema>;

function ResetPasswordPageContent() {
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get("token") ?? "", [searchParams]);
  const resetPassword = useResetPassword();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  return (
    <div className="fabric-bg flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center">
          <Image src="/logo.svg" alt="ThreadsApp" width={160} height={40} />
          <CardTitle className="mt-4 text-2xl">Reset Password</CardTitle>
          <p className="text-sm text-slate-500">Set a new password for your admin account.</p>
        </CardHeader>
        <CardContent>
          {!token ? (
            <div className="space-y-4 text-center">
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">This reset link is missing a token. Request a new password reset email.</p>
              <Link href="/forgot-password" className="inline-block font-medium text-coral hover:underline">
                Request a new reset link
              </Link>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={form.handleSubmit((values) => resetPassword.mutate({ token, password: values.password }))}>
              <div>
                <Label>New Password</Label>
                <div className="relative">
                  <Input type={showPassword ? "text" : "password"} {...form.register("password")} placeholder="Enter new password" />
                  <button type="button" className="absolute right-3 top-3 text-slate-400" onClick={() => setShowPassword((state) => !state)}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {form.formState.errors.password ? <p className="mt-1 text-xs text-red-600">{form.formState.errors.password.message}</p> : null}
              </div>
              <div>
                <Label>Confirm Password</Label>
                <div className="relative">
                  <Input type={showConfirmPassword ? "text" : "password"} {...form.register("confirmPassword")} placeholder="Confirm new password" />
                  <button type="button" className="absolute right-3 top-3 text-slate-400" onClick={() => setShowConfirmPassword((state) => !state)}>
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {form.formState.errors.confirmPassword ? <p className="mt-1 text-xs text-red-600">{form.formState.errors.confirmPassword.message}</p> : null}
              </div>
              <Button className="w-full" loading={resetPassword.isPending} type="submit">
                Reset password
              </Button>
              <div className="text-center text-sm text-slate-500">
                <Link href="/login" className="font-medium text-coral hover:underline">
                  Back to sign in
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordPageContent />
    </Suspense>
  );
}
