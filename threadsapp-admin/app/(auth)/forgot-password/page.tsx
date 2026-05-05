"use client";

import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForgotPassword } from "@/hooks/useAuth";

const schema = z.object({
  email: z.string().email(),
});

type ForgotPasswordValues = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const forgotPassword = useForgotPassword();
  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  return (
    <div className="fabric-bg flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center text-center">
          <Image src="/logo.svg" alt="ThreadsApp" width={160} height={40} />
          <CardTitle className="mt-4 text-2xl">Forgot Password</CardTitle>
          <p className="text-sm text-slate-500">Enter your admin email and we will send you a reset link.</p>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={form.handleSubmit((values) => forgotPassword.mutate(values.email))}>
            <div>
              <Label>Email</Label>
              <Input type="email" {...form.register("email")} placeholder="admin@threadsapp.in" />
              {form.formState.errors.email ? <p className="mt-1 text-xs text-red-600">{form.formState.errors.email.message}</p> : null}
            </div>
            <Button className="w-full" loading={forgotPassword.isPending} type="submit">
              Send reset link
            </Button>
            <div className="text-center text-sm text-slate-500">
              <Link href="/login" className="font-medium text-coral hover:underline">
                Back to sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
