"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { api, useSession } from "@/lib/api";

export default function AuthPage() {
  const router = useRouter();
  const { user, saveToken } = useSession();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ email: "", password: "", full_name: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [router, user]);

  const submit = async () => {
    setLoading(true);
    setError("");
    try {
      const payload =
        mode === "login"
          ? await api.login({ email: form.email, password: form.password })
          : await api.register({ email: form.email, password: form.password, full_name: form.full_name });
      await saveToken(payload.access_token);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const useDemo = async () => {
    setLoading(true);
    setError("");
    try {
      const payload = await api.login({ email: "demo@pm90.app", password: "Demo123!" });
      await saveToken(payload.access_token);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Demo login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center px-5 py-8">
      <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[1fr_0.95fr]">
        <section className="grid-dots rounded-[38px] border border-white/10 bg-slate-950/60 p-8 backdrop-blur md:p-10">
          <p className="text-xs uppercase tracking-[0.45em] text-cyan-300/75">PM90</p>
          <h1 className="mt-4 text-5xl font-semibold text-white">Launch your PM operating system.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            AI coaching, real product simulations, analytics drills, and a structured 90-day learning arc in one product workspace.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              "Daily lessons, practical tasks, and reflection loops",
              "Skill tree, streaks, XP, levels, and badges",
              "PRD, roadmap, and prioritization artifact generation",
              "Interview practice and AI-evaluated product scenarios",
            ].map((item) => (
              <div key={item} className="rounded-[24px] border border-white/10 bg-white/6 p-5 text-sm leading-7 text-slate-200">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[38px] border border-white/10 bg-slate-950/70 p-8 backdrop-blur md:p-10">
          <div className="flex gap-3">
            {(["login", "register"] as const).map((item) => (
              <button
                key={item}
                onClick={() => setMode(item)}
                className={`rounded-2xl px-4 py-3 text-sm transition ${
                  mode === item ? "bg-cyan-400/15 text-white" : "border border-white/10 text-slate-300"
                }`}
              >
                {item === "login" ? "Log in" : "Create account"}
              </button>
            ))}
          </div>
          <div className="mt-8 space-y-4">
            {mode === "register" ? (
              <input
                value={form.full_name}
                onChange={(event) => setForm((current) => ({ ...current, full_name: event.target.value }))}
                placeholder="Full name"
                className="w-full rounded-[22px] border border-white/10 bg-white/5 px-4 py-4 text-white outline-none placeholder:text-slate-500"
              />
            ) : null}
            <input
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              placeholder="Email"
              className="w-full rounded-[22px] border border-white/10 bg-white/5 px-4 py-4 text-white outline-none placeholder:text-slate-500"
            />
            <input
              value={form.password}
              type="password"
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              placeholder="Password"
              className="w-full rounded-[22px] border border-white/10 bg-white/5 px-4 py-4 text-white outline-none placeholder:text-slate-500"
            />
          </div>
          {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={submit}
              disabled={loading}
              className="rounded-2xl bg-gradient-to-r from-cyan-400 to-teal-300 px-5 py-3 text-sm font-medium text-slate-950"
            >
              {loading ? "Working..." : mode === "login" ? "Enter workspace" : "Create account"}
            </button>
            <button onClick={useDemo} disabled={loading} className="rounded-2xl border border-white/10 px-5 py-3 text-sm text-slate-200">
              Use demo account
            </button>
          </div>
          <div className="mt-8 rounded-[24px] border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
            Demo credentials: <span className="text-white">demo@pm90.app</span> / <span className="text-white">Demo123!</span>
          </div>
        </section>
      </div>
    </main>
  );
}
