export function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-[28px] bg-white p-4 shadow-soft">
      <div className="h-64 rounded-[20px] bg-shimmer bg-[length:800px_104px] animate-shimmer" />
      <div className="mt-4 h-4 w-1/3 rounded-full bg-shimmer bg-[length:800px_104px] animate-shimmer" />
      <div className="mt-3 h-5 w-4/5 rounded-full bg-shimmer bg-[length:800px_104px] animate-shimmer" />
      <div className="mt-3 h-5 w-1/2 rounded-full bg-shimmer bg-[length:800px_104px] animate-shimmer" />
    </div>
  );
}
