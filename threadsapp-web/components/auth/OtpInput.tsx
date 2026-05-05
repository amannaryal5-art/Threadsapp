"use client";

import { OTPInput, SlotProps } from "input-otp";

function Slot(props: SlotProps) {
  return (
    <div className="grid h-14 w-12 place-items-center rounded-2xl border border-secondary/10 bg-white text-lg font-semibold text-secondary">
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
  return <OTPInput maxLength={6} value={value} onChange={onChange} render={({ slots }) => <div className="flex gap-2">{slots.map((slot, index) => <Slot key={index} {...slot} />)}</div>} />;
}
