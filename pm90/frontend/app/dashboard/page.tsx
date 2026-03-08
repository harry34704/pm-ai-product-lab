"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { AppShell } from "@/components/shell";
import { AuthRequired } from "@/components/auth-required";
import { ProgressRing } from "@/components/progress-ring";
import { StatCard } from "@/components/stat-card";
import { api, useSession } from "@/lib/api";
import type { DashboardSummary } from "@/lib/types";

export default function DashboardPage() {
  const session = useSession();
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!session.token) {
      return;
    }
    api.dashboard(session.token).then(setData).catch((err) => setError(err.message));
  }, [session.token]);

  if (session.loading) {
    return <main className="grid min-h-screen place-items-center text-slate-300">Loading PM90...</main>;
  }

  if (!session.token || !session.user) {
    return (
      <main className="min-h-screen px-5 py-6">
        <AuthRequired />
      </main>
    );
  }

  const completion = data ? Math.round((data.completed_days / data.total_days) * 100) : 0;

  return (
    <AppShell title="Mission control" eyebrow="PM90 Dashboard" user={session.user} onLogout={session.logout}>
      {error ? <p className="mb-6 text-sm text-rose-300">{error}</p> : null}
      {data ? (
        <div className="space-y-6">
          <div className="grid gap-4 xl:grid-cols-4">
            <StatCard label="XP balance" value={`${data.user.xp_balance}`} hint="Earned from daily lessons and simulations." />
            <StatCard label="Current level" value={`${data.user.current_level}`} hint="Levels increase every 400 XP." />
            <StatCard label="Daily streak" value={`${data.streak_count} days`} hint="Consistency compounds product judgment." />
            <StatCard
              label="Certification"
              value={data.certificate.issued ? "Issued" : data.certificate.eligible ? "Ready" : "Locked"}
              hint={data.certificate.issued ? "Your PM90 certificate is now part of the portfolio." : "Complete all 90 days to unlock certification."}
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
            <ProgressRing value={completion} label="Program completion" />
            <div className="rounded-[30px] border border-white/10 bg-slate-950/60 p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/75">Next up</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">{data.next_day?.topic ?? "Program complete"}</h3>
                </div>
                {data.next_day ? (
                  <Link href={`/curriculum/${data.next_day.day_number}`} className="rounded-2xl bg-gradient-to-r from-cyan-400 to-teal-300 px-4 py-3 text-sm font-medium text-slate-950">
                    Continue journey
                  </Link>
                ) : null}
              </div>
              <p className="mt-4 text-slate-300">
                {data.next_day
                  ? `${data.next_day.phase_name} · ${data.next_day.skill_area} · ${data.next_day.xp_reward} XP`
                  : "You have completed the core PM90 sequence. Use simulations and artifacts to keep sharpening your craft."}
              </p>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <section className="rounded-[30px] border border-white/10 bg-slate-950/60 p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/75">Phase progress</p>
              <div className="mt-6 space-y-4">
                {data.phase_progress.map((phase) => (
                  <div key={phase.phase_key}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-slate-200">{phase.phase_name}</span>
                      <span className="text-cyan-200">{phase.completed_days}/{phase.total_days}</span>
                    </div>
                    <div className="h-3 rounded-full bg-white/6">
                      <div className="h-3 rounded-full bg-gradient-to-r from-cyan-400 to-teal-300" style={{ width: `${phase.progress_percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[30px] border border-white/10 bg-slate-950/60 p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/75">Skill tree</p>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {data.skill_tree.map((skill) => (
                  <div key={skill.skill} className={`rounded-[24px] border p-4 ${skill.unlocked ? "border-white/10 bg-white/5" : "border-white/6 bg-white/[0.03]"}`}>
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm text-slate-400">{skill.skill}</p>
                      <div className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.25em] ${skill.unlocked ? "bg-cyan-400/10 text-cyan-100" : "bg-white/5 text-slate-500"}`}>
                        {skill.unlocked ? `Lvl ${skill.current_level}` : "Locked"}
                      </div>
                    </div>
                    <p className={`mt-2 text-2xl font-semibold ${skill.unlocked ? "text-white" : "text-slate-500"}`}>{skill.progress_percent}%</p>
                    <p className="mt-2 text-sm text-slate-300">{skill.completed_days} of {skill.total_days} milestones completed</p>
                    {!skill.unlocked && skill.unlock_requirement ? <p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-500">{skill.unlock_requirement}</p> : null}
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <section className="rounded-[30px] border border-white/10 bg-slate-950/60 p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/75">Badges</p>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {data.badges.length ? (
                  data.badges.map((badge) => (
                    <div key={badge.badge_code} className="rounded-[24px] border border-amber-300/15 bg-amber-300/8 p-4">
                      <p className="text-lg font-semibold text-white">{badge.badge_name}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-200">{badge.description}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-300">Complete lessons and simulations to unlock your first badge.</p>
                )}
              </div>
            </section>

            <section className="rounded-[30px] border border-white/10 bg-slate-950/60 p-6">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/75">Leaderboard</p>
                <Link href="/community" className="text-sm text-cyan-200">Open community</Link>
              </div>
              <div className="mt-5 space-y-3">
                {data.leaderboard.map((entry, index) => (
                  <div key={`${entry.name}-${index}`} className="flex items-center justify-between rounded-[22px] border border-white/10 bg-white/5 px-4 py-4">
                    <div>
                      <p className="font-medium text-white">{index + 1}. {entry.name}</p>
                      <p className="text-sm text-slate-400">{entry.headline}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-cyan-100">{entry.xp_balance} XP</p>
                      <p className="text-sm text-slate-400">Level {entry.current_level}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className="rounded-[30px] border border-white/10 bg-slate-950/60 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/75">Certification</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">
                  {data.certificate.title ?? "PM90 Certified Product Manager"}
                </h3>
              </div>
              {data.certificate.issued_at ? (
                <p className="text-sm text-slate-400">Issued {new Date(data.certificate.issued_at).toLocaleDateString()}</p>
              ) : null}
            </div>
            <div className="mt-5 grid gap-4 lg:grid-cols-[0.75fr_1.25fr]">
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-slate-400">Completion score</p>
                <p className="mt-2 text-4xl font-semibold text-white">
                  {data.certificate.completion_score !== null && data.certificate.completion_score !== undefined
                    ? `${data.certificate.completion_score}%`
                    : "In progress"}
                </p>
                <p className="mt-3 text-sm text-slate-300">
                  {data.certificate.issued
                    ? "You have completed the full 90-day journey and earned the PM90 certificate."
                    : "Certification unlocks automatically when every day in the program is completed in sequence."}
                </p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-slate-400">Portfolio highlights</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {data.certificate.portfolio_highlights.length ? (
                    data.certificate.portfolio_highlights.map((item) => (
                      <span key={item} className="rounded-full border border-white/10 px-3 py-2 text-xs text-slate-200">
                        {item}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-slate-300">Generate PRDs, roadmaps, personas, and simulations to strengthen the final certificate package.</p>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[30px] border border-white/10 bg-slate-950/60 p-6">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/75">Portfolio artifacts</p>
              <Link href="/artifacts" className="text-sm text-cyan-200">Open builder</Link>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {data.artifacts.map((artifact) => (
                <div key={artifact.id} className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                  <p className="text-sm uppercase tracking-[0.28em] text-slate-500">{artifact.kind}</p>
                  <h3 className="mt-2 text-xl font-semibold text-white">{artifact.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{artifact.summary ?? "Saved as part of your PM90 portfolio."}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : null}
    </AppShell>
  );
}
