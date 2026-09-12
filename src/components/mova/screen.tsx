import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ArrowLeft, BarChart3, Clock, Home, User } from "lucide-react";

export function MovaCanvas({
  children,
  tone = "calm",
}: {
  children: ReactNode;
  tone?: "calm" | "focus";
}) {
  return (
    <div className="mova-canvas relative min-h-[100dvh] w-full overflow-hidden">
      <div className="animate-drift pointer-events-none absolute -top-24 -left-16 h-72 w-72 rounded-full bg-sky/40 blur-3xl" />
      <div className="animate-floaty pointer-events-none absolute top-1/3 -right-32 h-80 w-80 rounded-full bg-sage/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 left-1/3 h-72 w-72 rounded-full bg-white/60 blur-3xl" />
      {tone === "focus" && (
        <div className="animate-breathe pointer-events-none absolute top-1/4 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-sage/25 blur-3xl" />
      )}
      {children}
    </div>
  );
}

export function MovaScreen({
  children,
  withNav = true,
  tone = "calm",
}: {
  children: ReactNode;
  withNav?: boolean;
  tone?: "calm" | "focus";
}) {
  return (
    <MovaCanvas tone={tone}>
      <div
        className={`relative mx-auto flex min-h-[100dvh] max-w-[420px] flex-col px-5 pt-8 ${
          withNav ? "pb-32" : "pb-10"
        }`}
      >
        {children}
      </div>
      {withNav && <BottomNav />}
    </MovaCanvas>
  );
}

export function ScreenHeader({
  eyebrow,
  title,
  subtitle,
  back,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  back?: string;
}) {
  return (
    <div className="animate-rise">
      {back && (
        <Link
          to={back as "/"}
          className="mb-4 inline-flex items-center gap-1.5 text-[12px] font-medium text-soft transition-colors hover:text-sagedeep"
        >
          <ArrowLeft className="size-3.5" strokeWidth={1.75} />
          Back
        </Link>
      )}
      {eyebrow && (
        <p className="text-[11px] font-semibold tracking-[0.24em] text-sagedeep uppercase">
          {eyebrow}
        </p>
      )}
      <h1 className="mt-1 font-display text-[30px] leading-[1.05] font-semibold text-ink">
        {title}
      </h1>
      {subtitle && <p className="mt-2 text-[13px] leading-relaxed text-soft">{subtitle}</p>}
    </div>
  );
}

export function FrostCard({
  children,
  className = "",
  soft = false,
}: {
  children: ReactNode;
  className?: string;
  soft?: boolean;
}) {
  return (
    <div
      className={`${soft ? "frost-2 rounded-2xl" : "frost rounded-[28px]"} ${className}`}
    >
      {children}
    </div>
  );
}

export function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full bg-white/70 px-2.5 py-1 text-[10px] font-medium text-sagedeep">
      {children}
    </span>
  );
}

export function PrimaryButton({
  children,
  onClick,
  className = "",
  type = "button",
  disabled = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-2xl bg-sagedeep/95 px-5 py-4 text-[15px] font-semibold text-white shadow-lg shadow-sagedeep/25 transition-all duration-200 hover:bg-sagedeep active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-55 ${className}`}
    >
      {children}
    </button>
  );
}

export function QuietButton({
  children,
  onClick,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`frost-2 w-full rounded-2xl px-5 py-3.5 text-[14px] font-medium text-soft transition-colors hover:text-sagedeep ${className}`}
    >
      {children}
    </button>
  );
}

const navItems = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/history", label: "History", icon: Clock },
  { to: "/insights", label: "Insights", icon: BarChart3 },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function BottomNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="fixed inset-x-0 bottom-0 z-10">
      <div className="mx-auto max-w-[420px] px-5 pb-6">
        <div className="frost flex items-center justify-around rounded-3xl px-2 py-2.5">
          {navItems.map(({ to, label, icon: Icon }) => {
            const active = path === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex flex-col items-center gap-1 rounded-2xl px-5 py-2 transition-colors ${
                  active ? "bg-sage/15 text-sagedeep" : "text-soft"
                }`}
              >
                <Icon className="size-4" strokeWidth={1.75} />
                <span className={`text-[10px] ${active ? "font-semibold" : "font-medium"}`}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function SelectChip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl px-4 py-3 text-left text-[13px] font-medium transition-all duration-200 ${
        selected
          ? "bg-sagedeep/95 text-white shadow-md shadow-sagedeep/20"
          : "frost-2 text-ink hover:text-sagedeep"
      }`}
    >
      {label}
    </button>
  );
}
