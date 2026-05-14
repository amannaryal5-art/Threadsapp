import { AppButton } from "@/components/shared/AppButton";
import { formatCurrency } from "@/lib/utils";

export function CartSummary({
  mrpTotal,
  subtotal,
  productDiscount,
  couponDiscount,
  shippingCharge,
  taxAmount,
  totalAmount,
  onCheckout,
}: {
  mrpTotal: number;
  subtotal: number;
  productDiscount: number;
  couponDiscount: number;
  shippingCharge: number;
  taxAmount: number;
  totalAmount: number;
  onCheckout: () => void;
}) {
  return (
    <div className="sticky top-24 rounded-[32px] bg-white p-6 shadow-soft">
      <h3 className="text-lg font-semibold text-secondary">Price Details</h3>
      <div className="mt-5 space-y-3 text-sm text-secondary/70">
        <div className="flex justify-between"><span>MRP Total</span><span>{formatCurrency(mrpTotal)}</span></div>
        <div className="flex justify-between text-success"><span>Discount</span><span>-{formatCurrency(productDiscount)}</span></div>
        <div className="flex justify-between text-success"><span>Coupon Discount</span><span>-{formatCurrency(couponDiscount)}</span></div>
        <div className="flex justify-between text-success"><span>Delivery Charge</span><span>{shippingCharge ? formatCurrency(shippingCharge) : "FREE"}</span></div>
        <div className="flex justify-between"><span>GST (18%)</span><span>{formatCurrency(taxAmount)}</span></div>
      </div>
      <p className="mt-3 text-xs text-secondary/45">Free delivery above Rs. 499. GST is calculated on the discounted subtotal plus delivery charge.</p>
      <div className="my-5 border-t border-secondary/10" />
      <div className="flex justify-between text-base font-semibold text-secondary">
        <span>Total</span>
        <span>{formatCurrency(totalAmount)}</span>
      </div>
      <div className="mt-4 rounded-2xl bg-success/10 px-4 py-3 text-sm font-medium text-success">
        You save {formatCurrency(Math.max(mrpTotal - totalAmount, 0))} on this order
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
