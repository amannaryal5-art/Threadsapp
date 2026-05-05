"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { AddAddressModal } from "@/components/checkout/AddAddressModal";
import { AddressCard } from "@/components/profile/AddressCard";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import type { ApiResponse } from "@/types/api.types";
import type { Address } from "@/types/user.types";

export default function AddressesPage() {
  const { data = [] } = useQuery({
    queryKey: ["addresses"],
    queryFn: async () => {
      const response = await api.get<ApiResponse<{ addresses: Address[] }>>("/addresses");
      return response.data.data.addresses;
    }
  });

  return (
    <main className="container py-8">
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <ProfileSidebar />
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-secondary">Addresses</h1>
            <AddAddressModal />
          </div>
          <div className="grid gap-4">
            {data.map((address) => (
              <AddressCard key={address.id} address={address} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
