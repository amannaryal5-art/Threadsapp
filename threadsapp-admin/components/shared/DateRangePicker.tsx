"use client";

import { useState } from "react";
import { CalendarDays } from "lucide-react";
import { DayPicker, type DateRange } from "react-day-picker";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export function DateRangePicker({ value, onChange }: { value?: DateRange; onChange: (range: DateRange | undefined) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <CalendarDays className="h-4 w-4" />
          {value?.from ? `${formatDate(value.from)} - ${value.to ? formatDate(value.to) : "Select end"}` : "Select date range"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-fit">
        <DayPicker mode="range" selected={value} onSelect={(range) => onChange(range)} />
      </DialogContent>
    </Dialog>
  );
}
