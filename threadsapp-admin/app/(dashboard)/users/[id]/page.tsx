"use client";

import { useParams } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { UserDetail } from "@/components/users/UserDetail";
import { useBlockUser, useUser, useUserOrders } from "@/hooks/useUsers";

export default function UserDetailPage() {
  const params = useParams<{ id: string }>();
  const { data: user } = useUser(params.id);
  const { data: orders = [] } = useUserOrders(params.id);
  const blockUser = useBlockUser();

  if (!user) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Detail"
        description="Inspect customer profile, spending, reviews, and addresses."
        action={<ConfirmDialog trigger={<Button variant={user.isActive ? "destructive" : "secondary"}>{user.isActive ? "Block User" : "Unblock User"}</Button>} title="Update user status?" description="This will toggle access for this account." onConfirm={() => blockUser.mutate(user.id)} />}
      />
      <UserDetail user={user} orders={orders} />
    </div>
  );
}
