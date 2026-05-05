"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-lg rounded-2xl border border-border bg-white p-8 text-center shadow-soft">
          <h1 className="text-2xl font-semibold text-slate-900">Something went wrong</h1>
          <p className="mt-3 text-sm text-slate-500">The admin dashboard hit an unexpected issue. Please retry the action.</p>
          <p className="mt-3 rounded-xl bg-slate-50 px-4 py-3 text-left text-xs text-slate-600">{error.message}</p>
          <div className="mt-6 flex justify-center gap-3">
            <Button variant="secondary" onClick={() => window.location.assign("/dashboard")}>Go to dashboard</Button>
            <Button onClick={reset}>Try again</Button>
          </div>
        </div>
      </body>
    </html>
  );
}
