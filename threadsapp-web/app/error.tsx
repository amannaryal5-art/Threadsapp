"use client";

import { AppButton } from "@/components/shared/AppButton";

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="container py-20">
      <div className="rounded-[36px] bg-white p-10 text-center shadow-soft">
        <h1 className="text-3xl font-bold text-secondary">Something went wrong</h1>
        <p className="mt-3 text-sm text-secondary/60">{error.message}</p>
        <AppButton className="mt-6" onClick={reset}>
          Retry
        </AppButton>
      </div>
    </main>
  );
}
