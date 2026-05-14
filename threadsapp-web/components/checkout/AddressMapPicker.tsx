"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { Loader2, MapPin, RefreshCcw } from "lucide-react";
import { GOOGLE_MAPS_KEY } from "@/lib/constants";
import { AppButton } from "@/components/shared/AppButton";

const defaultCenter = { lat: 28.6139, lng: 77.209 };

export function AddressMapPicker({
  position,
  onPositionChange,
}: {
  position: { lat: number; lng: number };
  onPositionChange: (position: { lat: number; lng: number }) => void;
}) {
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (result) => {
        onPositionChange({ lat: result.coords.latitude, lng: result.coords.longitude });
      },
      () => undefined,
      { enableHighAccuracy: true, timeout: 6000, maximumAge: 60000 },
    );
  }, [onPositionChange]);

  const missingKey = useMemo(() => !GOOGLE_MAPS_KEY, []);

  if (missingKey) {
    return (
      <MapFallback
        title="Google Maps key is missing"
        description="Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in the web app env file and restart the app."
      />
    );
  }

  return (
    <div className="relative h-64 overflow-hidden rounded-[24px] border border-secondary/10 bg-slate-50">
      {loadState !== "ready" ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/85">
          {loadState === "error" ? (
            <MapFallback
              title="Map failed to load"
              description={errorMessage || "Enable Maps JavaScript API, Places API, Geocoding API, billing, and localhost referrers in Google Cloud."}
              action={
                <AppButton
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setLoadState("loading");
                    setErrorMessage("");
                    setRetryKey((value) => value + 1);
                  }}
                >
                  <RefreshCcw className="h-4 w-4" />
                  Retry
                </AppButton>
              }
            />
          ) : (
            <div className="flex items-center gap-2 text-sm text-secondary/60">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading map...
            </div>
          )}
        </div>
      ) : null}

      <APIProvider
        key={retryKey}
        apiKey={GOOGLE_MAPS_KEY}
        libraries={["places", "geocoding"]}
        onLoad={() => setLoadState("ready")}
        onError={(error) => {
          setLoadState("error");
          setErrorMessage(error instanceof Error ? error.message : "Google Maps could not be initialized.");
        }}
      >
        <Map
          defaultZoom={12}
          defaultCenter={defaultCenter}
          center={position}
          gestureHandling="greedy"
          disableDefaultUI={false}
          onClick={(event) => {
            const lat = event.detail.latLng?.lat;
            const lng = event.detail.latLng?.lng;
            if (typeof lat === "number" && typeof lng === "number") {
              onPositionChange({ lat, lng });
            }
          }}
        >
          <Marker
            position={position}
            draggable
            onDragEnd={(event) => {
              const lat = event.latLng?.lat();
              const lng = event.latLng?.lng();
              if (typeof lat === "number" && typeof lng === "number") {
                onPositionChange({ lat, lng });
              }
            }}
          />
        </Map>
      </APIProvider>
    </div>
  );
}

function MapFallback({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-600">
        <MapPin className="h-5 w-5" />
      </div>
      <div>
        <p className="font-semibold text-secondary">{title}</p>
        <p className="mt-1 text-sm text-secondary/60">{description}</p>
      </div>
      {action}
    </div>
  );
}
