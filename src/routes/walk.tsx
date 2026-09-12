import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Footprints, MapPin } from "lucide-react";
import { FrostCard, MovaScreen, PrimaryButton, ScreenHeader } from "@/components/mova/screen";
import { haversineMeters, loadMiles, loadPlaces } from "@/lib/mova-demo-geo";
import { metersToMiles, nearestPlace, saveMiles, todayKey } from "@/lib/mova-demo-geo";

export const Route = createFileRoute("/walk")({
  head: () => ({
    meta: [
      { title: "Walk & location | MOVA" },
      { name: "description", content: "Demo walk tracker. GPS only while you press Start. Miles + place demo." },
    ],
  }),
  component: WalkScreen,
});

function WalkScreen() {
  const [miles, setMiles] = useState(0);
  const [tracking, setTracking] = useState(false);
  const [place, setPlace] = useState("Unknown");
  const [err, setErr] = useState("");
  const watchId = useRef<number | null>(null);
  const last = useRef<{ lat: number; lon: number } | null>(null);
  const key = useRef(todayKey());

  useEffect(() => {
    setMiles(loadMiles(key.current));
    return () => {
      if (watchId.current != null) navigator.geolocation?.clearWatch(watchId.current);
    };
  }, []);

  const start = () => {
    setErr("");
    if (!navigator.geolocation) {
      setErr("This device has no GPS. Demo still shows saved places.");
      return;
    }
    last.current = null;
    setTracking(true);
    watchId.current = navigator.geolocation.watchPosition(
      (pos) => {
        const cur = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        const places = loadPlaces();
        const near = nearestPlace(cur, places, 250);
        setPlace(near ? near.label : "On the move");
        if (last.current) {
          const d = haversineMeters(last.current, cur);
          if (d > 2 && d < 500) {
            setMiles((m) => {
              const nm = m + metersToMiles(d);
              saveMiles(key.current, nm);
              return nm;
            });
          }
        }
        last.current = cur;
      },
      () => {
        setErr("Location blocked. Allow it for the live demo, or use Set places below.");
        setTracking(false);
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 },
    );
  };

  const stop = () => {
    if (watchId.current != null) navigator.geolocation.clearWatch(watchId.current);
    watchId.current = null;
    setTracking(false);
  };

  return (
    <MovaScreen>
      <ScreenHeader
        eyebrow="Location · demo"
        title="Walk & place"
        subtitle="GPS runs only while tracking. Miles reset daily. Places are yours."
      />
      <FrostCard className="mt-6 p-5 text-center">
        <Footprints className="mx-auto size-6 text-sagedeep" strokeWidth={1.75} />
        <p className="mt-2 font-display text-[44px] font-bold text-ink">{miles.toFixed(2)}</p>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-soft">miles today</p>
        <p className="mt-2 flex items-center justify-center gap-1.5 text-[12.5px] text-soft">
          <MapPin className="size-3.5" /> {place}
        </p>
        {err && <p className="mt-2 text-[12px] text-soft">{err}</p>}
      </FrostCard>
      <div className="mt-4">
        {!tracking ? (
          <PrimaryButton onClick={start}>Start walk</PrimaryButton>
        ) : (
          <PrimaryButton onClick={stop}>Stop</PrimaryButton>
        )}
      </div>
      <FrostCard soft className="mt-4 p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-soft">Demo tip</p>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-soft">
          Give a walking reset, press Start, walk a little. If you are near your saved
          Work place we suggest rescheduling desk resets — that is the whole location story.
        </p>
      </FrostCard>
    </MovaScreen>
  );
}
