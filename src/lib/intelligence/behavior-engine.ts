import { getActivity } from "@/lib/mova-activities";
import type { CheckIn, MovaProfile, Reset } from "@/lib/mova-types";

export type BehaviorSummary = {
  bestCategory: string;
  bestActivityName: string;
  toughestPeriod: string;
  rhythmScore: number;
  completionRate: number;
  recommendationText: string;
  patternSummary: string;
  signals: string[];
};

export function buildBehaviorSummary(
  profile: MovaProfile | null,
  resets: Reset[],
  checkIns: CheckIn[],
): BehaviorSummary {
  const completed = resets.filter((reset) => reset.status === "completed");
  const total = resets.length || 1;
  const completionRate = completed.length === 0 ? 50 : Math.min(95, Math.round((completed.length / total) * 100));

  const categoryCounts = new Map<string, number>();
  for (const reset of completed) {
    const activity = getActivity(reset.activityId);
    const category = activity?.category ?? "movement";
    categoryCounts.set(category, (categoryCounts.get(category) ?? 0) + 1);
  }

  const bestCategory =
    [...categoryCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ??
    profile?.preferredActivityTypes[0] ??
    "movement";

  const preferredName =
    completed.length > 0
      ? (() => {
          const latest = [...completed].sort((a, b) => {
            const aTime = a.completedAt ?? a.scheduledFor;
            const bTime = b.completedAt ?? b.scheduledFor;
            return new Date(bTime).getTime() - new Date(aTime).getTime();
          })[0];
          return getActivity(latest?.activityId)?.name ?? "Movement reset";
        })()
      : profile?.movementPreference
        ? `${profile.movementPreference.charAt(0).toUpperCase()}${profile.movementPreference.slice(1)} reset`
        : "Movement reset";

  const toughestPeriod = inferToughestPeriod(resets, profile);
  const rhythmScore = Math.min(96, Math.max(48, completionRate + (checkIns.length > 0 ? 8 : 0)));

  const recommendationText = buildRecommendationText({
    bestCategory,
    bestActivityName: preferredName,
    toughestPeriod,
    completionRate,
    profile,
  });

  const patternSummary = buildPatternSummary({
    bestCategory,
    completionRate,
    toughestPeriod,
    preferredName,
  });

  const signals = [
    "Occupation",
    "Work environment",
    "Break availability",
    profile?.breakRhythm || "Your schedule",
    "Previous reset behaviour",
    "Self-reported fatigue",
    "Saved places",
    "Safety constraints",
  ];

  return {
    bestCategory,
    bestActivityName: preferredName,
    toughestPeriod,
    rhythmScore,
    completionRate,
    recommendationText,
    patternSummary,
    signals,
  };
}

export function buildBehaviorExplanation(summary: BehaviorSummary): string {
  return `${summary.bestActivityName} is the strongest pattern in your recent resets. ${summary.patternSummary} The plan is to lean into ${summary.bestCategory.toLowerCase()} around ${summary.toughestPeriod.toLowerCase()}.`;
}

function inferToughestPeriod(resets: Reset[], profile: MovaProfile | null): string {
  const times = resets
    .filter((reset) => reset.scheduledFor)
    .map((reset) => new Date(reset.scheduledFor).getHours());

  if (times.length === 0) {
    const breakRhythm = profile?.breakRhythm ?? "balanced";
    if (breakRhythm === "frequent") return "Late morning";
    if (breakRhythm === "long") return "Mid-afternoon";
    return "Late morning";
  }

  const averageHour = Math.round(times.reduce((sum, hour) => sum + hour, 0) / times.length);
  if (averageHour >= 13) return "Mid-afternoon";
  if (averageHour >= 10) return "Late morning";
  return "Early afternoon";
}

function buildRecommendationText(input: {
  bestCategory: string;
  bestActivityName: string;
  toughestPeriod: string;
  completionRate: number;
  profile: MovaProfile | null;
}): string {
  const categoryLabel = input.bestCategory.charAt(0).toUpperCase() + input.bestCategory.slice(1);
  const strength = input.completionRate >= 70 ? "A strong pattern" : "A useful pattern";
  const workStyle = input.profile?.breakRhythm ? ` for ${input.profile.breakRhythm} break timing` : "";

  return `${strength} is emerging around ${input.toughestPeriod.toLowerCase()}: ${categoryLabel}-style resets are helping most${workStyle}. Keep using ${input.bestActivityName.toLowerCase()} before the work dip deepens.`;
}

function buildPatternSummary(input: {
  bestCategory: string;
  completionRate: number;
  toughestPeriod: string;
  preferredName: string;
}): string {
  const categoryLabel = input.bestCategory.charAt(0).toUpperCase() + input.bestCategory.slice(1);
  return `${categoryLabel} resets are your most reliable pattern, with ${input.completionRate}% of your recent resets landing successfully before ${input.toughestPeriod.toLowerCase()}. ${input.preferredName} is the strongest cue for your next reset.`;
}
