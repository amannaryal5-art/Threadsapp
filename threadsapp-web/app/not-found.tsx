import { EmptyState } from "@/components/shared/EmptyState";

export default function NotFound() {
  return (
    <main className="container py-20">
      <EmptyState
        title="Page not found"
        description="The page you’re looking for may have moved, sold out, or never existed in this collection."
        ctaHref="/"
        ctaLabel="Go Home"
      />
    </main>
  );
}
