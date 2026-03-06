"use client";

import { useEffect, useMemo, useState } from "react";

import { AuthRequired } from "@/components/auth-required";
import { DayCard } from "@/components/day-card";
import { AppShell } from "@/components/shell";
import { api, useSession } from "@/lib/api";
import type { DaySummary } from "@/lib/types";

export default function CurriculumPage() {
  const session = useSession();
  const [days, setDays] = useState<DaySummary[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!session.token) {
      return;
    }
    api.curriculum(session.token).then(setDays).catch((err) => setError(err.message));
  }, [session.token]);

  const grouped = useMemo(() => {
    return days.reduce<Record<string, DaySummary[]>>((accumulator, day) => {
      accumulator[day.phase_name] = accumulator[day.phase_name] ?? [];
      accumulator[day.phase_name].push(day);
      return accumulator;
    }, {});
  }, [days]);

  if (session.loading) {
    return <main className="grid min-h-screen place-items-center text-slate-300">Loading curriculum...</main>;
  }

  if (!session.token || !session.user) {
    return (
      <main className="min-h-screen px-5 py-6">
        <AuthRequired />
      </main>
    );
  }

  return (
    <AppShell title="90-day curriculum" eyebrow="PM90 Curriculum" user={session.user} onLogout={session.logout}>
      {error ? <p className="mb-6 text-sm text-rose-300">{error}</p> : null}
      <div className="space-y-8">
        {Object.entries(grouped).map(([phaseName, phaseDays]) => (
          <section key={phaseName} className="rounded-[30px] border border-white/10 bg-slate-950/55 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/75">{phaseDays[0]?.skill_area}</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">{phaseName}</h3>
              </div>
              <p className="text-sm text-slate-400">{phaseDays.filter((day) => day.status === "completed").length} / {phaseDays.length} complete</p>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
              {phaseDays.map((day) => (
                <DayCard key={day.day_number} day={day} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </AppShell>
  );
}
