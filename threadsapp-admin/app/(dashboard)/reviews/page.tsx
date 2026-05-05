"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { ReviewsTable } from "@/components/reviews/ReviewsTable";
import { useDeleteReview, useReviews } from "@/hooks/useReviews";

export default function ReviewsPage() {
  const { data: reviews = [] } = useReviews();
  const deleteReview = useDeleteReview();
  return (
    <div className="space-y-6">
      <PageHeader title="Reviews" description="Moderate product reviews and remove inappropriate content." />
      <ReviewsTable data={reviews} onDelete={(id) => deleteReview.mutate(id)} />
    </div>
  );
}
