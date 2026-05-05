"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import { AppButton } from "@/components/shared/AppButton";
import { AppInput } from "@/components/shared/AppInput";
import { reviewSchema } from "@/validations/review.schema";
import type { z } from "zod";

type ReviewFormData = z.infer<typeof reviewSchema>;

export function WriteReview({ productId, orderItemId }: { productId: string; orderItemId: string }) {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { productId, orderItemId, rating: 5, comment: "", photos: [] }
  });

  const mutation = useMutation({
    mutationFn: async (values: ReviewFormData) => api.post("/reviews", values),
    onSuccess: () => {
      toast.success("Review submitted");
      reset();
      setOpen(false);
    }
  });

  return (
    <>
      <AppButton onClick={() => setOpen(true)}>Write a Review</AppButton>
      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-secondary/40 p-4">
          <form onSubmit={handleSubmit((values) => mutation.mutate(values))} className="w-full max-w-xl rounded-[32px] bg-white p-6">
            <h3 className="text-xl font-semibold text-secondary">Rate your purchase</h3>
            <div className="mt-5 grid gap-4">
              <AppInput label="Review Title" error={errors.title?.message} {...register("title")} />
              <label className="text-sm font-medium text-secondary">
                Rating
                <select className="mt-2 w-full rounded-2xl border border-secondary/10 px-4 py-3" {...register("rating", { valueAsNumber: true })}>
                  {[5, 4, 3, 2, 1].map((value) => (
                    <option key={value} value={value}>
                      {value} Star
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-medium text-secondary">
                Review
                <textarea
                  className="mt-2 min-h-32 w-full rounded-2xl border border-secondary/10 px-4 py-3"
                  {...register("comment")}
                />
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <AppButton type="button" variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </AppButton>
              <AppButton type="submit" isLoading={mutation.isPending}>
                Submit Review
              </AppButton>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
}
