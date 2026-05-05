const steps = ["Placed", "Confirmed", "Shipped", "Out for Delivery", "Delivered"];

export function OrderTimeline({ currentStatus }: { currentStatus: string }) {
  const activeIndex = {
    placed: 0,
    confirmed: 1,
    shipped: 2,
    out_for_delivery: 3,
    delivered: 4
  }[currentStatus] ?? 0;

  return (
    <div className="grid gap-4 rounded-[32px] bg-white p-6 shadow-soft md:grid-cols-5">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center gap-3">
          <div className={`grid h-10 w-10 place-items-center rounded-full ${index <= activeIndex ? "bg-success text-white" : "bg-secondary/10 text-secondary/40"}`}>
            {index < activeIndex ? "✓" : index === activeIndex ? "⏳" : "○"}
          </div>
          <span className="text-sm font-medium text-secondary">{step}</span>
        </div>
      ))}
    </div>
  );
}
