export function ListingHeader({ title, count }: { title: string; count: number }) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-secondary">{title}</h1>
      <p className="mt-2 text-sm text-secondary/55">{count.toLocaleString("en-IN")} products found</p>
    </div>
  );
}
