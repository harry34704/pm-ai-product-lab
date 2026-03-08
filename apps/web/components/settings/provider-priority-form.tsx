"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function ProviderPriorityForm({ settings, health }: { settings: any; health: any[] }) {
  const [priority, setPriority] = useState((settings.aiProviderPriority as string[]).join(","));
  const [pending, setPending] = useState(false);

  async function save() {
    setPending(true);
    const response = await fetch("/api/settings/providers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        aiProviderPriority: priority.split(",").map((item) => item.trim()).filter(Boolean)
      })
    });
    const payload = await response.json();
    setPending(false);

    if (!response.ok) {
      toast.error(payload.error ?? "Could not update provider priority.");
      return;
    }

    toast.success("Provider priority updated.");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI provider priority</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input value={priority} onChange={(event) => setPriority(event.target.value)} />
        <div className="rounded-xl border border-border bg-slate-950/60 p-4 text-sm text-slate-400">
          {health.map((provider) => (
            <p key={provider.provider}>
              {provider.provider}: {provider.detail}
            </p>
          ))}
        </div>
        <Button onClick={save} disabled={pending}>
          {pending ? "Saving..." : "Save priority"}
        </Button>
      </CardContent>
    </Card>
  );
}
