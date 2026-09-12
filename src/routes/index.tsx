import { createFileRoute, Link } from "@tanstack/react-router";
import { MovaCanvas } from "@/components/mova/screen";
import { useMova } from "@/lib/mova-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MOVA — Move towards a healthier life" },
      {
        name: "description",
        content:
          "MOVA helps workers take short, well-timed reset moments before stress and fatigue build up.",
      },
      { property: "og:title", content: "MOVA — Move towards a healthier life" },
      {
        property: "og:description",
        content:
          "A workplace wellness companion that helps you find the right moment for a short reset.",
      },
    ],
  }),
  component: Welcome,
});

function Welcome() {
  const { onboarded, authReady } = useMova();
  const target = authReady && onboarded ? "/home" : "/onboarding";
  return (
    <MovaCanvas>
      <div className="relative mx-auto flex min-h-[100dvh] max-w-[420px] flex-col px-6 pt-16 pb-10">
        <div className="animate-rise flex items-center gap-3">
          <div className="frost grid size-12 place-items-center rounded-2xl">
            <span className="animate-breathe size-4 rounded-full bg-gradient-to-br from-sage to-sky" />
          </div>
          <div>
            <p className="text-[15px] font-extrabold tracking-[0.32em] text-ink">MOVA</p>
            <p className="text-[10px] font-medium tracking-[0.2em] text-soft uppercase">
              wellness rhythm
            </p>
          </div>
        </div>

        <div className="mt-16 flex-1">
          <h1 className="animate-rise font-display text-[42px] leading-[1.02] font-semibold text-ink">
            Moving towards a healthier life.
          </h1>
          <p className="mt-5 max-w-[30ch] text-[15px] leading-relaxed text-soft">
            MOVA helps you take meaningful breaks before stress and fatigue build up.
          </p>

          <div className="relative mt-14 grid place-items-center">
            <div className="animate-breathe absolute size-56 rounded-full bg-gradient-to-br from-sage/25 to-sky/25 blur-xl" />
            <div className="frost relative grid size-56 place-items-center rounded-full">
              <div className="animate-breathe grid size-36 place-items-center rounded-full bg-white/60">
                <p className="text-center font-display text-[19px] leading-tight text-sagedeep">
                  Pause
                  <br />
                  before you
                  <br />
                  break.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 space-y-3">
          <Link
            to={target}
            className="block w-full rounded-2xl bg-sagedeep/95 px-5 py-4 text-center text-[15px] font-semibold text-white shadow-lg shadow-sagedeep/25 transition-all hover:bg-sagedeep active:scale-[0.99]"
          >
            Get Started
          </Link>
          <Link
            to={target}
            className="frost-2 block w-full rounded-2xl px-5 py-3.5 text-center text-[14px] font-medium text-soft transition-colors hover:text-sagedeep"
          >
            I already have an account
          </Link>
        </div>
      </div>
    </MovaCanvas>
  );
}
