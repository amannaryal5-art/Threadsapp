import { SkeletonGrid } from "@/components/shared/SkeletonGrid";

export default function Loading() {
  return (
    <main className="container py-10">
      <div className="mb-8 h-12 w-1/3 rounded-full bg-shimmer bg-[length:800px_104px] animate-shimmer" />
      <SkeletonGrid />
    </main>
  );
}
