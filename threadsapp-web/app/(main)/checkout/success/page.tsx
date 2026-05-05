import { OrderSuccessView } from "@/components/checkout/OrderSuccessView";

export default function SuccessPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  return (
    <main className="container py-16">
      <OrderSuccessView orderId={searchParams.orderId ?? ""} orderNumber={searchParams.orderNumber ?? ""} />
    </main>
  );
}
