import type { Address } from "@/types/user.types";

export function AddressCard({
  address,
  selected,
  onSelect
}: {
  address: Address;
  selected?: boolean;
  onSelect?: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`w-full rounded-[28px] border p-5 text-left ${selected ? "border-primary bg-primary/5" : "border-secondary/10 bg-white"}`}
    >
      <div className="flex items-center gap-3">
        <span className="rounded-full bg-secondary/5 px-3 py-1 text-xs font-semibold uppercase">{address.type}</span>
        {address.isDefault ? <span className="text-xs font-semibold text-primary">Default</span> : null}
      </div>
      <h3 className="mt-3 font-semibold text-secondary">{address.fullName}</h3>
      <p className="mt-2 text-sm text-secondary/60">
        {[address.flatNo, address.building, address.street, address.area, address.city, address.state, address.pincode]
          .filter(Boolean)
          .join(", ")}
      </p>
      <p className="mt-2 text-sm text-secondary/60">{address.phone}</p>
    </button>
  );
}
