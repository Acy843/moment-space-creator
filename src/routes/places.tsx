import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Home, Briefcase, GraduationCap, MapPin } from "lucide-react";
import { FrostCard, MovaScreen, PrimaryButton, ScreenHeader } from "@/components/mova/screen";
import { loadPlaces, savePlaces } from "@/lib/mova-demo-geo";
import type { NamedPlace, PlaceId } from "@/lib/mova-demo-geo";

export const Route = createFileRoute("/places")({
  head: () => ({
    meta: [
      { title: "My places | MOVA" },
      { name: "description", content: "Save Home, Work, School once. Used for the location reschedule demo." },
    ],
  }),
  component: PlacesScreen,
});

const CARDS: { id: PlaceId; label: string; icon: typeof Home; hint: string }[] = [
  { id: "home", label: "Home", icon: Home, hint: "Quiet resets, evening wind-down" },
  { id: "work", label: "Work", icon: Briefcase, hint: "Short desk-friendly resets" },
  { id: "school", label: "School", icon: GraduationCap, hint: "Between-class resets" },
];

function PlacesScreen() {
  const [saved, setSaved] = useState<NamedPlace[]>(() => loadPlaces());
  const [msg, setMsg] = useState("");

  const has = (id: PlaceId) => saved.some((p) => p.id === id);

  const saveCurrent = (id: PlaceId, label: string) => {
    setMsg("");
    if (!navigator.geolocation) {
      setMsg("No GPS on this device — places demo needs a phone or laptop GPS.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const next = [
          ...saved.filter((p) => p.id !== id),
          { id, label, lat: pos.coords.latitude, lon: pos.coords.longitude },
        ];
        setSaved(next);
        savePlaces(next);
        setMsg(`${label} saved. Walk there later and MOVA will recognise it.`);
      },
      () => setMsg("Location blocked. Allow it once to save this place."),
      { enableHighAccuracy: true, timeout: 15000 },
    );
  };

  return (
    <MovaScreen>
      <ScreenHeader
        eyebrow="Places · demo"
        title="Home, Work, School"
        subtitle="Save each place once. MOVA uses it to reschedule, not to watch you."
      />
      <div className="mt-6 grid gap-2.5">
        {CARDS.map(({ id, label, icon: Icon, hint }) => (
          <FrostCard key={id} soft className="flex items-center gap-3.5 p-4">
            <span className="grid size-9 shrink-0 place-items-center rounded-2xl bg-sage/18 text-sagedeep">
              <Icon className="size-4" strokeWidth={1.75} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13.5px] font-semibold text-ink">
                {label} {has(id) ? "· saved" : ""}
              </p>
              <p className="text-[11.5px] text-soft">{hint}</p>
            </div>
            <button
              type="button"
              onClick={() => saveCurrent(id, label)}
              className="shrink-0 rounded-xl bg-sagedeep/95 px-3.5 py-2 text-[12px] font-semibold text-white"
            >
              {has(id) ? "Update" : "Save here"}
            </button>
          </FrostCard>
        ))}
      </div>
      {msg && (
        <p className="mt-3 flex items-center gap-1.5 text-[12.5px] text-soft">
          <MapPin className="size-3.5" /> {msg}
        </p>
      )}
      <div className="mt-4">
        <PrimaryButton onClick={() => savePlaces([])}>Clear places (demo reset)</PrimaryButton>
      </div>
    </MovaScreen>
  );
}
