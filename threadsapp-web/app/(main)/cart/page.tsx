"use client";

import { useRouter } from "next/navigation";
import { CartItem as CartItemCard } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { CouponInput } from "@/components/cart/CouponInput";
import { EmptyCart } from "@/components/cart/EmptyCart";
import { useCart } from "@/hooks/useCart";
import { useMoveToWishlist } from "@/hooks/useCart";
import { useCartStore } from "@/store/cartStore";

export default function CartPage() {
  const router = useRouter();
  useCart();
  const cart = useCartStore();
  const moveToWishlist = useMoveToWishlist();

  if (!cart.items.length) return <main className="container py-16"><EmptyCart /></main>;

  return (
    <main className="container py-8">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
          <h1 className="text-3xl font-bold text-secondary">My Cart ({cart.itemCount} items)</h1>
          {cart.items.map((item) => (
            <CartItemCard
              key={item.id}
              item={item}
              onUpdateQuantity={(quantity) => cart.updateQuantity(item.id, quantity)}
              onRemove={() => cart.removeItem(item.id)}
              onMoveToWishlist={() => moveToWishlist.mutate({ itemId: item.id, productId: item.productId })}
            />
          ))}
          <div className="rounded-[28px] bg-white p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-secondary">Delivery Address</p>
                <p className="mt-1 text-sm text-secondary/60">221B MG Road, Indiranagar, Bengaluru 560038</p>
              </div>
              <button className="text-sm font-semibold text-primary">Change</button>
            </div>
          </div>
          <CouponInput onApply={async (couponCode) => ({ couponCode, savedAmount: 260 })} />
        </div>
        <CartSummary
          mrpTotal={cart.mrpTotal}
          subtotal={cart.subtotal}
          productDiscount={cart.productDiscount}
          couponDiscount={cart.couponDiscount}
          shippingCharge={cart.shippingCharge}
          taxAmount={cart.taxAmount}
          totalAmount={cart.totalAmount}
          onCheckout={() => router.push("/checkout")}
        />
      </div>
    </main>
  );
}
