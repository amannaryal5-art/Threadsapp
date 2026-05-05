export function CheckoutStepper({ currentStep }: { currentStep: 1 | 2 | 3 }) {
  const steps = ["Address", "Review", "Payment"];
  return (
    <div className="flex items-center gap-3 overflow-x-auto">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center gap-3">
          <div className={`grid h-10 w-10 place-items-center rounded-full text-sm font-semibold ${currentStep >= index + 1 ? "bg-primary text-white" : "bg-white text-secondary shadow-soft"}`}>
            {index + 1}
          </div>
          <span className="font-medium text-secondary">{step}</span>
          {index < steps.length - 1 ? <div className="h-px w-10 bg-secondary/10" /> : null}
        </div>
      ))}
    </div>
  );
}
