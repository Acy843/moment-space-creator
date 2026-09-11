import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Brain, ShieldCheck } from "lucide-react";
import { FrostCard, MovaScreen, Pill } from "@/components/mova/screen";
import { useMova } from "@/lib/mova-store";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Today's reset | MOVA" },
      {
        name: "description",
        content:
          "Your MOVA home: next predicted reset, today's rhythm and the resets you've already taken.",
      },
      { property: "og:title", content: "Today's reset | MOVA" },
      {
        property: "og:description",
        content: "Let's make space for you today. Work. Reset. Return.",
      },
    ],
  }),
  component: HomeScreen,
});

const timeline = [
  { time: "8:00", label: "Work", tone: "work" },
  { time: "9:20", label: "Reset", tone: "done" },
  { time: "11:00", label: "Work", tone: "work" },
  { time: "12:15", label: "Reset", tone: "done" },
  { time: "2:00", label: "Upcoming reset", tone: "next" },
  { time: "4:30", label: "Reflection", tone: "work" },
] as const;

function HomeScreen() {
  const { state } = useMova();
  const p = state.profile;

  return (
    <MovaScreen>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="frost grid size-11 place-items-center rounded-2xl">
            <span className="animate-breathe size-4 rounded-full bg-gradient-to-br from-sage to-sky" />
          </div>
          <div>
            <p className="text-[15px] font-extrabold tracking-[0.32em] text-ink">MOVA</p>
            <p className="text-[10px] font-medium tracking-[0.2em] text-soft uppercase">
              wellness rhythm
            </p>
          </div>
        </div>
        <Link to="/profile" className="frost-2 grid size-11 place-items-center rounded-2xl">
          <span className="text-sm font-semibold text-sagedeep">
            {p.name.slice(0, 2).toUpperCase()}
          </span>
        </Link>
      </div>

      <div className="animate-rise mt-7">
        <p className="text-[11px] font-semibold tracking-[0.24em] text-sagedeep uppercase">
          Good morning
        </p>
        <h1 className="mt-1 font-display text-[30px] leading-[1.05] font-semibold text-ink">
          {p.name}, let's make space for you.
        </h1>
        <p className="mt-2 text-[13px] leading-relaxed text-soft">
          Pause before you break. Small pauses, better days.
        </p>
      </div>

      <FrostCard className="mt-6 p-5">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold tracking-[0.2em] text-soft uppercase">
            Today's reset
          </p>
          <span className="rounded-full bg-sage/15 px-2.5 py-1 text-[10px] font-semibold text-sagedeep">
            AI scheduled
          </span>
        </div>
        <div className="mt-4 flex items-center gap-5">
          <div className="relative grid size-24 shrink-0 place-items-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sage/25 to-sky/25" />
            <div className="animate-breathe absolute inset-1.5 rounded-full bg-white/50" />
            <div className="relative text-center">
              <p className="font-display text-[26px] leading-none font-bold text-ink">38</p>
              <p className="text-[9px] font-semibold tracking-[0.15em] text-soft uppercase">
                min
              </p>
            </div>
          </div>
          <div className="min-w-0">
            <p className="text-[16px] font-semibold text-ink">Shoulder + breathing reset</p>
            <p className="mt-1.5 text-[12px] leading-relaxed text-soft">
              Your next reset is based on your work pattern and previous activity.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <Pill>Movement</Pill>
              <Pill>Breathing</Pill>
              <Pill>Eye</Pill>
            </div>
          </div>
        </div>
        <Link
          to="/reset"
          className="mt-4 block w-full rounded-2xl bg-sagedeep/95 px-5 py-3.5 text-center text-[14px] font-semibold text-white shadow-lg shadow-sagedeep/25 transition-all hover:bg-sagedeep active:scale-[0.99]"
        >
          Preview my reset moment
        </Link>
      </FrostCard>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <FrostCard soft className="p-3">
          <p className="font-display text-[20px] font-bold text-ink">4</p>
          <p className="text-[10px] leading-tight font-medium text-soft">resets taken</p>
        </FrostCard>
        <FrostCard soft className="p-3">
          <p className="font-display text-[20px] font-bold text-ink">2h 14m</p>
          <p className="text-[10px] leading-tight font-medium text-soft">
            continuous work avoided
          </p>
        </FrostCard>
        <FrostCard soft className="p-3">
          <p className="font-display text-[20px] font-bold text-ink">78%</p>
          <p className="text-[10px] leading-tight font-medium text-soft">rhythm kept</p>
        </FrostCard>
      </div>

      <FrostCard className="mt-5 p-5">
        <p className="text-[11px] font-semibold tracking-[0.2em] text-soft uppercase">
          Your day
        </p>
        <div className="mt-4 flex items-center gap-1.5">
          <div className="h-1.5 flex-1 rounded-full bg-mist" />
          <div className="h-1.5 w-1/4 rounded-full bg-gradient-to-r from-sage to-sky" />
          <div className="h-1.5 w-1/3 rounded-full bg-mist" />
          <div className="h-1.5 w-1/5 rounded-full bg-gradient-to-r from-sage to-sky" />
          <div className="h-1.5 flex-1 rounded-full bg-mist" />
        </div>
        <div className="mt-3 flex justify-between text-[9px] font-medium tracking-wider text-soft uppercase">
          <span>8:00</span>
          <span>12:00</span>
          <span>16:00</span>
        </div>
        <div className="mt-4 space-y-2.5">
          {timeline.map((t) => (
            <div key={t.time + t.label} className="flex items-center gap-3">
              <span
                className={`size-2 rounded-full ${
                  t.tone === "done"
                    ? "bg-sage"
                    : t.tone === "next"
                      ? "border border-sky bg-white/70"
                      : "bg-mist"
                }`}
              />
              <span className="text-[12px] font-medium text-ink">{t.time}</span>
              <span className="text-[12px] text-soft">{t.label}</span>
              {t.tone === "done" && (
                <span className="ml-auto text-[11px] font-semibold text-sagedeep">✓</span>
              )}
              {t.tone === "next" && (
                <span className="ml-auto text-[11px] font-medium text-soft">soon</span>
              )}
            </div>
          ))}
        </div>
      </FrostCard>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <Link to="/library" className="frost-2 rounded-2xl p-4">
          <BookOpen className="size-4 text-sagedeep" strokeWidth={1.75} />
          <p className="mt-2 text-[13px] font-semibold text-ink">Reset Library</p>
          <p className="text-[11px] text-soft">Filtered for your work</p>
        </Link>
        <Link to="/learning" className="frost-2 rounded-2xl p-4">
          <Brain className="size-4 text-sagedeep" strokeWidth={1.75} />
          <p className="mt-2 text-[13px] font-semibold text-ink">AI rhythm</p>
          <p className="text-[11px] text-soft">What MOVA learned</p>
        </Link>
      </div>

      <Link
        to="/privacy"
        className="mt-5 flex items-center gap-3 rounded-2xl bg-sagedeep/90 px-4 py-3.5 text-white shadow-lg shadow-sagedeep/30"
      >
        <span className="grid size-8 place-items-center rounded-xl bg-white/15">
          <ShieldCheck className="size-4" strokeWidth={1.75} />
        </span>
        <div className="min-w-0">
          <p className="text-[12px] font-semibold">Work. Reset. Return.</p>
          <p className="text-[11px] text-white/70">
            AI adapts timing to your live workload — you stay in control.
          </p>
        </div>
      </Link>
    </MovaScreen>
  );
}
