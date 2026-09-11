import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { MovaScreen, PrimaryButton, SelectChip } from "@/components/mova/screen";
import { useMova } from "@/lib/mova-store";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Build your Reset Profile | MOVA" },
      {
        name: "description",
        content:
          "Tell MOVA about your occupation, workday and constraints so your resets fit your real shift.",
      },
      { property: "og:title", content: "Build your Reset Profile | MOVA" },
      {
        property: "og:description",
        content: "Your workday is different. Your resets should be too.",
      },
    ],
  }),
  component: Onboarding,
});

const occupations = [
  "Healthcare",
  "Office / Administration",
  "Technology",
  "Student",
  "Education",
  "Retail",
  "Driving / Transport",
  "Construction",
  "Manufacturing",
  "Hospitality",
  "Creative / Freelance",
  "Other",
];

const workStyles = [
  "Mostly sitting",
  "Mostly standing",
  "Walking frequently",
  "Physically demanding",
  "Screen-heavy",
  "Mentally demanding",
  "Customer-facing",
  "Safety-critical",
  "Unpredictable / constantly changing",
];

const constraints = [
  "I can't use my phone while working",
  "I work with patients/customers",
  "I work around machinery",
  "I drive during work",
  "I have unpredictable breaks",
  "I have access to a private space",
  "I usually work at a desk",
  "I work outdoors",
];

const rhythms = [
  "Every 30 minutes",
  "Every hour",
  "Every 90 minutes",
  "A few times during the day",
  "My schedule is unpredictable",
];

const steps = ["What do you do?", "What does your workday look like?", "What are your work constraints?", "When can you usually take short breaks?"];

function Onboarding() {
  const navigate = useNavigate();
  const { state, setProfile, completeOnboarding } = useMova();
  const [step, setStep] = useState(0);
  const [occupation, setOccupation] = useState(state.profile.occupation);
  const [custom, setCustom] = useState("");
  const [styles, setStyles] = useState<string[]>(state.profile.workStyle);
  const [limits, setLimits] = useState<string[]>(state.profile.constraints);
  const [rhythm, setRhythm] = useState(state.profile.breakRhythm);

  const toggle = (list: string[], set: (v: string[]) => void, value: string) =>
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const next = () => {
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    setProfile({
      occupation: occupation === "Other" && custom ? custom : occupation,
      workStyle: styles,
      constraints: limits,
      breakRhythm: rhythm,
    });
    completeOnboarding();
    navigate({ to: "/reset-profile" });
  };

  return (
    <MovaScreen withNav={false}>
      <div className="animate-rise">
        <p className="text-[11px] font-semibold tracking-[0.24em] text-sagedeep uppercase">
          Step {step + 1} of 4
        </p>
        <h1 className="mt-1 font-display text-[28px] leading-[1.08] font-semibold text-ink">
          Let's build your Reset Profile
        </h1>
        <p className="mt-2 text-[13px] leading-relaxed text-soft">
          Your workday is different. Your resets should be too.
        </p>
        <div className="mt-4 flex gap-1.5">
          {steps.map((s, i) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                i <= step ? "bg-gradient-to-r from-sage to-sky" : "bg-mist"
              }`}
            />
          ))}
        </div>
      </div>

      <h2 className="mt-7 text-[17px] font-semibold text-ink">{steps[step]}</h2>

      <div className="mt-4 flex-1">
        {step === 0 && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2.5">
              {occupations.map((o) => (
                <SelectChip
                  key={o}
                  label={o}
                  selected={occupation === o}
                  onClick={() => setOccupation(o)}
                />
              ))}
            </div>
            {occupation === "Other" && (
              <input
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                placeholder="Type your occupation"
                className="frost-2 w-full rounded-2xl px-4 py-3.5 text-[14px] text-ink placeholder:text-soft/70 focus:ring-2 focus:ring-sage/40 focus:outline-none"
              />
            )}
          </div>
        )}

        {step === 1 && (
          <div className="grid gap-2.5">
            {workStyles.map((w) => (
              <SelectChip
                key={w}
                label={w}
                selected={styles.includes(w)}
                onClick={() => toggle(styles, setStyles, w)}
              />
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-2.5">
            {constraints.map((c) => (
              <SelectChip
                key={c}
                label={c}
                selected={limits.includes(c)}
                onClick={() => toggle(limits, setLimits, c)}
              />
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="grid gap-2.5">
            {rhythms.map((r) => (
              <SelectChip
                key={r}
                label={r}
                selected={rhythm === r}
                onClick={() => setRhythm(r)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="frost-2 mt-6 flex items-start gap-3 rounded-2xl p-4">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-sagedeep" strokeWidth={1.75} />
        <p className="text-[11.5px] leading-relaxed text-soft">
          Your information helps personalize your resets. MOVA is designed to minimize
          unnecessary monitoring.
        </p>
      </div>

      <div className="mt-4 flex gap-3">
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="frost-2 rounded-2xl px-6 py-4 text-[14px] font-medium text-soft"
          >
            Back
          </button>
        )}
        <PrimaryButton onClick={next}>{step < 3 ? "Continue" : "See my profile"}</PrimaryButton>
      </div>
    </MovaScreen>
  );
}
