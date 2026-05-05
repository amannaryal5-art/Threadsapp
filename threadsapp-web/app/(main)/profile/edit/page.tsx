"use client";

import { useForm } from "react-hook-form";
import { AppButton } from "@/components/shared/AppButton";
import { AppInput } from "@/components/shared/AppInput";
import { ProfileSidebar } from "@/components/profile/ProfileSidebar";
import { useProfile, useUpdateProfile } from "@/hooks/useAuth";

export default function EditProfilePage() {
  const { data: user } = useProfile();
  const mutation = useUpdateProfile();
  const { register, handleSubmit } = useForm({
    values: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      gender: user?.gender ?? "",
      dateOfBirth: user?.dateOfBirth ?? "",
      profilePhoto: user?.profilePhoto ?? ""
    }
  });

  return (
    <main className="container py-8">
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <ProfileSidebar />
        <form onSubmit={handleSubmit((values) => mutation.mutate(values))} className="rounded-[32px] bg-white p-6 shadow-soft">
          <h1 className="text-3xl font-bold text-secondary">Edit Profile</h1>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <AppInput label="Name" {...register("name")} />
            <AppInput label="Email" {...register("email")} />
            <AppInput label="Phone" {...register("phone")} />
            <AppInput label="Gender" {...register("gender")} />
            <AppInput label="DOB" type="date" {...register("dateOfBirth")} />
            <AppInput label="Profile Photo URL" {...register("profilePhoto")} />
          </div>
          <AppButton className="mt-6" isLoading={mutation.isPending}>
            Save Changes
          </AppButton>
        </form>
      </div>
    </main>
  );
}
