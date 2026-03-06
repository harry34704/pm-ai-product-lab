"use client";

import { useState } from "react";

import { AppShell } from "@/components/shell";
import { AuthRequired } from "@/components/auth-required";
import { MentorPanel } from "@/components/mentor-panel";
import { api, useSession } from "@/lib/api";
import type { MentorResponse } from "@/lib/types";

const interviewQuestions = [
  "How would you improve Spotify discovery?",
  "How would you increase Airbnb host retention?",
  "How would you reduce churn for a B2B analytics tool?",
];

export default function MentorPage() {
  const session = useSession();
  const [prdDraft, setPrdDraft] = useState("");
  const [interviewAnswer, setInterviewAnswer] = useState("");
  const [interviewQuestion, setInterviewQuestion] = useState(interviewQuestions[0]);
  const [review, setReview] = useState<MentorResponse | null>(null);
  const [interviewFeedback, setInterviewFeedback] = useState<MentorResponse | null>(null);

  if (session.loading) {
    return <main className="grid min-h-screen place-items-center text-slate-300">Loading mentor...</main>;
  }

  if (!session.token || !session.user) {
    return (
      <main className="min-h-screen px-5 py-6">
        <AuthRequired />
      </main>
    );
  }

  const reviewPrd = async () => {
    setReview(await api.mentorReviewPrd({ content: prdDraft }, session.token!));
  };

  const runInterview = async () => {
    setInterviewFeedback(await api.mentorInterview({ question: interviewQuestion, answer: interviewAnswer }, session.token!));
  };

  return (
    <AppShell title="AI mentor" eyebrow="PM90 Coaching Layer" user={session.user} onLogout={session.logout}>
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <MentorPanel token={session.token} defaultPrompt="Explain how to balance discovery, delivery, and analytics in a product team." />
        <div className="space-y-6">
          <section className="rounded-[30px] border border-white/10 bg-slate-950/55 p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/75">PRD review</p>
            <textarea
              value={prdDraft}
              onChange={(event) => setPrdDraft(event.target.value)}
              placeholder="Paste a PRD draft for AI review."
              className="mt-4 min-h-[190px] w-full rounded-[22px] border border-white/10 bg-white/5 px-4 py-4 text-sm text-white outline-none placeholder:text-slate-500"
            />
            <button onClick={reviewPrd} className="mt-4 rounded-2xl bg-white/8 px-4 py-3 text-sm text-white">
              Review PRD
            </button>
            <pre className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-200">{review?.response ?? "Feedback appears here."}</pre>
          </section>
          <section className="rounded-[30px] border border-white/10 bg-slate-950/55 p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/75">Interview simulator</p>
            <select
              value={interviewQuestion}
              onChange={(event) => setInterviewQuestion(event.target.value)}
              className="mt-4 w-full rounded-[22px] border border-white/10 bg-white/5 px-4 py-4 text-white outline-none"
            >
              {interviewQuestions.map((question) => (
                <option key={question} value={question} className="bg-slate-950">
                  {question}
                </option>
              ))}
            </select>
            <textarea
              value={interviewAnswer}
              onChange={(event) => setInterviewAnswer(event.target.value)}
              placeholder="Write your interview answer."
              className="mt-4 min-h-[160px] w-full rounded-[22px] border border-white/10 bg-white/5 px-4 py-4 text-sm text-white outline-none placeholder:text-slate-500"
            />
            <button onClick={runInterview} className="mt-4 rounded-2xl bg-white/8 px-4 py-3 text-sm text-white">
              Evaluate answer
            </button>
            <pre className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-200">{interviewFeedback?.response ?? "Interview feedback appears here."}</pre>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
