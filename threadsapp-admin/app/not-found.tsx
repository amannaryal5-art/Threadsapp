import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-lg rounded-2xl border border-border bg-white p-8 text-center shadow-soft">
        <h1 className="text-3xl font-semibold text-slate-900">Page not found</h1>
        <p className="mt-3 text-sm text-slate-500">The page you are looking for does not exist or may have moved.</p>
        <Button asChild className="mt-6">
          <Link href="/dashboard">Back to dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
