import { EmptyState } from "@/components/shared/EmptyState";

export function EmptyCart() {
  return (
    <EmptyState
      title="Your cart is empty"
      description="Add a few wardrobe heroes to your bag and come back when you’re ready to checkout."
      ctaHref="/"
      ctaLabel="Continue Shopping"
    />
  );
}
