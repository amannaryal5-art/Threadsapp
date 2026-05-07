"use client";
export const dynamic = 'force-dynamic';

import { Suspense } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { UsersTable } from "@/components/users/UsersTable";
import { useUsers } from "@/hooks/useUsers";
import { useSearchParams } from "next/navigation";

function UsersPageContent() {
  const searchParams = useSearchParams();
  const { data: users = [], isLoading } = useUsers({ search: searchParams.get("search") ?? undefined });
  return (
    <div className="space-y-6">
      <PageHeader title="Users" description="View customers, loyalty balances, and account status." />
      <UsersTable data={users} isLoading={isLoading} />
    </div>
  );
}

export default function UsersPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UsersPageContent />
    </Suspense>
  );
}
