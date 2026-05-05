import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { GOOGLE_MAPS_KEY } from "@/lib/constants";
import type { TrackingResponse } from "@/types/order.types";

export function TrackingView({ tracking }: { tracking: TrackingResponse["tracking"] }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="overflow-hidden rounded-[32px] bg-white p-4 shadow-soft">
        <div className="h-72 overflow-hidden rounded-[24px]">
          <APIProvider apiKey={GOOGLE_MAPS_KEY}>
            <Map defaultCenter={{ lat: 28.6139, lng: 77.209 }} defaultZoom={5} gestureHandling="greedy">
              <Marker position={{ lat: 28.6139, lng: 77.209 }} />
              <Marker position={{ lat: 19.076, lng: 72.8777 }} />
            </Map>
          </APIProvider>
        </div>
      </div>
      <div className="rounded-[32px] bg-white p-6 shadow-soft">
        <h3 className="text-lg font-semibold text-secondary">Tracking Updates</h3>
        <p className="mt-2 text-sm text-secondary/55">AWB: {tracking?.awb_code ?? "Pending"} · {tracking?.courier_name ?? "Threads Logistics"}</p>
        <div className="mt-5 space-y-4">
          {(tracking?.shipment_track_activities ?? []).map((event, index) => (
            <div key={`${event.activity}-${index}`} className="border-l-2 border-primary/30 pl-4">
              <p className="font-medium text-secondary">{event.activity}</p>
              <p className="text-sm text-secondary/55">{event.date}</p>
              {event.location ? <p className="text-sm text-secondary/45">{event.location}</p> : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
