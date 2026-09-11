import { createFileRoute } from "@tanstack/react-router";
import { Check, X } from "lucide-react";
import { FrostCard, MovaScreen, ScreenHeader } from "@/components/mova/screen";
import { useMova } from "@/lib/mova-store";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "Your Reset Library | MOVA" },
      {
        name: "description",
        content:
          "Physical, mental, screen recovery and hydration resets, filtered for your occupation and work environment.",
      },
      { property: "og:title", content: "Your Reset Library | MOVA" },
      { property: "og:description", content: "Only the resets your shift actually allows." },
    ],
  }),
  component: Library,
});

const groups = [
  {
    title: "Physical",
    items: ["Shoulder release", "Neck stretch", "Short walk", "Posture reset"],
  },
  {
    title: "Mental",
    items: ["Breathing", "Grounding", "30-second mental reset", "Guided reflection"],
  },
  {
    title: "Screen recovery",
    items: ["Eye reset", "Look-away exercise", "Hand/wrist reset"],
  },
  { title: "Hydration", items: ["Water reminder"] },
];

function Library() {
  const { state } = useMova();

  return (
    <MovaScreen>
      <ScreenHeader
        eyebrow="Library"
        title="Your Reset Library"
        subtitle={`Filtered for ${state.profile.occupation.toLowerCase()} work and your environment.`}
      />

      <FrostCard className="mt-6 p-5">
        <p className="text-[11px] font-semibold tracking-[0.2em] text-sagedeep uppercase">
          Recommended
        </p>
        <div className="mt-3 space-y-2">
          {[
            "30-second breathing",
            "Shoulder release",
            "Hydration",
            "Mental decompression",
          ].map((r) => (
            <div key={r} className="flex items-center gap-2.5">
              <Check className="size-4 text-sagedeep" strokeWidth={2} />
              <span className="text-[13.5px] text-ink">{r}</span>
            </div>
          ))}
        </div>

        <p className="mt-5 text-[11px] font-semibold tracking-[0.2em] text-soft uppercase">
          Unavailable during active work
        </p>
        <div className="mt-3 space-y-2">
          {["Phone-dependent activities", "Activities requiring leaving patient area"].map(
            (r) => (
              <div key={r} className="flex items-center gap-2.5">
                <X className="size-4 text-soft" strokeWidth={2} />
                <span className="text-[13.5px] text-soft">{r}</span>
              </div>
            ),
          )}
        </div>
      </FrostCard>

      <div className="mt-6 space-y-5">
        {groups.map((g) => (
          <div key={g.title}>
            <p className="text-[11px] font-semibold tracking-[0.2em] text-soft uppercase">
              {g.title}
            </p>
            <div className="mt-2.5 grid gap-2.5">
              {g.items.map((item) => (
                <FrostCard key={item} soft className="flex items-center justify-between p-4">
                  <span className="text-[13.5px] font-medium text-ink">{item}</span>
                  <span className="text-[11px] font-medium text-soft">60s</span>
                </FrostCard>
              ))}
            </div>
          </div>
        ))}
      </div>
    </MovaScreen>
  );
}
