import { formatCurrency } from "@/lib/utils";
import { AppButton } from "@/components/shared/AppButton";

export function CartSummary({
  subtotal,
  couponDiscount,
  shippingCharge,
  taxAmount,
  onCheckout
}: {
  subtotal: number;
  couponDiscount: number;
  shippingCharge: number;
  taxAmount: number;
  onCheckout: () => void;
}) {
  const mrpTotal = subtotal + 1200;
  const total = subtotal - couponDiscount + shippingCharge + taxAmount;
  return (
    <div className="sticky top-24 rounded-[32px] bg-white p-6 shadow-soft">
      <h3 className="text-lg font-semibold text-secondary">Price Details</h3>
      <div className="mt-5 space-y-3 text-sm text-secondary/70">
        <div className="flex justify-between"><span>MRP Total</span><span>{formatCurrency(mrpTotal)}</span></div>
        <div className="flex justify-between text-success"><span>Discount</span><span>-{formatCurrency(mrpTotal - subtotal)}</span></div>
        <div className="flex justify-between text-success"><span>Coupon Discount</span><span>-{formatCurrency(couponDiscount)}</span></div>
        <div className="flex justify-between text-success"><span>Delivery</span><span>{shippingCharge ? formatCurrency(shippingCharge) : "FREE"}</span></div>
        <div className="flex justify-between"><span>GST</span><span>{formatCurrency(taxAmount)}</span></div>
      </div>
      <div className="my-5 border-t border-secondary/10" />
      <div className="flex justify-between text-base font-semibold text-secondary">
        <span>Total</span>
        <span>{formatCurrency(total)}</span>
      </div>
      <div className="mt-4 rounded-2xl bg-success/10 px-4 py-3 text-sm font-medium text-success">
        You save {formatCurrency(mrpTotal - total)} on this order 🎉
      </div>
      <AppButton className="mt-6 w-full" onClick={onCheckout}>
        Proceed to Checkout
      </AppButton>
      <div className="mt-4 flex flex-wrap gap-2 text-xs text-secondary/50">
        {["Visa", "Mastercard", "UPI", "Razorpay"].map((icon) => (
          <span key={icon} className="rounded-full border border-secondary/10 px-3 py-2">
            {icon}
          </span>
        ))}
      </div>
    </div>
  );
}
