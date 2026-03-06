"use client";

import { useEffect, useState } from "react";

import { AppShell } from "@/components/shell";
import { AuthRequired } from "@/components/auth-required";
import { api, useSession } from "@/lib/api";
import type { SimulationScenario } from "@/lib/types";

export default function SimulationsPage() {
  const session = useSession();
  const [scenarios, setScenarios] = useState<SimulationScenario[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<SimulationScenario | null>(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [rationale, setRationale] = useState("");
  const [result, setResult] = useState<{ score: number; feedback: string; xp_balance: number } | null>(null);

  useEffect(() => {
    if (!session.token) {
      return;
    }
    api.simulations(session.token).then((payload) => {
      setScenarios(payload);
      setSelectedScenario(payload[0] ?? null);
      setSelectedOption(payload[0]?.options[0]?.key ?? "");
    });
  }, [session.token]);

  if (session.loading) {
    return <main className="grid min-h-screen place-items-center text-slate-300">Loading simulations...</main>;
  }

  if (!session.token || !session.user) {
    return (
      <main className="min-h-screen px-5 py-6">
        <AuthRequired />
      </main>
    );
  }

  const submit = async () => {
    const token = session.token;
    if (!selectedScenario || !token) {
      return;
    }
    const payload = await api.submitSimulation(selectedScenario.key, { selected_option: selectedOption, rationale }, token);
    setResult(payload);
  };

  return (
    <AppShell title="PM simulation engine" eyebrow="PM90 Scenario Lab" user={session.user} onLogout={session.logout}>
      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <section className="rounded-[30px] border border-white/10 bg-slate-950/55 p-6">
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/75">Scenario catalog</p>
          <div className="mt-5 space-y-3">
            {scenarios.map((scenario) => (
              <button
                key={scenario.key}
                onClick={() => {
                  setSelectedScenario(scenario);
                  setSelectedOption(scenario.options[0]?.key ?? "");
                  setResult(null);
                }}
                className={`block w-full rounded-[22px] border px-4 py-4 text-left transition ${
                  selectedScenario?.key === scenario.key ? "border-cyan-300/25 bg-cyan-400/10" : "border-white/10 bg-white/5"
                }`}
              >
                <p className="font-medium text-white">{scenario.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">{scenario.summary}</p>
              </button>
            ))}
          </div>
        </section>

        {selectedScenario ? (
          <section className="rounded-[30px] border border-white/10 bg-slate-950/55 p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/75">Active simulation</p>
            <h3 className="mt-3 text-3xl font-semibold text-white">{selectedScenario.title}</h3>
            <p className="mt-4 text-slate-300">{selectedScenario.challenge}</p>
            <div className="mt-6 rounded-[22px] border border-white/10 bg-white/5 p-5 text-sm leading-7 text-slate-200">
              {selectedScenario.business_context}
            </div>
            <div className="mt-6 space-y-3">
              {selectedScenario.options.map((option) => (
                <label key={option.key} className="flex cursor-pointer items-start gap-3 rounded-[22px] border border-white/10 bg-white/5 px-4 py-4">
                  <input
                    type="radio"
                    checked={selectedOption === option.key}
                    onChange={() => setSelectedOption(option.key)}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium text-white">{option.label}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-300">{option.description}</p>
                  </div>
                </label>
              ))}
            </div>
            <textarea
              value={rationale}
              onChange={(event) => setRationale(event.target.value)}
              placeholder="Explain your decision, what signal you would look for, and the trade-off you are accepting."
              className="mt-5 min-h-[180px] w-full rounded-[22px] border border-white/10 bg-white/5 px-4 py-4 text-sm text-white outline-none placeholder:text-slate-500"
            />
            <button
              onClick={submit}
              disabled={rationale.length < 8}
              className="mt-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-teal-300 px-5 py-3 text-sm font-medium text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Evaluate decision
            </button>
            <div className="mt-6 rounded-[22px] border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-slate-400">Recommended focus</p>
              <p className="mt-2 text-slate-200">{selectedScenario.recommended_focus}</p>
              <pre className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-200">{result?.feedback ?? "Your evaluation will appear here."}</pre>
              {result ? <p className="mt-4 text-sm text-emerald-200">Score: {result.score} · XP balance: {result.xp_balance}</p> : null}
            </div>
          </section>
        ) : null}
      </div>
    </AppShell>
  );
}
