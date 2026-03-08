"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";

export function StoryEditor({ story }: { story: any }) {
  const [draft, setDraft] = useState(story);
  const [pending, setPending] = useState(false);

  async function save() {
    setPending(true);
    const response = await fetch(`/api/stories/${story.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft)
    });
    const payload = await response.json();
    setPending(false);

    if (!response.ok) {
      toast.error(payload.error ?? "Could not update story.");
      return;
    }

    toast.success("Story updated.");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit story</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} />
        <Select value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })}>
          {["LEADERSHIP", "DELIVERY", "ANALYTICS", "STAKEHOLDER_MANAGEMENT", "OWNERSHIP", "CONFLICT", "FAILURE", "CUSTOMER_FOCUS", "AMBIGUITY"].map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>
        <Textarea value={draft.scenario} onChange={(event) => setDraft({ ...draft, scenario: event.target.value })} />
        <Textarea value={draft.task} onChange={(event) => setDraft({ ...draft, task: event.target.value })} />
        <Textarea value={draft.action} onChange={(event) => setDraft({ ...draft, action: event.target.value })} />
        <Textarea value={draft.result} onChange={(event) => setDraft({ ...draft, result: event.target.value })} />
        <Textarea value={draft.evidence} onChange={(event) => setDraft({ ...draft, evidence: event.target.value })} />
        <Button onClick={save} disabled={pending}>
          {pending ? "Saving..." : "Save story"}
        </Button>
      </CardContent>
    </Card>
  );
}
