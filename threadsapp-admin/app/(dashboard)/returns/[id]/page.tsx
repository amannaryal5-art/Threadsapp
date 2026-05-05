"use client";

import { useParams } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { ReturnActionModal } from "@/components/returns/ReturnActionModal";
import { ReturnDetail } from "@/components/returns/ReturnDetail";
import { useApproveReturn, useRefundReturn, useRejectReturn, useReturn } from "@/hooks/useReturns";

export default function ReturnDetailPage() {
  const params = useParams<{ id: string }>();
  const { data: itemReturn } = useReturn(params.id);
  const approveReturn = useApproveReturn();
  const rejectReturn = useRejectReturn();
  const refundReturn = useRefundReturn();

  if (!itemReturn) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Return Detail"
        description="Review the request, schedule reverse pickup, and manage refunds."
        action={
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => approveReturn.mutate({ id: itemReturn.id })}>Approve</Button>
            <ReturnActionModal title="Reject return" triggerLabel="Reject" onConfirm={(notes) => rejectReturn.mutate({ id: itemReturn.id, payload: { adminNotes: notes } })} />
            <Button variant="secondary" onClick={() => refundReturn.mutate({ id: itemReturn.id })}>Initiate Refund</Button>
          </div>
        }
      />
      <ReturnDetail itemReturn={itemReturn} />
    </div>
  );
}
