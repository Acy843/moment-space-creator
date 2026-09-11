import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { FrostCard, MovaScreen, ScreenHeader } from "@/components/mova/screen";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "Your Reset Insights | MOVA" },
      {
        name: "description",
        content:
          "See which resets help you most, when fatigue peaks, and what MOVA suggests for tomorrow.",
      },
      { property: "og:title", content: "Your Reset Insights | MOVA" },
      { property: "og:description", content: "Small pauses can reveal big patterns." },
    ],
  }),
  component: Insights,
});

const week = [
  { day: "Mon", work: 76, resets: 4, fatigue: 42 },
  { day: "Tue", work: 84, resets: 3, fatigue: 58 },
  { day: "Wed", work: 62, resets: 5, fatigue: 34 },
  { day: "Thu", work: 90, resets: 2, fatigue: 71 },
  { day: "Fri", work: 70, resets: 4, fatigue: 40 },
  { day: "Sat", work: 45, resets: 3, fatigue: 28 },
  { day: "Sun", work: 30, resets: 2, fatigue: 20 },
];

function Insights() {
  return (
    <MovaScreen>
      <ScreenHeader
        eyebrow="Insights"
        title="Your Reset Insights"
        subtitle="Small pauses can reveal big patterns."
      />

      <FrostCard className="mt-6 p-5">
        <p className="text-[11px] font-semibold tracking-[0.2em] text-soft uppercase">
          Your best reset
        </p>
        <p className="mt-1.5 font-display text-[24px] font-semibold text-ink">Movement</p>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-soft">
          You reported feeling better after 82% of your movement resets.
        </p>
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-mist">
          <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-sage to-sky" />
        </div>
      </FrostCard>

      <div className="mt-4 grid gap-4">
        <FrostCard soft className="p-5">
          <p className="text-[11px] font-semibold tracking-[0.2em] text-soft uppercase">
            Your toughest period
          </p>
          <p className="mt-1.5 font-display text-[22px] font-semibold text-ink">2:00–4:00 PM</p>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-soft">
            You tend to report higher fatigue during this period.
          </p>
        </FrostCard>

        <FrostCard soft className="p-5">
          <p className="text-[11px] font-semibold tracking-[0.2em] text-soft uppercase">
            Your reset pattern
          </p>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink">
            You've been taking fewer breaks on high-workload days.
          </p>
        </FrostCard>
      </div>

      <FrostCard className="mt-4 p-5">
        <p className="text-[11px] font-semibold tracking-[0.2em] text-soft uppercase">
          This week
        </p>
        <div className="mt-5 flex items-end justify-between gap-2">
          {week.map((d) => (
            <div key={d.day} className="flex flex-1 flex-col items-center gap-1.5">
              <div className="flex h-28 w-full items-end justify-center gap-[3px]">
                <div
                  className="w-[7px] rounded-t-full bg-mist"
                  style={{ height: `${d.work}%` }}
                />
                <div
                  className="w-[7px] rounded-t-full bg-gradient-to-t from-sage to-sky"
                  style={{ height: `${d.resets * 18}%` }}
                />
                <div
                  className="w-[7px] rounded-t-full bg-sagedeep/35"
                  style={{ height: `${d.fatigue}%` }}
                />
              </div>
              <span className="text-[10px] font-medium text-soft">{d.day}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-[10.5px] text-soft">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-mist" /> Work periods
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-sage" /> Reset moments
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-sagedeep/40" /> Reported fatigue
          </span>
        </div>
      </FrostCard>

      <div className="mt-4 rounded-[26px] bg-sagedeep/92 p-5 text-white shadow-lg shadow-sagedeep/25">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4" strokeWidth={1.75} />
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase">AI suggestion</p>
        </div>
        <p className="mt-2.5 text-[13.5px] leading-relaxed text-white/90">
          Tomorrow, I recommend an additional short reset between 2:15 and 2:45 PM.
        </p>
      </div>
    </MovaScreen>
  );
}
