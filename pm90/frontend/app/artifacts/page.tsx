"use client";

import { useEffect, useState } from "react";

import { AppShell } from "@/components/shell";
import { AuthRequired } from "@/components/auth-required";
import { api, useSession } from "@/lib/api";
import type { Artifact } from "@/lib/types";

export default function ArtifactsPage() {
  const session = useSession();
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [form, setForm] = useState({ product_name: "", audience: "", problem: "", outcome: "", context: "" });
  const [customArtifact, setCustomArtifact] = useState({
    title: "",
    kind: "case-study",
    summary: "",
    content: "",
  });
  const [status, setStatus] = useState("");

  const loadArtifacts = async () => {
    const token = session.token;
    if (!token) {
      return;
    }
    const items = await api.artifacts(token);
    setArtifacts(items);
  };

  useEffect(() => {
    loadArtifacts();
  }, [session.token]);

  if (session.loading) {
    return <main className="grid min-h-screen place-items-center text-slate-300">Loading portfolio builder...</main>;
  }

  if (!session.token || !session.user) {
    return (
      <main className="min-h-screen px-5 py-6">
        <AuthRequired />
      </main>
    );
  }

  const generate = async (type: "prd" | "roadmap" | "prioritization" | "persona" | "north-star") => {
    const artifact = await api.generateArtifact(type, form, session.token!);
    setStatus(`${artifact.title} generated.`);
    setArtifacts((current) => [artifact, ...current]);
  };

  const saveCustomArtifact = async () => {
    const artifact = await api.createArtifact(customArtifact, session.token!);
    setStatus(`${artifact.title} saved to your portfolio.`);
    setArtifacts((current) => [artifact, ...current]);
    setCustomArtifact({ title: "", kind: "case-study", summary: "", content: "" });
  };

  const download = async (artifactId: number, format: "markdown" | "notion" | "pdf") => {
    const response = await api.exportArtifact(artifactId, format, session.token!);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `pm90-artifact-${artifactId}.${format === "pdf" ? "pdf" : format === "markdown" ? "md" : "txt"}`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <AppShell title="Portfolio builder" eyebrow="PM90 Artifact Studio" user={session.user} onLogout={session.logout}>
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <section className="rounded-[30px] border border-white/10 bg-slate-950/55 p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/75">Generate artifacts</p>
            <div className="mt-5 space-y-4">
              {[
                ["product_name", "Product name"],
                ["audience", "Audience"],
                ["problem", "Problem"],
                ["outcome", "Outcome"],
              ].map(([key, label]) => (
                <input
                  key={key}
                  value={form[key as keyof typeof form]}
                  onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
                  placeholder={label}
                  className="w-full rounded-[22px] border border-white/10 bg-white/5 px-4 py-4 text-white outline-none placeholder:text-slate-500"
                />
              ))}
              <textarea
                value={form.context}
                onChange={(event) => setForm((current) => ({ ...current, context: event.target.value }))}
                placeholder="Additional context"
                className="min-h-[150px] w-full rounded-[22px] border border-white/10 bg-white/5 px-4 py-4 text-white outline-none placeholder:text-slate-500"
              />
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <button onClick={() => generate("prd")} className="rounded-2xl bg-white/8 px-4 py-3 text-sm text-white">Generate PRD</button>
              <button onClick={() => generate("roadmap")} className="rounded-2xl bg-white/8 px-4 py-3 text-sm text-white">Generate roadmap</button>
              <button onClick={() => generate("prioritization")} className="rounded-2xl bg-white/8 px-4 py-3 text-sm text-white">Prioritization board</button>
              <button onClick={() => generate("persona")} className="rounded-2xl bg-white/8 px-4 py-3 text-sm text-white">User persona</button>
              <button onClick={() => generate("north-star")} className="rounded-2xl bg-white/8 px-4 py-3 text-sm text-white">North star metric</button>
            </div>
            {status ? <p className="mt-4 text-sm text-emerald-200">{status}</p> : null}
          </section>

          <section className="rounded-[30px] border border-white/10 bg-slate-950/55 p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/75">Save manual artifact</p>
            <div className="mt-5 space-y-4">
              <input
                value={customArtifact.title}
                onChange={(event) => setCustomArtifact((current) => ({ ...current, title: event.target.value }))}
                placeholder="Artifact title"
                className="w-full rounded-[22px] border border-white/10 bg-white/5 px-4 py-4 text-white outline-none placeholder:text-slate-500"
              />
              <select
                value={customArtifact.kind}
                onChange={(event) => setCustomArtifact((current) => ({ ...current, kind: event.target.value }))}
                className="w-full rounded-[22px] border border-white/10 bg-white/5 px-4 py-4 text-white outline-none"
              >
                {["case-study", "challenge", "research-brief", "notes"].map((option) => (
                  <option key={option} value={option} className="bg-slate-950">
                    {option}
                  </option>
                ))}
              </select>
              <input
                value={customArtifact.summary}
                onChange={(event) => setCustomArtifact((current) => ({ ...current, summary: event.target.value }))}
                placeholder="Short summary"
                className="w-full rounded-[22px] border border-white/10 bg-white/5 px-4 py-4 text-white outline-none placeholder:text-slate-500"
              />
              <textarea
                value={customArtifact.content}
                onChange={(event) => setCustomArtifact((current) => ({ ...current, content: event.target.value }))}
                placeholder="Store a PM case study, challenge response, or portfolio note."
                className="min-h-[180px] w-full rounded-[22px] border border-white/10 bg-white/5 px-4 py-4 text-white outline-none placeholder:text-slate-500"
              />
            </div>
            <button
              onClick={saveCustomArtifact}
              disabled={customArtifact.title.trim().length < 3 || customArtifact.content.trim().length < 8}
              className="mt-5 rounded-2xl bg-gradient-to-r from-cyan-400 to-teal-300 px-5 py-3 text-sm font-medium text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Save to portfolio
            </button>
          </section>
        </div>

        <section className="rounded-[30px] border border-white/10 bg-slate-950/55 p-6">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/75">Saved artifacts</p>
            <p className="text-sm text-slate-400">{artifacts.length} total</p>
          </div>
          <div className="mt-5 space-y-4">
            {artifacts.map((artifact) => (
              <div key={artifact.id} className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500">{artifact.kind}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{new Date(artifact.created_at).toLocaleDateString()}</p>
                </div>
                <h3 className="mt-2 text-xl font-semibold text-white">{artifact.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{artifact.summary ?? "Portfolio artifact"}</p>
                <pre className="mt-4 max-h-48 overflow-hidden whitespace-pre-wrap text-xs leading-6 text-slate-400">{artifact.content}</pre>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button onClick={() => download(artifact.id, "markdown")} className="rounded-full border border-white/10 px-3 py-2 text-xs text-slate-200">Markdown</button>
                  <button onClick={() => download(artifact.id, "pdf")} className="rounded-full border border-white/10 px-3 py-2 text-xs text-slate-200">PDF</button>
                  <button onClick={() => download(artifact.id, "notion")} className="rounded-full border border-white/10 px-3 py-2 text-xs text-slate-200">Notion</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
