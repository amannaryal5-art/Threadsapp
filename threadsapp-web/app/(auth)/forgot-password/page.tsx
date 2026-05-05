"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { AppButton } from "@/components/shared/AppButton";
import { AppInput } from "@/components/shared/AppInput";
import { useForgotPassword } from "@/hooks/useAuth";
import { forgotPasswordSchema } from "@/validations/auth.schema";
import type { z } from "zod";

type FormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const mutation = useForgotPassword();
  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(forgotPasswordSchema)
  });

  return (
    <div className="w-full max-w-lg rounded-[36px] bg-white p-8 shadow-card">
      <h1 className="text-3xl font-bold text-secondary">Forgot Password</h1>
      <p className="mt-2 text-secondary/60">We’ll send a reset link to your registered email address.</p>
      <form onSubmit={handleSubmit((values) => mutation.mutate(values, { onSuccess: () => toast.success("Reset link sent") }))} className="mt-6 grid gap-4">
        <AppInput label="Email" {...register("email")} />
        <AppButton isLoading={mutation.isPending}>Send Reset Link</AppButton>
      </form>
    </div>
  );
}
