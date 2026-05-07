export const dynamic = 'force-dynamic';
"use client";

import { Suspense } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { ReturnsTable } from "@/components/returns/ReturnsTable";
import { useReturns } from "@/hooks/useReturns";
import { useSearchParams } from "next/navigation";

function ReturnsPageContent() {
  const searchParams = useSearchParams();
  const { data: returns = [], isLoading } = useReturns({ status: searchParams.get("status") ?? undefined });
  return (
    <div className="space-y-6">
      <PageHeader title="Returns" description="Monitor return requests and refund progress." />
      <ReturnsTable data={returns} isLoading={isLoading} />
    </div>
  );
}

export default function ReturnsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReturnsPageContent />
    </Suspense>
  );
}
