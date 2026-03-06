"use client";

import { useEffect, useState } from "react";

import { AppShell } from "@/components/shell";
import { api, useSession } from "@/lib/api";
import type { ResourcePayload } from "@/lib/types";

export default function ResourcesPage() {
  const session = useSession();
  const [resources, setResources] = useState<ResourcePayload["resources"]>([]);

  useEffect(() => {
    api.resources().then((payload) => setResources(payload.resources));
  }, []);

  return (
    <AppShell title="Resource hub" eyebrow="PM90 Library" user={session.user} onLogout={session.logout}>
      <section className="rounded-[30px] border border-white/10 bg-slate-950/55 p-6">
        <p className="text-sm text-slate-300">Curated, free resources for SQL, strategy, APIs, analytics, research, and PM career development.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {resources.map((resource) => (
            <a
              key={resource.title}
              href={resource.url}
              target="_blank"
              rel="noreferrer"
              className="rounded-[24px] border border-white/10 bg-white/5 p-5 transition hover:border-cyan-300/20 hover:bg-white/7"
            >
              <p className="text-xs uppercase tracking-[0.28em] text-cyan-200">{resource.category}</p>
              <h3 className="mt-3 text-xl font-semibold text-white">{resource.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">{resource.description}</p>
              <p className="mt-4 text-sm text-slate-400">{resource.format}</p>
            </a>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
