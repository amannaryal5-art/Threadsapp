const flow = ["pending_payment", "confirmed", "processing", "shipped", "delivered"];

export function OrderTimeline({ status }: { status: string }) {
  const currentIndex = Math.max(flow.indexOf(status), 0);

  return (
    <div className="space-y-4">
      {flow.map((step, index) => {
        const done = index < currentIndex;
        const current = index === currentIndex;
        return (
          <div key={step} className="flex items-start gap-3">
            <div className={`mt-1 h-4 w-4 rounded-full ${done ? "bg-green-500" : current ? "animate-pulse bg-coral" : "bg-slate-200"}`} />
            <div>
              <p className="font-medium capitalize text-slate-900">{step.replace(/_/g, " ")}</p>
              <p className="text-sm text-slate-500">{done ? "Completed" : current ? "Current status" : "Pending"}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
