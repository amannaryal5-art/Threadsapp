"use client";

import { AddAddressModal } from "@/components/checkout/AddAddressModal";
import { AddressCard } from "@/components/profile/AddressCard";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { useAddresses } from "@/hooks/useAddresses";

export default function AddressesPage() {
  const { data = [] } = useAddresses();

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
