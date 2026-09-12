import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MovaScreen, PrimaryButton, ScreenHeader, SelectChip } from "@/components/mova/screen";
import { useMova } from "@/lib/mova-store";

export const Route = createFileRoute("/checkin")({
  head: () => ({
    meta: [
      { title: "How do you feel? | MOVA" },
      {
        name: "description",
        content:
          "A two-tap check-in after each reset. Your answer stays private and teaches MOVA what actually helps you.",
      },
      { property: "og:title", content: "How do you feel? | MOVA" },
      { property: "og:description", content: "Your check-ins shape tomorrow's resets." },
    ],
  }),
  component: CheckIn,
});

const feelings = [
  { emoji: "😫", label: "Still drained" },
  { emoji: "😐", label: "About the same" },
  { emoji: "🙂", label: "Better" },
  { emoji: "😌", label: "Much better" },
];

const needs = [
  "More energy",
  "Less stress",
  "Better focus",
  "Physical movement",
  "Quiet",
  "Water",
  "Another short break",
];

function CheckIn() {
  const navigate = useNavigate();
  const { addEntry, setCheckIn } = useMova();
  const [feeling, setFeeling] = useState<string | null>("Better");
  const [picked, setPicked] = useState<string[]>([]);

  const done = () => {
    setCheckIn(feeling ?? "Better", picked);
    addEntry({
      title: "Shoulder + breathing reset",
      kind: "Breathing",
      status: "completed",
      feeling: feeling ?? "Better",
    });
    navigate({ to: "/learning" });
  };

  return (
    <MovaScreen withNav={false}>
      <ScreenHeader
        eyebrow="Post-reset"
        title="How do you feel?"
        subtitle="Only you see this. It teaches MOVA what works for you."
        back="/verify"
      />

      <div className="mt-6 grid grid-cols-2 gap-3">
        {feelings.map((f) => (
          <button
            key={f.label}
            type="button"
            onClick={() => setFeeling(f.label)}
            className={`rounded-[24px] px-4 py-6 text-center transition-all duration-200 ${
              feeling === f.label
                ? "bg-sagedeep/95 text-white shadow-lg shadow-sagedeep/25"
                : "frost-2 text-ink"
            }`}
          >
            <span className="text-[34px] leading-none">{f.emoji}</span>
            <p className="mt-2.5 text-[13px] font-semibold">{f.label}</p>
          </button>
        ))}
      </div>

      <p className="mt-8 text-[15px] font-semibold text-ink">What do you need right now?</p>
      <p className="text-[12px] text-soft">Optional</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {needs.map((n) => (
          <SelectChip
            key={n}
            label={n}
            selected={picked.includes(n)}
            onClick={() =>
              setPicked(picked.includes(n) ? picked.filter((v) => v !== n) : [...picked, n])
            }
          />
        ))}
      </div>

      <div className="mt-auto pt-10">
        <PrimaryButton onClick={done}>Done</PrimaryButton>
      </div>
    </MovaScreen>
  );
}
