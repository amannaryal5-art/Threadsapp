"use client";

export function SortDropdown({
  value,
  onChange
}: {
  value?: string;
  onChange: (value: string) => void;
}) {
  return (
    <select
      className="rounded-full border border-secondary/10 bg-white px-4 py-3 text-sm text-secondary"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      <option value="newest">Newest</option>
      <option value="popular">Popular</option>
      <option value="price_asc">Price: Low to High</option>
      <option value="price_desc">Price: High to Low</option>
      <option value="rating">Top Rated</option>
    </select>
  );
}
