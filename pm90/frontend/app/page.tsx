import Link from "next/link";

const features = [
  "90 sequential daily lessons with practical PM tasks",
  "AI mentor with OpenAI and Ollama support",
  "Product simulations, analytics playground, and interview prep",
  "Portfolio artifact generation with export-ready outputs",
];

const phases = [
  "Phase 1 Foundations",
  "Phase 2 Product Discovery",
  "Phase 3 Product Delivery",
  "Phase 4 Product Analytics",
  "Phase 5 Product Strategy",
  "Phase 6 Leadership and Career",
];

export default function HomePage() {
  return (
    <main className="min-h-screen px-5 py-6 text-white md:px-10 md:py-10">
      <section className="grid-dots mx-auto max-w-7xl overflow-hidden rounded-[40px] border border-white/10 bg-slate-950/60 px-6 py-8 shadow-[0_24px_80px_rgba(2,6,23,0.42)] backdrop-blur md:px-10 md:py-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.45em] text-cyan-300/75">PM90</p>
            <h1 className="mt-5 text-5xl font-semibold leading-tight text-white md:text-7xl">
              Become a sharper product manager in 90 deliberate days.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              PM90 combines a structured curriculum, gamified progress, AI mentorship, simulations, and portfolio building so aspiring PMs can practice the craft like real operators.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/auth" className="rounded-2xl bg-gradient-to-r from-cyan-400 to-teal-300 px-5 py-3 text-sm font-medium text-slate-950">
                Launch workspace
              </Link>
              <a href="#overview" className="rounded-2xl border border-white/10 px-5 py-3 text-sm text-slate-200">
                Explore the product
              </a>
            </div>
          </div>
          <div className="w-full max-w-md rounded-[32px] border border-cyan-300/15 bg-white/6 p-6">
            <p className="text-sm text-slate-300">Live system preview</p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/10 bg-slate-950/65 p-4">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Journey</p>
                <p className="mt-2 text-3xl font-semibold">90</p>
                <p className="mt-1 text-sm text-slate-400">daily lessons</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/65 p-4">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Modes</p>
                <p className="mt-2 text-3xl font-semibold">6</p>
                <p className="mt-1 text-sm text-slate-400">learning phases</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/65 p-4">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Mentor</p>
                <p className="mt-2 text-3xl font-semibold">AI</p>
                <p className="mt-1 text-sm text-slate-400">chat + voice support</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/65 p-4">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Artifacts</p>
                <p className="mt-2 text-3xl font-semibold">PDF</p>
                <p className="mt-1 text-sm text-slate-400">export-ready outputs</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="overview" className="mx-auto mt-8 grid max-w-7xl gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[32px] border border-white/10 bg-slate-950/55 p-8 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/70">Why it works</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {features.map((feature) => (
              <div key={feature} className="rounded-[24px] border border-white/10 bg-white/5 p-5 text-sm leading-7 text-slate-200">
                {feature}
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[32px] border border-white/10 bg-slate-950/55 p-8 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/70">Curriculum</p>
          <div className="mt-6 space-y-3">
            {phases.map((phase) => (
              <div key={phase} className="rounded-[22px] border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-200">
                {phase}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
