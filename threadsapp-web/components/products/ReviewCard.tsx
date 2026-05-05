import { formatDate } from "@/lib/utils";
import { StarRating } from "@/components/shared/StarRating";
import type { ProductReview } from "@/types/product.types";

export function ReviewCard({ review }: { review: ProductReview }) {
  return (
    <article className="rounded-[24px] border border-secondary/10 p-5">
      <div className="flex items-center justify-between">
        <StarRating rating={review.rating} />
        <span className="text-xs text-secondary/40">{formatDate(review.createdAt, "d MMM yyyy")}</span>
      </div>
      <h4 className="mt-3 font-semibold text-secondary">{review.title ?? "Loved the fit and finish"}</h4>
      <p className="mt-2 text-sm text-secondary/65">{review.comment}</p>
      {review.isVerifiedPurchase ? <span className="mt-4 inline-block text-xs font-semibold text-success">Verified purchase</span> : null}
    </article>
  );
}
