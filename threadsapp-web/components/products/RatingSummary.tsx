import { StarRating } from "@/components/shared/StarRating";

export function RatingSummary({ rating, count }: { rating: number; count: number }) {
  const bars = [60, 22, 10, 5, 3];
  return (
    <div className="rounded-[28px] bg-white p-6 shadow-soft">
      <p className="text-4xl font-bold text-secondary">{rating.toFixed(1)}</p>
      <StarRating rating={rating} className="mt-2" />
      <p className="mt-2 text-sm text-secondary/50">{count} ratings, {Math.floor(count / 2)} reviews</p>
      <div className="mt-5 space-y-3">
        {[5, 4, 3, 2, 1].map((star, index) => (
          <div key={star} className="flex items-center gap-3">
            <span className="w-5 text-sm">{star}★</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary/10">
              <div className="h-full rounded-full bg-primary" style={{ width: `${bars[index]}%` }} />
            </div>
            <span className="w-12 text-right text-sm text-secondary/50">{bars[index]}%</span>
          </div>
        ))}
      </div>
      <p className="mt-5 text-sm text-secondary/60">Most buyers say: True to Size</p>
    </div>
  );
}
