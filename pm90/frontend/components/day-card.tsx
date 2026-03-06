import Link from "next/link";

import type { DaySummary } from "@/lib/types";

const statusStyles: Record<DaySummary["status"], string> = {
  completed: "border-emerald-400/20 bg-emerald-400/10 text-emerald-100",
  unlocked: "border-cyan-300/25 bg-cyan-400/10 text-cyan-50",
  locked: "border-white/10 bg-white/5 text-slate-400",
};

export function DayCard({ day }: { day: DaySummary }) {
  return (
    <Link
      href={`/curriculum/${day.day_number}`}
      className="group rounded-[26px] border border-white/10 bg-slate-950/55 p-5 transition hover:-translate-y-0.5 hover:border-cyan-300/20 hover:bg-slate-900/80"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.32em] text-slate-400">
          Day {day.day_number}
        </div>
        <div className={`rounded-full border px-3 py-1 text-xs ${statusStyles[day.status]}`}>{day.status}</div>
      </div>
      <h3 className="mt-5 text-xl font-semibold text-white">{day.topic}</h3>
      <p className="mt-2 text-sm text-slate-400">{day.phase_name}</p>
      <div className="mt-6 flex items-center justify-between text-sm">
        <span className="text-slate-300">{day.skill_area}</span>
        <span className="text-cyan-200">{day.xp_reward} XP</span>
      </div>
    </Link>
  );
}
