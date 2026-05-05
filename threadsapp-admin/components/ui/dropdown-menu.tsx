"use client";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

export function DropdownMenuContent({ className, ...props }: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>) {
  return <DropdownMenuPrimitive.Portal><DropdownMenuPrimitive.Content className={cn("z-50 min-w-[10rem] rounded-xl border border-border bg-white p-1 shadow-soft", className)} {...props} /></DropdownMenuPrimitive.Portal>;
}

export function DropdownMenuItem({ className, ...props }: React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>) {
  return <DropdownMenuPrimitive.Item className={cn("flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm outline-none hover:bg-slate-100", className)} {...props} />;
}
