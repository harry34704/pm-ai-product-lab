"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { AuthRequired } from "@/components/auth-required";
import { MentorPanel } from "@/components/mentor-panel";
import { AppShell } from "@/components/shell";
import { api, useSession } from "@/lib/api";
import type { DayDetail } from "@/lib/types";

export default function DayDetailPage() {
  const params = useParams<{ day: string }>();
  const router = useRouter();
  const session = useSession();
  const [day, setDay] = useState<DayDetail | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [reflection, setReflection] = useState("");
  const [answer, setAnswer] = useState("");
  const [completionNote, setCompletionNote] = useState("");

  useEffect(() => {
    if (!session.token || !params.day) {
      return;
    }
    api.day(params.day, session.token)
      .then((payload) => {
        setDay(payload);
        setReflection(payload.previous_reflection ?? "");
        setAnswer(payload.previous_answer ?? "");
      })
      .catch((err) => setError(err.message));
  }, [params.day, session.token]);

  const complete = async () => {
    if (!session.token || !params.day) {
      return;
    }
    setSaving(true);
    setError("");
    try {
      const result = await api.completeDay(params.day, { reflection_response: reflection, challenge_answer: answer }, session.token);
      setCompletionNote(`Lesson ${result.status}. XP: ${result.xp_balance}. Level: ${result.current_level}.`);
      const refreshed = await api.day(params.day, session.token);
      setDay(refreshed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to complete this lesson");
    } finally {
      setSaving(false);
    }
  };

  if (session.loading) {
    return <main className="grid min-h-screen place-items-center text-slate-300">Loading lesson...</main>;
  }

  if (!session.token || !session.user) {
    return (
      <main className="min-h-screen px-5 py-6">
        <AuthRequired />
      </main>
    );
  }

  return (
    <AppShell title={`Day ${params.day ?? ""}`} eyebrow="PM90 Lesson" user={session.user} onLogout={session.logout}>
      {error ? <p className="mb-6 text-sm text-rose-300">{error}</p> : null}
      {day ? (
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[30px] border border-white/10 bg-slate-950/55 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/75">{day.phase_name}</p>
                <h3 className="mt-2 text-3xl font-semibold text-white">{day.topic}</h3>
              </div>
              <button onClick={() => router.push("/curriculum")} className="rounded-2xl border border-white/10 px-4 py-3 text-sm text-slate-300">
                Back
              </button>
            </div>
            <div className="mt-8 space-y-6">
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Lesson</p>
                <p className="mt-3 leading-8 text-slate-200">{day.lesson}</p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Practical task</p>
                <p className="mt-3 leading-8 text-slate-200">{day.practical_task}</p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Reflection question</p>
                <p className="mt-3 leading-8 text-slate-200">{day.reflection_question}</p>
              </div>
            </div>
          </section>

          <div className="space-y-6">
            <section className="rounded-[30px] border border-white/10 bg-slate-950/55 p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/75">Submit work</p>
                  <h4 className="mt-2 text-2xl font-semibold text-white">{day.xp_reward} XP available</h4>
                </div>
                <div className="rounded-full border border-white/10 px-3 py-2 text-xs uppercase tracking-[0.3em] text-slate-400">{day.status}</div>
              </div>
              <textarea
                value={reflection}
                onChange={(event) => setReflection(event.target.value)}
                placeholder="What changed in the way you think about this topic?"
                className="mt-5 min-h-[140px] w-full rounded-[22px] border border-white/10 bg-white/5 px-4 py-4 text-sm text-white outline-none placeholder:text-slate-500"
              />
              <textarea
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                placeholder="Write your practical answer, decision, or recommendation."
                className="mt-4 min-h-[140px] w-full rounded-[22px] border border-white/10 bg-white/5 px-4 py-4 text-sm text-white outline-none placeholder:text-slate-500"
              />
              <button
                onClick={complete}
                disabled={saving || reflection.length < 8 || answer.length < 8}
                className="mt-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-teal-300 px-5 py-3 text-sm font-medium text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving..." : "Complete lesson"}
              </button>
              {completionNote ? <p className="mt-4 text-sm text-emerald-200">{completionNote}</p> : null}
            </section>

            <MentorPanel token={session.token} context={`${day.mentor_prompt}\n\nTask: ${day.practical_task}`} defaultPrompt={`Coach me on ${day.topic}.`} />
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}
