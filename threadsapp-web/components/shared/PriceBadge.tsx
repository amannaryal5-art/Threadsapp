import { formatCurrency } from "@/lib/utils";

export function PriceBadge({
  price,
  mrp,
  discount
}: {
  price: number | string;
  mrp?: number | string;
  discount?: number;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[22px] font-bold text-primary">{formatCurrency(price)}</span>
      {mrp ? <span className="text-sm text-secondary/40 line-through">{formatCurrency(mrp)}</span> : null}
      {discount ? <span className="text-sm font-semibold text-success">{discount}% OFF</span> : null}
    </div>
  );
}
