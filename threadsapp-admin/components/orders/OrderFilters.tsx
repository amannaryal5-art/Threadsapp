"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { DateRangePicker } from "@/components/shared/DateRangePicker";
import { SearchInput } from "@/components/shared/SearchInput";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ORDER_STATUSES, PAYMENT_STATUSES } from "@/lib/constants";
import type { DateRange } from "react-day-picker";

export function OrderFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const updateParam = (key: string, value: string) => {
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/orders?${params.toString()}`);
  };

  const dateRange: DateRange | undefined =
    searchParams.get("startDate") && searchParams.get("endDate")
      ? { from: new Date(searchParams.get("startDate") as string), to: new Date(searchParams.get("endDate") as string) }
      : undefined;

  return (
    <Card>
      <CardContent className="grid gap-4 pt-6 md:grid-cols-4">
        <SearchInput value={searchParams.get("search") ?? ""} onChange={(value) => updateParam("search", value)} placeholder="Search order number" />
        <Select value={searchParams.get("status") ?? ""} onValueChange={(value) => updateParam("status", value)}>
          <SelectTrigger><SelectValue placeholder="Order status" /></SelectTrigger>
          <SelectContent>{ORDER_STATUSES.map((status) => <SelectItem key={status} value={status}>{status}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={searchParams.get("paymentStatus") ?? ""} onValueChange={(value) => updateParam("paymentStatus", value)}>
          <SelectTrigger><SelectValue placeholder="Payment status" /></SelectTrigger>
          <SelectContent>{PAYMENT_STATUSES.map((status) => <SelectItem key={status} value={status}>{status}</SelectItem>)}</SelectContent>
        </Select>
        <DateRangePicker value={dateRange} onChange={(range) => {
          updateParam("startDate", range?.from?.toISOString() ?? "");
          updateParam("endDate", range?.to?.toISOString() ?? "");
        }} />
      </CardContent>
    </Card>
  );
}
