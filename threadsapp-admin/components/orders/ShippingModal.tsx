"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ShippingModal({ onConfirm }: { onConfirm: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Ship Order</Button>
      </DialogTrigger>
      <DialogContent>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Create Shipment</h3>
          <Input placeholder="Courier name (optional)" />
          <Input placeholder="Tracking number (optional)" />
          <div className="flex justify-end">
            <Button onClick={() => { onConfirm(); setOpen(false); }}>Confirm Shipment</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
