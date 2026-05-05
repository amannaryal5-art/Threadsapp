"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { AddressCard } from "@/components/checkout/AddressCard";
import { AddAddressModal } from "@/components/checkout/AddAddressModal";
import { AppButton } from "@/components/shared/AppButton";
import type { ApiResponse } from "@/types/api.types";
import type { Address } from "@/types/user.types";

export function AddressStep({
  selectedAddressId,
  onSelectAddress,
  onContinue
}: {
  selectedAddressId?: string;
  onSelectAddress: (addressId: string) => void;
  onContinue: () => void;
}) {
  const { data } = useQuery({
    queryKey: ["addresses"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<{ addresses: Address[] }>>("/addresses");
      return response.data.data.addresses;
    }
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-secondary">Delivery Address</h2>
        <AddAddressModal />
      </div>
      <div className="grid gap-4">
        {(data ?? []).map((address) => (
          <AddressCard
            key={address.id}
            address={address}
            selected={selectedAddressId === address.id}
            onSelect={() => onSelectAddress(address.id)}
          />
        ))}
      </div>
      <AppButton onClick={onContinue} disabled={!selectedAddressId}>
        Deliver Here
      </AppButton>
    </div>
  );
}
