import Image from "next/image";
import { AppButton } from "@/components/shared/AppButton";
import { CouponInput } from "@/components/cart/CouponInput";
import { formatCurrency } from "@/lib/utils";
import type { CartItem } from "@/types/cart.types";

export function ReviewStep({
  items,
  subtotal,
  taxAmount,
  shippingCharge,
  onContinue,
  onApplyCoupon
}: {
  items: CartItem[];
  subtotal: number;
  taxAmount: number;
  shippingCharge: number;
  onContinue: () => void;
  onApplyCoupon: (couponCode: string) => Promise<{ couponCode: string; savedAmount: number }>;
}) {
  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-semibold text-secondary">Order Review</h2>
      <div className="space-y-4 rounded-[32px] bg-white p-5 shadow-soft">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 border-b border-secondary/10 pb-4 last:border-b-0 last:pb-0">
            <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-background">
              <Image src={item.Product?.images?.[0]?.url ?? "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80"} alt={item.Product?.name ?? "item"} fill className="object-cover" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-secondary">{item.Product?.name}</p>
              <p className="text-sm text-secondary/50">{item.ProductVariant?.size} | {item.ProductVariant?.color} | Qty {item.quantity}</p>
            </div>
            <span className="font-semibold text-primary">{formatCurrency(Number(item.priceAtAdd) * item.quantity)}</span>
          </div>
        ))}
      </div>
      <CouponInput onApply={onApplyCoupon} />
      <div className="rounded-[32px] bg-white p-5 shadow-soft">
        <div className="flex justify-between text-sm"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
        <div className="mt-3 flex justify-between text-sm"><span>Shipping</span><span>{shippingCharge ? formatCurrency(shippingCharge) : "FREE"}</span></div>
        <div className="mt-3 flex justify-between text-sm"><span>GST</span><span>{formatCurrency(taxAmount)}</span></div>
      </div>
      <AppButton onClick={onContinue}>Continue to Payment</AppButton>
    </div>
  );
}
