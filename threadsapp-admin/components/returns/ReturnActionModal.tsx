"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function ReturnActionModal({
  title,
  triggerLabel,
  onConfirm,
}: {
  title: string;
  triggerLabel: string;
  onConfirm: (notes: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState("");
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">{triggerLabel}</Button>
      </DialogTrigger>
      <DialogContent>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <Textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Add notes" />
          <div className="flex justify-end">
            <Button onClick={() => { onConfirm(notes); setOpen(false); }}>Confirm</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
