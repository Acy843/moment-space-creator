import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { FrostCard, MovaScreen, ScreenHeader } from "@/components/mova/screen";
import { buildBehaviorSummary, buildBehaviorExplanation } from "@/lib/intelligence/behavior-engine";
import { useMova } from "@/lib/mova-store";

export const Route = createFileRoute("/learning")({
  head: () => ({
    meta: [
      { title: "Your reset pattern | MOVA" },
      {
        name: "description",
        content:
          "How MOVA uses your reset history and check-ins to suggest the right rhythm for your day.",
      },
      { property: "og:title", content: "Your reset pattern | MOVA" },
      {
        property: "og:description",
        content: "MOVA is not a timer — it adapts to your shift, your limits and your feedback.",
      },
    ],
  }),
  component: Learning,
});

function Learning() {
  const { state, profile, resets } = useMova();
  const summary = buildBehaviorSummary(profile, resets, state.checkIns);

  return (
    <MovaScreen>
      <ScreenHeader
        eyebrow="Personalization"
        title="Your reset pattern"
        subtitle="Your schedule is grounded in actual reset history and check-ins."
      />

      <FrostCard className="mt-6 px-5 py-2">
        {[
          ["Work pattern", summary.toughestPeriod],
          ["Best reset", summary.bestActivityName],
          ["Most difficult period", summary.toughestPeriod],
          ["Typical break availability", profile?.breakRhythm || "Not set yet"],
          [
            "Latest check-in",
            state.lastFeeling ? `You felt "${state.lastFeeling}"` : "Awaiting your next reset",
          ],
        ].map(([label, value]) => (
          <div key={label} className="border-b border-white/60 py-3.5 last:border-0">
            <p className="text-[10px] font-semibold tracking-[0.2em] text-soft uppercase">
              {label}
            </p>
            <p className="mt-1 text-[15px] font-medium text-ink">{value}</p>
          </div>
        ))}
      </FrostCard>

      <div className="mt-5 rounded-[26px] bg-sagedeep/92 p-5 text-white shadow-lg shadow-sagedeep/25">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4" strokeWidth={1.75} />
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase">
            Recommendation
          </p>
        </div>
        <p className="mt-2.5 text-[13.5px] leading-relaxed text-white/90">
          {summary.recommendationText}
        </p>
      </div>

      <FrostCard soft className="mt-5 p-5">
        <p className="text-[11px] font-semibold tracking-[0.2em] text-soft uppercase">
          What MOVA considers
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {summary.signals.map((s) => (
            <span
              key={s}
              className="rounded-full bg-white/70 px-2.5 py-1 text-[10.5px] font-medium text-sagedeep"
            >
              {s}
            </span>
          ))}
        </div>
        <div className="mt-4 space-y-1.5 text-[12.5px] leading-relaxed text-soft">
          <p>
            <span className="font-semibold text-ink">When</span> a reset is worth suggesting
          </p>
          <p>
            <span className="font-semibold text-ink">What</span> kind of reset suits the moment
          </p>
          <p>
            <span className="font-semibold text-ink">How</span> lightly it should be verified
          </p>
        </div>
      </FrostCard>

      <FrostCard soft className="mt-5 p-5">
        <p className="text-[11px] font-semibold tracking-[0.2em] text-soft uppercase">
          Later today
        </p>
        <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink">
          {buildBehaviorExplanation(summary)}
        </p>
      </FrostCard>

      <Link
        to="/home"
        className="mt-6 block w-full rounded-2xl bg-sagedeep/95 px-5 py-4 text-center text-[15px] font-semibold text-white shadow-lg shadow-sagedeep/25"
      >
        Sounds good
      </Link>
    </MovaScreen>
  );
}
