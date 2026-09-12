import { createFileRoute } from "@tanstack/react-router";
import { Camera, Database, Eye, Building2 } from "lucide-react";
import { FrostCard, MovaScreen, ScreenHeader } from "@/components/mova/screen";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "You're in control | MOVA" },
      {
        name: "description",
        content:
          "MOVA does not watch you continuously. Choose what you share, how resets are verified, and pause anytime.",
      },
      { property: "og:title", content: "You're in control | MOVA" },
      {
        property: "og:description",
        content: "Least invasive verification, private check-ins, no workplace surveillance.",
      },
    ],
  }),
  component: Privacy,
});

const promises = [
  "MOVA does not continuously record or watch you.",
  "You choose what information you provide.",
  "Camera-based verification is always optional.",
  "The system uses the least invasive verification available.",
  "You can pause or adjust MOVA at any time.",
  "Workplace administrators never receive your emotional check-ins.",
];

const controls = [
  { icon: Database, label: "Personal data", state: "You decide" },
  { icon: Building2, label: "Workplace data", state: "Aggregated only" },
  { icon: Eye, label: "Adaptive personalization", state: "On" },
  { icon: Camera, label: "Verification settings", state: "Motion only" },
];

function Privacy() {
  return (
    <MovaScreen>
      <ScreenHeader
        eyebrow="Privacy"
        title="You're in control"
        subtitle="Wellbeing support should never feel like monitoring."
      />

      <FrostCard className="mt-6 p-5">
        <div className="space-y-3">
          {promises.map((p) => (
            <div key={p} className="flex items-start gap-2.5">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-sage" />
              <p className="text-[13px] leading-relaxed text-ink">{p}</p>
            </div>
          ))}
        </div>
      </FrostCard>

      <div className="mt-5 grid gap-2.5">
        {controls.map(({ icon: Icon, label, state }) => (
          <FrostCard key={label} soft className="flex items-center gap-3.5 p-4">
            <span className="grid size-9 shrink-0 place-items-center rounded-2xl bg-sage/18 text-sagedeep">
              <Icon className="size-4" strokeWidth={1.75} />
            </span>
            <p className="flex-1 text-[13.5px] font-semibold text-ink">{label}</p>
            <span className="text-[11.5px] font-medium text-soft">{state}</span>
          </FrostCard>
        ))}
      </div>

      <FrostCard soft className="mt-5 p-5">
        <p className="text-[12.5px] leading-relaxed text-soft">
          Verification uses only the information needed for a single reset, and it stops the
          moment the reset ends.
        </p>
      </FrostCard>
    </MovaScreen>
  );
}
