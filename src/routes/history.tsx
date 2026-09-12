import { createFileRoute } from "@tanstack/react-router";
import { Check, SkipForward, XCircle } from "lucide-react";
import { FrostCard, MovaScreen, ScreenHeader } from "@/components/mova/screen";
import { activityById } from "@/lib/mova-activities";
import { useMova } from "@/lib/mova-store";
import type { CheckIn, Reset } from "@/lib/mova-types";

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

function timeLabel(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function statusCopy(r: Reset, feelingByReset: Map<string, string>): string {
  if (r.status === "completed") {
    const f = feelingByReset.get(r.id);
    return f ? `Feeling: ${f}` : "Reset completed";
  }
  if (r.status === "rescheduled") return `Rescheduled — ${r.rescheduleReason ?? "not possible"}`;
  if (r.status === "skipped") return "Skipped";
  if (r.status === "active") return "In progress";
  return "Scheduled";
}

function History() {
  const { state, syncStatus } = useMova();

  const feelingByReset = new Map<string, string>();
  for (const c of state.checkIns as CheckIn[]) {
    if (!feelingByReset.has(c.resetId)) feelingByReset.set(c.resetId, c.feeling);
  }
  const finished = (state.resets as Reset[]).filter((r) => r.status !== "scheduled");

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
      {finished.length === 0 && syncStatus !== "loading" && (
        <p className="mt-6 text-[13px] text-soft">
          No resets yet. Complete your first reset and it will appear here.
        </p>
      )}

      <p className="mt-6 text-[11px] font-semibold tracking-[0.2em] text-soft uppercase">
        Recent
      </p>

      <div className="mt-3 space-y-2.5">
        {finished.map((r) => {
          const activity = activityById(r.activityId);
          return (
            <FrostCard key={r.id} soft className="flex items-center gap-3.5 p-4">
              <span
                className={`grid size-9 shrink-0 place-items-center rounded-2xl ${
                  r.status === "completed"
                    ? "bg-sage/18 text-sagedeep"
                    : r.status === "skipped"
                      ? "bg-mist text-soft"
                      : "bg-mist text-soft"
                }`}
              >
                {r.status === "completed" ? (
                  <Check className="size-4" strokeWidth={2} />
                ) : r.status === "skipped" ? (
                  <XCircle className="size-4" strokeWidth={1.75} />
                ) : (
                  <SkipForward className="size-4" strokeWidth={1.75} />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-[14px] font-semibold text-ink">{activity?.name ?? "Reset"}</p>
                  <span className="shrink-0 text-[11px] font-medium text-soft">
                    {timeLabel(r.completedAt ?? r.rescheduledAt ?? r.scheduledFor)}
                  </span>
                </div>
                <p className="mt-0.5 text-[11.5px] text-soft">{statusCopy(r, feelingByReset)}</p>
              </div>
            </FrostCard>
          );
        })}
      </div>
    </MovaScreen>
  );
}
