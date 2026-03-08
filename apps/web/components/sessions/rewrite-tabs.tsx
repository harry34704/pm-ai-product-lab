"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const tabs = [
  { key: "improvedAnswer", label: "Improved" },
  { key: "starRewrite", label: "STAR" },
  { key: "conciseRewrite", label: "Concise" },
  { key: "executiveRewrite", label: "Executive" }
] as const;

export function RewriteTabs({ answer }: { answer: any }) {
  const [active, setActive] = useState<(typeof tabs)[number]["key"]>("improvedAnswer");

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <Button key={tab.key} variant={active === tab.key ? "default" : "secondary"} size="sm" onClick={() => setActive(tab.key)}>
            {tab.label}
          </Button>
        ))}
      </div>
      <div className="rounded-xl border border-border bg-slate-950/60 p-4 text-sm text-slate-300">{answer[active] || "No rewrite generated yet."}</div>
    </div>
  );
}
