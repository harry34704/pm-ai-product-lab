"use client";

import { useEffect, useState } from "react";

import { AppShell } from "@/components/shell";
import { AuthRequired } from "@/components/auth-required";
import { HorizontalBars, RetentionLine } from "@/components/simple-charts";
import { StatCard } from "@/components/stat-card";
import { api, useSession } from "@/lib/api";
import type { AnalyticsPayload } from "@/lib/types";

export default function AnalyticsPage() {
  const session = useSession();
  const [data, setData] = useState<AnalyticsPayload | null>(null);

  useEffect(() => {
    if (!session.token) {
      return;
    }
    api.analytics(session.token).then(setData);
  }, [session.token]);

  if (session.loading) {
    return <main className="grid min-h-screen place-items-center text-slate-300">Loading analytics...</main>;
  }

  if (!session.token || !session.user) {
    return (
      <main className="min-h-screen px-5 py-6">
        <AuthRequired />
      </main>
    );
  }

  return (
    <AppShell title="Analytics playground" eyebrow="PM90 Metrics Lab" user={session.user} onLogout={session.logout}>
      {data ? (
        <div className="space-y-6">
          <div className="grid gap-4 xl:grid-cols-4">
            {data.metrics.map((metric) => (
              <StatCard key={metric.label} label={metric.label} value={`${metric.value}%`} hint={`${metric.delta > 0 ? "+" : ""}${metric.delta} pts vs previous period`} />
            ))}
          </div>
          <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <section className="rounded-[30px] border border-white/10 bg-slate-950/55 p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/75">Conversion funnel</p>
              <div className="mt-5">
                <HorizontalBars items={data.funnel} labelKey="stage" valueKey="users" />
              </div>
            </section>
            <section className="rounded-[30px] border border-white/10 bg-slate-950/55 p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/75">Retention curve</p>
              <div className="mt-5">
                <RetentionLine points={data.retention} />
              </div>
            </section>
          </div>
          <div className="grid gap-6 xl:grid-cols-2">
            <section className="rounded-[30px] border border-white/10 bg-slate-950/55 p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/75">Cohort analysis</p>
              <div className="mt-5 overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="text-slate-400">
                    <tr>
                      {Object.keys(data.cohorts[0]).map((key) => (
                        <th key={key} className="px-3 py-2">{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.cohorts.map((row) => (
                      <tr key={String(row.cohort)} className="border-t border-white/10">
                        {Object.entries(row).map(([key, value]) => (
                          <td key={key} className="px-3 py-3 text-slate-200">{value}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
            <section className="rounded-[30px] border border-white/10 bg-slate-950/55 p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/75">A/B testing results</p>
              <div className="mt-5 space-y-3">
                {data.ab_tests.map((test) => (
                  <div key={test.experiment} className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                    <p className="font-medium text-white">{test.experiment}</p>
                    <p className="mt-2 text-sm text-slate-300">A: {test.variant_a}% · B: {test.variant_b}% · Winner: {test.winner}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}
