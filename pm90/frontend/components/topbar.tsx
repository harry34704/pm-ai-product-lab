"use client";

import Link from "next/link";

import type { UserSummary } from "@/lib/types";

export function Topbar({
  title,
  eyebrow,
  user,
  onLogout,
}: {
  title: string;
  eyebrow?: string;
  user?: UserSummary | null;
  onLogout?: () => void;
}) {
  return (
    <header className="mb-8 flex flex-col gap-5 rounded-[28px] border border-white/10 bg-slate-950/55 px-6 py-5 backdrop-blur md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/70">{eyebrow ?? "PM90 Workspace"}</p>
        <h2 className="mt-2 text-3xl font-semibold text-white">{title}</h2>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {user ? (
          <>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
              <p className="font-medium text-white">{user.full_name}</p>
              <p className="text-slate-400">Level {user.current_level} · {user.xp_balance} XP</p>
            </div>
            <button
              onClick={onLogout}
              className="rounded-2xl border border-white/10 px-4 py-3 text-sm text-slate-300 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
            >
              Log out
            </button>
          </>
        ) : (
          <Link href="/auth" className="rounded-2xl border border-cyan-300/30 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-50 transition hover:bg-cyan-400/15">
            Launch demo
          </Link>
        )}
      </div>
    </header>
  );
}
