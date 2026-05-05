import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface AppInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const AppInput = forwardRef<HTMLInputElement, AppInputProps>(function AppInput(
  { label, error, className, ...props },
  ref
) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-secondary">
      {label ? <span>{label}</span> : null}
      <input
        ref={ref}
        className={cn(
          "rounded-2xl border border-secondary/10 bg-white px-4 py-3 text-sm text-secondary outline-none transition placeholder:text-secondary/40 focus:border-primary",
          error && "border-error",
          className
        )}
        {...props}
      />
      {error ? <span className="text-xs text-error">{error}</span> : null}
    </label>
  );
});
