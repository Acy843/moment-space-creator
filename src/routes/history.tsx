import { createFileRoute } from "@tanstack/react-router";
import { Check, SkipForward } from "lucide-react";
import { FrostCard, MovaScreen, ScreenHeader } from "@/components/mova/screen";
import { useMova } from "@/lib/mova-store";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Reset history | MOVA" },
      {
        name: "description",
        content:
          "A calm, chronological record of the resets you took, rescheduled, and how each one felt.",
      },
      { property: "og:title", content: "Reset history | MOVA" },
      { property: "og:description", content: "Work. Reset. Return — your day in order." },
    ],
  }),
  component: History,
});

function History() {
  const { state, syncStatus } = useMova();

  return (
    <MovaScreen>
      <ScreenHeader
        eyebrow="History"
        title="Your resets"
        subtitle="Enough to notice a pattern — not enough to feel watched."
      />
      {syncStatus === "loading" && (
        <p className="mt-3 text-[11px] font-medium text-soft">Loading your resets…</p>
      )}
      {state.history.length === 0 && syncStatus !== "loading" && (
        <p className="mt-6 text-[13px] text-soft">
          No resets yet. Complete your first reset and it will appear here.
        </p>
      )}

      <p className="mt-6 text-[11px] font-semibold tracking-[0.2em] text-soft uppercase">
        Today
      </p>

      <div className="mt-3 space-y-2.5">
        {state.history.map((h) => (
          <FrostCard key={h.id} soft className="flex items-center gap-3.5 p-4">
            <span
              className={`grid size-9 shrink-0 place-items-center rounded-2xl ${
                h.status === "completed" ? "bg-sage/18 text-sagedeep" : "bg-mist text-soft"
              }`}
            >
              {h.status === "completed" ? (
                <Check className="size-4" strokeWidth={2} />
              ) : (
                <SkipForward className="size-4" strokeWidth={1.75} />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-[14px] font-semibold text-ink">{h.title}</p>
                <span className="shrink-0 text-[11px] font-medium text-soft">{h.time}</span>
              </div>
              <p className="mt-0.5 text-[11.5px] text-soft">
                {h.status === "completed"
                  ? `Feeling: ${h.feeling ?? "—"}`
                  : `Rescheduled — ${h.reason ?? "not possible"}`}
              </p>
            </div>
          </FrostCard>
        ))}
      </div>

      <p className="mt-8 text-[11px] font-semibold tracking-[0.2em] text-soft uppercase">
        Yesterday
      </p>
      <FrostCard className="mt-3 p-5">
        <p className="text-[13.5px] leading-relaxed text-ink">
          5 resets taken · 1 rescheduled during a patient handover.
        </p>
        <p className="mt-1.5 text-[12px] text-soft">
          Most helpful: a two-minute walk after your 3 PM round.
        </p>
      </FrostCard>
    </MovaScreen>
  );
}
