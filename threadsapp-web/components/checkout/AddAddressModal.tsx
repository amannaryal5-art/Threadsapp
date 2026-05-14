"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { AddressMapPicker } from "@/components/checkout/AddressMapPicker";
import { AppButton } from "@/components/shared/AppButton";
import { AppInput } from "@/components/shared/AppInput";
import { apiErrorItems, getAddressErrorMessage, useCreateAddress } from "@/hooks/useAddresses";
import { addressSchema } from "@/validations/address.schema";
import type { z } from "zod";

type AddressFormData = z.infer<typeof addressSchema>;

const defaultPosition = { lat: 28.6139, lng: 77.209 };

export function AddAddressModal({ onCreated }: { onCreated?: (addressId: string) => void } = {}) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState(defaultPosition);
  const mutation = useCreateAddress();

  const {
    register,
    handleSubmit,
    setError,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      flatNo: "",
      building: "",
      street: "",
      area: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
      type: "home",
      isDefault: false,
      lat: defaultPosition.lat,
      lng: defaultPosition.lng,
    },
  });
  const phoneRegister = register("phone");
  const pincodeRegister = register("pincode");

  const isBusy = mutation.isPending || isSubmitting;
  const pincodeValue = watch("pincode");
  const phoneValue = watch("phone");

  const payloadPreview = useMemo(
    () => ({
      fullName: watch("fullName"),
      phone: phoneValue,
      pincode: pincodeValue,
      city: watch("city"),
      state: watch("state"),
      lat: position.lat,
      lng: position.lng,
    }),
    [phoneValue, pincodeValue, position, watch],
  );

  const onSubmit = handleSubmit(async (values) => {
    console.log("[address.request-payload]", { ...values, lat: position.lat, lng: position.lng });
    try {
      const address = await mutation.mutateAsync({ ...values, lat: position.lat, lng: position.lng });
      toast.success("Address added successfully");
      onCreated?.(address.id);
      reset();
      setPosition(defaultPosition);
      setOpen(false);
    } catch (error) {
      const serverErrors = apiErrorItems(error);
      serverErrors.forEach((item) => {
        const field = item.field as keyof AddressFormData;
        setError(field, { type: "server", message: item.message });
      });
      toast.error(getAddressErrorMessage(error));
    }
  });

  return (
    <>
      <AppButton variant="outline" onClick={() => setOpen(true)}>
        Add New Address
      </AppButton>
      {open ? (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-secondary/40 p-4">
          <div className="mx-auto max-w-4xl rounded-[32px] bg-white p-6 shadow-card">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-semibold text-secondary">Add Address</h3>
                <p className="mt-1 text-sm text-secondary/60">Move the pin to refine your location. Use a 10-digit mobile number and 6-digit pincode.</p>
              </div>
              <AppButton type="button" variant="ghost" onClick={() => setOpen(false)}>
                Close
              </AppButton>
            </div>

            <form onSubmit={onSubmit} className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
              <div className="grid gap-4 md:grid-cols-2">
                <AppInput label="Full Name" error={errors.fullName?.message} {...register("fullName")} />
                <AppInput
                  label="Phone"
                  inputMode="numeric"
                  error={errors.phone?.message}
                  {...phoneRegister}
                  onChange={(event) => {
                    const normalized = event.target.value.replace(/\D/g, "").slice(0, 15);
                    phoneRegister.onChange({ ...event, target: { ...event.target, value: normalized, name: phoneRegister.name } });
                  }}
                />
                <AppInput label="Flat No" error={errors.flatNo?.message} {...register("flatNo")} />
                <AppInput label="Building" error={errors.building?.message} {...register("building")} />
                <AppInput label="Street" error={errors.street?.message} {...register("street")} />
                <AppInput label="Area" error={errors.area?.message} {...register("area")} />
                <AppInput label="City" error={errors.city?.message} {...register("city")} />
                <AppInput label="State" error={errors.state?.message} {...register("state")} />
                <AppInput
                  label="Pincode"
                  inputMode="numeric"
                  error={errors.pincode?.message}
                  {...pincodeRegister}
                  onChange={(event) => {
                    const normalized = event.target.value.replace(/\D/g, "").slice(0, 6);
                    pincodeRegister.onChange({ ...event, target: { ...event.target, value: normalized, name: pincodeRegister.name } });
                  }}
                />
                <AppInput label="Country" error={errors.country?.message} {...register("country")} />
                <label className="flex items-center gap-3 rounded-2xl border border-secondary/10 px-4 py-3 text-sm text-secondary md:col-span-2">
                  <input type="checkbox" {...register("isDefault")} />
                  Set as default delivery address
                </label>
                <div className="md:col-span-2">
                  <AddressMapPicker
                    position={position}
                    onPositionChange={(nextPosition) => {
                      setPosition(nextPosition);
                      setValue("lat", nextPosition.lat, { shouldDirty: true });
                      setValue("lng", nextPosition.lng, { shouldDirty: true });
                    }}
                  />
                </div>
              </div>

              <aside className="rounded-[28px] border border-secondary/10 bg-slate-50 p-5">
                <h4 className="text-lg font-semibold text-secondary">Address Preview</h4>
                <p className="mt-3 text-sm text-secondary/60">
                  {[
                    payloadPreview.fullName,
                    watch("flatNo"),
                    watch("building"),
                    watch("street"),
                    watch("area"),
                    payloadPreview.city,
                    payloadPreview.state,
                    payloadPreview.pincode,
                  ]
                    .filter(Boolean)
                    .join(", ") || "Fill the form to preview the address."}
                </p>
                <p className="mt-3 text-sm text-secondary/55">Phone: {payloadPreview.phone || "Not provided"}</p>
                <p className="mt-2 text-xs text-secondary/45">
                  Coordinates: {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
                </p>
                <div className="mt-5 rounded-2xl bg-white p-4 text-xs text-secondary/60">
                  <p className="font-semibold text-secondary">Validation notes</p>
                  <p className="mt-2">Phone must contain 10 to 15 digits. Pincode must be exactly 6 digits.</p>
                </div>
                <div className="mt-5 flex flex-col gap-3">
                  <AppButton type="submit" isLoading={isBusy}>
                    Save Address
                  </AppButton>
                  <AppButton type="button" variant="outline" onClick={() => setOpen(false)} disabled={isBusy}>
                    Cancel
                  </AppButton>
                </div>
              </aside>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
