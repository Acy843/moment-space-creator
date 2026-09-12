import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bell,
  Briefcase,
  CalendarClock,
  ChevronRight,
  CircleCheck,
  Lock,
  PauseCircle,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { FrostCard, MovaScreen, ScreenHeader } from "@/components/mova/screen";
import { useMova } from "@/lib/mova-store";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile & settings | MOVA" },
      {
        name: "description",
        content:
          "Adjust your occupation, work schedule, reset preferences, verification, privacy and safety settings.",
      },
      { property: "og:title", content: "Profile & settings | MOVA" },
      { property: "og:description", content: "Your MOVA, tuned to your shift." },
    ],
  }),
  component: Profile,
});

function Profile() {
  const { profile, settings, displayName, displayOccupation, syncStatus, reset } = useMova();

  const rows = [
    { icon: Briefcase, label: "Occupation", value: displayOccupation, to: "/onboarding" },
    { icon: CalendarClock, label: "Work schedule", value: profile?.breakRhythm || "Not set yet", to: "/onboarding" },
    { icon: Sparkles, label: "Reset preferences", value: "Movement first", to: "/library" },
    { icon: Bell, label: "Notification settings", value: settings?.notificationsEnabled === false ? "Off" : "Gentle", to: "/privacy" },
    {
      icon: CircleCheck,
      label: "Verification preferences",
      value: settings?.cameraVerificationEnabled === false ? "Manual only" : "Motion only",
      to: "/privacy",
    },
    { icon: Lock, label: "Privacy", value: "You're in control", to: "/privacy" },
    {
      icon: ShieldAlert,
      label: "Emergency / safety settings",
      value: "Never during critical tasks",
      to: "/privacy",
    },
  ] as const;

  return (
    <MovaScreen>
      <ScreenHeader eyebrow="Profile" title={displayName} subtitle={displayOccupation} />
      {syncStatus === "loading" && (
        <p className="mt-3 text-[11px] font-medium text-soft">Syncing your profile…</p>
      )}

      <FrostCard className="mt-6 p-5">
        <p className="text-[11px] font-semibold tracking-[0.2em] text-soft uppercase">
          Work style
        </p>
        <p className="mt-1.5 text-[14px] leading-relaxed text-ink">
          {profile && profile.workStyle.length > 0 ? profile.workStyle.join(" · ") : "Not set yet — finish onboarding."}
        </p>
      </FrostCard>

      <div className="mt-5 grid gap-2.5">
        {rows.map(({ icon: Icon, label, value, to }) => (
          <Link key={label} to={to}>
            <FrostCard soft className="flex items-center gap-3.5 p-4">
              <span className="grid size-9 shrink-0 place-items-center rounded-2xl bg-sage/18 text-sagedeep">
                <Icon className="size-4" strokeWidth={1.75} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13.5px] font-semibold text-ink">{label}</p>
                <p className="truncate text-[11.5px] text-soft">{value}</p>
              </div>
              <ChevronRight className="size-4 shrink-0 text-soft" strokeWidth={1.75} />
            </FrostCard>
          </Link>
        ))}
      </div>

      <button
        type="button"
        onClick={reset}
        className="frost-2 mt-5 flex w-full items-center gap-3.5 rounded-2xl p-4 text-left"
      >
        <span className="grid size-9 shrink-0 place-items-center rounded-2xl bg-mist text-soft">
          <PauseCircle className="size-4" strokeWidth={1.75} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[13.5px] font-semibold text-ink">Pause MOVA</p>
          <p className="text-[11.5px] text-soft">Stop all resets and reset the demo</p>
        </div>
      </button>

      <p className="mt-8 text-center text-[11.5px] tracking-wide text-soft">
        Make space between work and exhaustion.
      </p>
    </MovaScreen>
  );
}
