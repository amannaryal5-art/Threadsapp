import Image from "next/image";
import { Minus, Plus } from "lucide-react";
import type { CartItem as CartItemType } from "@/types/cart.types";
import { formatCurrency } from "@/lib/utils";

export function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
  onMoveToWishlist
}: {
  item: CartItemType;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
  onMoveToWishlist: () => void;
}) {
  const lowStock = (item.ProductVariant?.inventory?.quantity ?? 0) <= 2;
  return (
    <div className="flex gap-4 rounded-[28px] bg-white p-4 shadow-soft">
      <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-background">
        <Image
          src={item.Product?.images?.[0]?.url ?? "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80"}
          alt={item.Product?.name ?? "Cart item"}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-secondary/40">{item.Product?.Brand?.name}</p>
        <p className="mt-1 text-sm font-medium text-secondary">{item.Product?.name}</p>
        <p className="mt-1 text-xs text-secondary/50">
          Size: {item.ProductVariant?.size} | Color: {item.ProductVariant?.color}
        </p>
        <div className="mt-3 flex items-center gap-4">
          <div className="flex items-center rounded-full border border-secondary/10">
            <button className="px-3 py-2" onClick={() => onUpdateQuantity(item.quantity - 1)}>
              <Minus className="h-4 w-4" />
            </button>
            <span className="px-3 text-sm">{item.quantity}</span>
            <button className="px-3 py-2" onClick={() => onUpdateQuantity(item.quantity + 1)}>
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <span className="font-semibold text-primary">{formatCurrency(item.priceAtAdd)}</span>
        </div>
        <div className="mt-3 flex gap-4 text-xs font-semibold">
          <button onClick={onRemove} className="text-secondary/60">
            Remove
          </button>
          <button onClick={onMoveToWishlist} className="text-primary">
            Move to Wishlist
          </button>
        </div>
        {lowStock ? <p className="mt-2 text-xs font-semibold text-error">Only 2 left!</p> : null}
      </div>
    </div>
  );
}
