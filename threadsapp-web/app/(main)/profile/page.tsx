"use client";

import Image from "next/image";
import Link from "next/link";
import { LoyaltyCard } from "@/components/profile/LoyaltyCard";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { AppButton } from "@/components/shared/AppButton";
import { getInitials } from "@/lib/utils";
import { useLoyaltyPoints, useProfile } from "@/hooks/useAuth";

export default function ProfilePage() {
  const { data: user } = useProfile();
  const { data: loyalty } = useLoyaltyPoints();

  return (
    <main className="container py-8">
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <ProfileSidebar />
        <div className="space-y-6">
          <div className="rounded-[32px] bg-white p-6 shadow-soft">
            <div className="flex flex-col gap-5 md:flex-row md:items-center">
              <div className="grid h-24 w-24 place-items-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                {user?.profilePhoto ? <Image src={user.profilePhoto} alt={user.name} width={96} height={96} className="rounded-full object-cover" /> : getInitials(user?.name ?? "T A")}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-secondary">{user?.name}</h1>
                <p className="mt-2 text-sm text-secondary/60">{user?.email}</p>
                <p className="mt-1 text-sm text-secondary/60">{user?.phone}</p>
                <p className="mt-1 text-sm text-secondary/60">{user?.gender ?? "Prefer not to say"} · {user?.dateOfBirth ?? "DOB not added"}</p>
              </div>
              <Link href="/profile/edit">
                <AppButton>Edit Profile</AppButton>
              </Link>
            </div>
          </div>
          <LoyaltyCard points={loyalty?.balance ?? 1240} />
        </div>
      </div>
    </main>
  );
}
