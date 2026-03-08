"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export default function NewPracticeRoomPage() {
  const router = useRouter();
  const [title, setTitle] = useState("Mock Interview Room");
  const [durationMinutes, setDurationMinutes] = useState("30");
  const [displayName, setDisplayName] = useState("Candidate");
  const [role, setRole] = useState("CANDIDATE");
  const [pending, setPending] = useState(false);

  async function createRoom() {
    setPending(true);
    const response = await fetch("/api/practice/create-room", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        durationMinutes: Number(durationMinutes),
        displayName,
        role
      })
    });
    const payload = await response.json();
    setPending(false);

    if (!response.ok) {
      toast.error(payload.error ?? "Unable to create room.");
      return;
    }

    router.push(`/practice/${payload.room.id}`);
  }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Practice Room" title="Create mock interview room" description="Visible practice only. Invite another participant, capture consent, and run a timed rehearsal." />
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Create room</CardTitle>
          <CardDescription>Audio is required. Video remains optional in this MVP, and transcript coaching stays visible in-app.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Room title" />
          <Input value={displayName} onChange={(event) => setDisplayName(event.target.value)} placeholder="Your display name" />
          <div className="grid gap-4 md:grid-cols-2">
            <Select value={role} onChange={(event) => setRole(event.target.value)}>
              <option value="CANDIDATE">Candidate</option>
              <option value="INTERVIEWER">Interviewer</option>
            </Select>
            <Select value={durationMinutes} onChange={(event) => setDurationMinutes(event.target.value)}>
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">60 minutes</option>
            </Select>
          </div>
          <Button onClick={createRoom} disabled={pending}>
            {pending ? "Creating..." : "Create room"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
