"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export function ModelConfigForm({ settings }: { settings: any }) {
  const [defaultModel, setDefaultModel] = useState(settings.defaultModel ?? "mock-1");
  const [transcriptionProvider, setTranscriptionProvider] = useState(settings.transcriptionProvider);
  const [coachingLevel, setCoachingLevel] = useState(settings.coachingLevel);
  const [pending, setPending] = useState(false);

  async function save() {
    setPending(true);
    const response = await fetch("/api/settings/providers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ defaultModel, transcriptionProvider, coachingLevel })
    });
    const payload = await response.json();
    setPending(false);

    if (!response.ok) {
      toast.error(payload.error ?? "Could not update model settings.");
      return;
    }

    toast.success("Model settings updated.");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Model configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input value={defaultModel} onChange={(event) => setDefaultModel(event.target.value)} placeholder="Default model" />
        <Select value={transcriptionProvider} onChange={(event) => setTranscriptionProvider(event.target.value)}>
          <option value="browser">Browser Speech API</option>
          <option value="whisper_api">Whisper API</option>
          <option value="local">Manual/local fallback</option>
        </Select>
        <Select value={coachingLevel} onChange={(event) => setCoachingLevel(event.target.value)}>
          <option value="light">Light</option>
          <option value="balanced">Balanced</option>
          <option value="intense">Intense</option>
        </Select>
        <Button onClick={save} disabled={pending}>
          {pending ? "Saving..." : "Save model settings"}
        </Button>
      </CardContent>
    </Card>
  );
}
