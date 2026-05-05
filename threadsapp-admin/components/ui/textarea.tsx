import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn("min-h-[100px] w-full rounded-xl border border-border bg-white px-3 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-coral", className)}
      {...props}
    />
  ),
);

Textarea.displayName = "Textarea";
