"use client";

import { useState } from "react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { GOOGLE_MAPS_KEY } from "@/lib/constants";
import { AppButton } from "@/components/shared/AppButton";
import { AppInput } from "@/components/shared/AppInput";
import { addressSchema } from "@/validations/address.schema";
import type { z } from "zod";

type AddressFormData = z.infer<typeof addressSchema>;

export function AddAddressModal() {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ lat: 12.9716, lng: 77.5946 });
  const queryClient = useQueryClient();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: { country: "India", type: "home", isDefault: false, lat: position.lat, lng: position.lng }
  });

  const mutation = useMutation({
    mutationFn: async (values: AddressFormData) => api.post("/addresses", values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      setOpen(false);
    }
  });

  return (
    <>
      <AppButton variant="outline" onClick={() => setOpen(true)}>
        Add New Address
      </AppButton>
      {open ? (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-secondary/40 p-4">
          <div className="mx-auto max-w-3xl rounded-[32px] bg-white p-6">
            <h3 className="text-2xl font-semibold text-secondary">Add Address</h3>
            <form
              onSubmit={handleSubmit((values) => mutation.mutate({ ...values, lat: position.lat, lng: position.lng }))}
              className="mt-6 grid gap-4 md:grid-cols-2"
            >
              <AppInput label="Full Name" error={errors.fullName?.message} {...register("fullName")} />
              <AppInput label="Phone" error={errors.phone?.message} {...register("phone")} />
              <AppInput label="Flat No" {...register("flatNo")} />
              <AppInput label="Building" {...register("building")} />
              <AppInput label="Street" {...register("street")} />
              <AppInput label="Area" {...register("area")} />
              <AppInput label="City" error={errors.city?.message} {...register("city")} />
              <AppInput label="State" error={errors.state?.message} {...register("state")} />
              <AppInput label="Pincode" error={errors.pincode?.message} {...register("pincode")} />
              <AppInput label="Country" error={errors.country?.message} {...register("country")} />
              <div className="md:col-span-2">
                <div className="h-64 overflow-hidden rounded-[24px]">
                  <APIProvider apiKey={GOOGLE_MAPS_KEY}>
                    <Map
                      defaultZoom={12}
                      defaultCenter={position}
                      gestureHandling="greedy"
                      onClick={(event) => {
                        const lat = event.detail.latLng?.lat;
                        const lng = event.detail.latLng?.lng;
                        if (typeof lat === "number" && typeof lng === "number") {
                          setPosition({ lat, lng });
                          setValue("lat", lat);
                          setValue("lng", lng);
                        }
                      }}
                    >
                      <Marker position={position} draggable onDragEnd={(event) => {
                        const lat = event.latLng?.lat();
                        const lng = event.latLng?.lng();
                        if (typeof lat === "number" && typeof lng === "number") {
                          setPosition({ lat, lng });
                          setValue("lat", lat);
                          setValue("lng", lng);
                        }
                      }} />
                    </Map>
                  </APIProvider>
                </div>
              </div>
              <div className="md:col-span-2 flex justify-end gap-3">
                <AppButton type="button" variant="ghost" onClick={() => setOpen(false)}>
                  Cancel
                </AppButton>
                <AppButton type="submit" isLoading={mutation.isPending}>
                  Save Address
                </AppButton>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
