"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
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
    <div className="fabric-bg flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center">
          <Image src="/logo.svg" alt="ThreadsApp" width={160} height={40} />
          <CardTitle className="mt-4 text-2xl">Admin Sign In</CardTitle>
          <p className="text-sm text-slate-500">Manage products, orders, users, returns, and analytics.</p>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={form.handleSubmit((values) => login.mutate(values))}>
            <div>
              <Label>Email</Label>
              <Input type="email" {...form.register("email")} placeholder="admin@threadsapp.in" />
              {form.formState.errors.email ? <p className="mt-1 text-xs text-red-600">{form.formState.errors.email.message}</p> : null}
            </div>
            <div>
              <Label>Password</Label>
              <div className="relative">
                <Input type={showPassword ? "text" : "password"} {...form.register("password")} placeholder="Enter password" />
                <button type="button" className="absolute right-3 top-3 text-slate-400" onClick={() => setShowPassword((state) => !state)}>
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
            <Button className="w-full" loading={login.isPending} type="submit">
              Sign in
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
