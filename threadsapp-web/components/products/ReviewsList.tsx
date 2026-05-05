import { ReviewCard } from "@/components/products/ReviewCard";
import { AppButton } from "@/components/shared/AppButton";
import type { ProductReview } from "@/types/product.types";

export function ReviewsList({
  reviews,
  hasMore,
  onLoadMore
}: {
  reviews: ProductReview[];
  hasMore?: boolean;
  onLoadMore?: () => void;
}) {
  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
      {hasMore && onLoadMore ? (
        <AppButton variant="outline" onClick={onLoadMore}>
          Load More
        </AppButton>
      ) : null}
    </div>
  );
}
