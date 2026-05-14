"use client";

import { AddressCard } from "@/components/checkout/AddressCard";
import { AddAddressModal } from "@/components/checkout/AddAddressModal";
import { AppButton } from "@/components/shared/AppButton";
import { useAddresses } from "@/hooks/useAddresses";

export function AddressStep({
  selectedAddressId,
  onSelectAddress,
  onContinue
}: {
  selectedAddressId?: string;
  onSelectAddress: (addressId: string) => void;
  onContinue: () => void;
}) {
  const { data } = useAddresses();
  const addresses = data ?? [];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-secondary">Delivery Address</h2>
        <AddAddressModal onCreated={onSelectAddress} />
      </div>
      <div className="grid gap-4">
        {addresses.map((address) => (
          <AddressCard
            key={address.id}
            address={address}
            selected={selectedAddressId === address.id}
            onSelect={() => onSelectAddress(address.id)}
          />
        ))}
        {!addresses.length ? (
          <div className="rounded-[28px] border border-dashed border-secondary/15 bg-white p-6 text-sm text-secondary/60">
            Add your first delivery address to continue to review and payment.
          </div>
        ) : null}
      </div>
      <AppButton onClick={onContinue} disabled={!selectedAddressId}>
        Deliver Here
      </AppButton>
    </div>
  );
}
