"use client";

export const dynamic = 'force-dynamic';

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { Eye, EyeOff, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useLogin } from "@/hooks/useAuth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type LoginValues = z.infer<typeof schema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { status } = useSession();
  const login = useLogin();
  const form = useForm<LoginValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [router, status]);

  return (
    <div className="flex items-center justify-center">
      <Card className="panel-surface w-full max-w-xl overflow-hidden rounded-[32px] border-white/70">
        <div className="h-1.5 bg-gradient-to-r from-coral via-[#ff9472] to-[#ffd166]" />
        <CardHeader className="items-center px-8 pt-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-gradient-to-br from-coral to-[#ff8d72] shadow-[0_18px_45px_rgba(255,107,107,0.3)]">
            <LockKeyhole className="h-7 w-7 text-white" />
          </div>
          <div className="mt-5 space-y-3">
            <div className="flex justify-center">
              <Image src="/logo.svg" alt="ThreadsApp" width={160} height={40} priority />
            </div>
            <CardTitle className="text-3xl tracking-tight">Admin Sign In</CardTitle>
            <p className="mx-auto max-w-md text-sm leading-6 text-slate-500">
              Access the operational workspace for products, orders, customers, returns, and campaign performance.
            </p>
          </div>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              Protected access
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-coral/10 px-3 py-1.5 text-xs font-medium text-coral">
              <Sparkles className="h-3.5 w-3.5" />
              Staff-only console
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <form className="space-y-5" onSubmit={form.handleSubmit((values) => login.mutate(values))}>
            <div>
              <Label className="mb-2 block text-sm font-medium text-slate-700">Email</Label>
              <Input type="email" {...form.register("email")} className="h-12 rounded-2xl border-slate-200 bg-white/90 px-4" placeholder="admin@threadsapp.in" />
              {form.formState.errors.email ? <p className="mt-1 text-xs text-red-600">{form.formState.errors.email.message}</p> : null}
            </div>
            <div>
              <Label className="mb-2 block text-sm font-medium text-slate-700">Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  {...form.register("password")}
                  className="h-12 rounded-2xl border-slate-200 bg-white/90 px-4 pr-12"
                  placeholder="Enter password"
                />
                <button type="button" className="absolute right-4 top-4 text-slate-400 transition hover:text-slate-600" onClick={() => setShowPassword((state) => !state)}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {form.formState.errors.password ? <p className="mt-1 text-xs text-red-600">{form.formState.errors.password.message}</p> : null}
              <div className="mt-2 text-right">
                <Link href="/forgot-password" className="text-sm font-medium text-coral hover:underline">
                  Forgot password?
                </Link>
              </div>
            </div>
            <Button className="h-12 w-full rounded-2xl text-base" loading={login.isPending} type="submit">
              Sign in
            </Button>
            <p className="text-center text-xs leading-5 text-slate-500">
              Use your admin credentials to continue into the secure ThreadsApp operations workspace.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
