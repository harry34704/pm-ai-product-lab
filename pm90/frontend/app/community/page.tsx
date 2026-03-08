"use client";

import { useEffect, useState } from "react";

import { AppShell } from "@/components/shell";
import { AuthRequired } from "@/components/auth-required";
import { api, useSession } from "@/lib/api";
import type { CommunityOverview } from "@/lib/types";

export default function CommunityPage() {
  const session = useSession();
  const [overview, setOverview] = useState<CommunityOverview | null>(null);
  const [topic, setTopic] = useState("");
  const [body, setBody] = useState("");

  const load = async () => {
    const token = session.token;
    if (!token) {
      return;
    }
    setOverview(await api.community(token));
  };

  useEffect(() => {
    load();
  }, [session.token]);

  if (session.loading) {
    return <main className="grid min-h-screen place-items-center text-slate-300">Loading community...</main>;
  }

  if (!session.token || !session.user) {
    return (
      <main className="min-h-screen px-5 py-6">
        <AuthRequired />
      </main>
    );
  }

  const createPost = async () => {
    await api.createPost({ topic, body }, session.token!);
    setTopic("");
    setBody("");
    await load();
  };

  return (
    <AppShell title="Community" eyebrow="PM90 League" user={session.user} onLogout={session.logout}>
      {overview ? (
        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <section className="space-y-6">
            <div className="rounded-[30px] border border-white/10 bg-slate-950/55 p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/75">Weekly challenges</p>
              <div className="mt-5 space-y-3">
                {overview.weekly_challenges.map((challenge) => (
                  <div key={challenge.week} className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                    <p className="font-medium text-white">Week {challenge.week}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{challenge.title}</p>
                    <p className="mt-2 text-sm text-cyan-200">{challenge.xp_reward} XP</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[30px] border border-white/10 bg-slate-950/55 p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/75">Public progress feed</p>
              <div className="mt-5 space-y-3">
                {overview.progress_feed.map((item, index) => (
                  <div key={`${item.timestamp}-${index}`} className="rounded-[22px] border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
                    <p>{item.message}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.25em] text-slate-500">{new Date(item.timestamp).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[30px] border border-white/10 bg-slate-950/55 p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/75">Leaderboard</p>
              <div className="mt-5 space-y-3">
                {overview.leaderboard.map((entry, index) => (
                  <div key={`${entry.name}-${index}`} className="flex items-center justify-between rounded-[22px] border border-white/10 bg-white/5 px-4 py-4">
                    <div>
                      <p className="font-medium text-white">{index + 1}. {entry.name}</p>
                      <p className="text-sm text-slate-400">{entry.headline}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-cyan-100">{entry.xp_balance} XP</p>
                      <p className="text-sm text-slate-400">Level {entry.current_level}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="rounded-[30px] border border-white/10 bg-slate-950/55 p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/75">Discussion board</p>
              <div className="mt-5 space-y-4">
                {overview.posts.map((post) => (
                  <div key={post.id} className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium text-white">{post.topic}</p>
                      <p className="text-xs uppercase tracking-[0.25em] text-slate-500">{post.author_name}</p>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-300">{post.body}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[30px] border border-white/10 bg-slate-950/55 p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/75">Share a post</p>
              <input
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
                placeholder="Topic"
                className="mt-4 w-full rounded-[22px] border border-white/10 bg-white/5 px-4 py-4 text-white outline-none placeholder:text-slate-500"
              />
              <textarea
                value={body}
                onChange={(event) => setBody(event.target.value)}
                placeholder="Share a question, insight, or win."
                className="mt-4 min-h-[150px] w-full rounded-[22px] border border-white/10 bg-white/5 px-4 py-4 text-white outline-none placeholder:text-slate-500"
              />
              <button onClick={createPost} className="mt-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-teal-300 px-5 py-3 text-sm font-medium text-slate-950">
                Post update
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </AppShell>
  );
}
