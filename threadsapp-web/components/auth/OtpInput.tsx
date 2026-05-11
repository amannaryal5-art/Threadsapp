"use client";

import { OTPInput, SlotProps } from "input-otp";
import { cn } from "@/lib/utils";

function Slot(props: SlotProps) {
  return (
    <div
      className={cn(
        "grid h-16 w-12 place-items-center rounded-[20px] border bg-white text-xl font-semibold text-secondary shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition-all duration-200 sm:w-14",
        props.isActive
          ? "border-primary bg-primary/[0.04] text-primary ring-4 ring-primary/10"
          : props.char
            ? "border-secondary/20"
            : "border-secondary/10",
      )}
    >
      {props.char ?? ""}
    </div>
  );
}

export function OtpInput({
  value,
  onChange
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <OTPInput
      maxLength={6}
      value={value}
      onChange={onChange}
      containerClassName="w-full"
      render={({ slots }) => (
        <div className="flex w-full items-center justify-between gap-2 sm:gap-3">
          {slots.map((slot, index) => (
            <Slot key={index} {...slot} />
          ))}
        </div>
      )}
    />
  );
}
