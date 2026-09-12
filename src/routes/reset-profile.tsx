import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { FrostCard, MovaScreen, Pill, ScreenHeader } from "@/components/mova/screen";
import { useMova } from "@/lib/mova-store";

export const Route = createFileRoute("/reset-profile")({
  head: () => ({
    meta: [
      { title: "Your MOVA Profile | MOVA" },
      {
        name: "description",
        content:
          "A summary of your work style, break availability and the reset types MOVA will prioritize for you.",
      },
      { property: "og:title", content: "Your MOVA Profile | MOVA" },
      {
        property: "og:description",
        content: "See how MOVA will shape your resets around your real workday.",
      },
    ],
  }),
  component: ResetProfile,
});

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-white/60 py-3.5 last:border-0">
      <p className="text-[10px] font-semibold tracking-[0.2em] text-soft uppercase">{label}</p>
      <p className="mt-1 text-[15px] font-medium text-ink">{value}</p>
    </div>
  );
}

function ResetProfile() {
  const { profile, displayOccupation, onboarded, authReady } = useMova();

  if (!authReady) {
    return (
      <MovaScreen withNav={false}>
        <div className="flex flex-1 items-center justify-center">
          <p className="text-[13px] text-soft">Loading your profile…</p>
        </div>
      </MovaScreen>
    );
  }

  const occupation = profile?.occupation || displayOccupation;
  const workStyle = profile?.workStyle ?? [];
  const breakRhythm = profile?.breakRhythm || "Not set yet";
  const constraints = profile?.constraints ?? [];

  return (
    <MovaScreen withNav={false}>
      <ScreenHeader
        eyebrow={onboarded ? "Profile ready" : "Profile preview"}
        title="Your MOVA Profile"
        subtitle="Built from what you told us — nothing else."
        back="/onboarding"
      />

      <FrostCard className="mt-6 px-5 py-2">
        <Row label="Occupation" value={occupation || "Not set yet"} />
        <Row
          label="Work style"
          value={workStyle.length ? workStyle.join(" + ") : "Not set yet"}
        />
        <Row label="Break availability" value={breakRhythm} />
        <div className="py-3.5">
          <p className="text-[10px] font-semibold tracking-[0.2em] text-soft uppercase">
            Preferred resets
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Pill>Movement</Pill>
            <Pill>Breathing</Pill>
            <Pill>Eye recovery</Pill>
          </div>
        </div>
      </FrostCard>

      <FrostCard soft className="mt-5 p-5">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-sagedeep" strokeWidth={1.75} />
          <p className="text-[11px] font-semibold tracking-[0.2em] text-sagedeep uppercase">
            What to expect
          </p>
        </div>
        <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink">
          Based on what you told us, we'll start with short resets that fit around your
          responsibilities. As you complete resets and check-ins, the suggestions become more
          aligned with your actual rhythm and work patterns.
        </p>
      </FrostCard>

      {constraints.length > 0 && (
        <div className="mt-5">
          <p className="text-[10px] font-semibold tracking-[0.2em] text-soft uppercase">
            Constraints we'll respect
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {constraints.map((c) => (
              <Pill key={c}>{c}</Pill>
            ))}
          </div>
        </div>
      )}

      <div className="mt-auto pt-8">
        <Link
          to="/home"
          className="block w-full rounded-2xl bg-sagedeep/95 px-5 py-4 text-center text-[15px] font-semibold text-white shadow-lg shadow-sagedeep/25 transition-all hover:bg-sagedeep active:scale-[0.99]"
        >
          Start My Day
        </Link>
      </div>
    </MovaScreen>
  );
}
