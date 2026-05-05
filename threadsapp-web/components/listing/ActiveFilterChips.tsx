"use client";

export function ActiveFilterChips({
  filters,
  onRemove
}: {
  filters: Array<{ key: string; label: string }>;
  onRemove: (key: string) => void;
}) {
  if (!filters.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button key={filter.key} onClick={() => onRemove(filter.key)} className="rounded-full bg-secondary/5 px-4 py-2 text-sm text-secondary">
          {filter.label} ×
        </button>
      ))}
    </div>
  );
}
