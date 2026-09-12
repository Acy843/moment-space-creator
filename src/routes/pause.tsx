import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { MovaScreen, PrimaryButton, ScreenHeader, SelectChip } from "@/components/mova/screen";
import { useMova } from "@/lib/mova-store";

export const Route = createFileRoute("/pause")({
  head: () => ({
    meta: [
      { title: "Reschedule this reset | MOVA" },
      {
        name: "description",
        content:
          "Can't pause right now? Tell MOVA what's happening and it will move your reset instead of dropping it.",
      },
      { property: "og:title", content: "Reschedule this reset | MOVA" },
      { property: "og:description", content: "No problem. We'll adjust your next reset." },
    ],
  }),
  component: PauseScreen,
});

const reasons = [
  "With a patient/customer",
  "In a meeting",
  "Driving",
  "Safety-critical task",
  "Emergency",
  "Not possible right now",
  "Other",
];

function PauseScreen() {
  const navigate = useNavigate();
  const { currentReset, nextReset, rescheduleReset } = useMova();
  const [reason, setReason] = useState<string | null>(null);
  const [when, setWhen] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const confirm = async () => {
    const target = currentReset ?? nextReset;
    if (!target) {
      navigate({ to: "/home" });
      return;
    }
    const delay = when === "Remind me in 20 min" ? 20 : 10;
    setBusy(true);
    try {
      await rescheduleReset(target.id, delay, reason ?? "Not possible right now");
      navigate({ to: "/home" });
    } catch {
      setBusy(false);
    }
  };

  return (
    <MovaScreen withNav={false}>
      <ScreenHeader
        eyebrow="Rescheduling"
        title="No problem. What's happening?"
        subtitle="MOVA never cancels a reset — it finds a better moment."
        back="/reset"
      />

      <div className="mt-6 grid gap-2.5">
        {reasons.map((r) => (
          <SelectChip
            key={r}
            label={r}
            selected={reason === r}
            onClick={() => setReason(r)}
          />
        ))}
      </div>

      {reason && (
        <div className="animate-rise mt-6">
          <div className="frost rounded-[26px] p-5">
            <p className="text-[15px] font-semibold text-ink">We'll adjust your next reset.</p>
            <p className="mt-1.5 flex items-start gap-2 text-[12.5px] leading-relaxed text-soft">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-sagedeep" strokeWidth={1.75} />
              Your reason is used to learn when resets are realistic for you — not to report
              on you.
            </p>
            <div className="mt-4 grid gap-2.5">
              {["Remind me in 10 min", "Remind me in 20 min", "Choose a time"].map((w) => (
                <SelectChip key={w} label={w} selected={when === w} onClick={() => setWhen(w)} />
              ))}
            </div>
          </div>
          <PrimaryButton className="mt-4" onClick={confirm} disabled={busy}>
            {busy ? "Moving your reset…" : "Confirm"}
          </PrimaryButton>
        </div>
      )}
    </MovaScreen>
  );
}
