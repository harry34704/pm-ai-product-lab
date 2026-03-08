"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export function PracticeRoomLobby({ room }: { room: any }) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState("INTERVIEWER");
  const [pending, setPending] = useState(false);
  const [starting, setStarting] = useState(false);

  async function joinRoom() {
    setPending(true);
    const response = await fetch("/api/practice/join-room", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roomId: room.id,
        displayName,
        role
      })
    });
    const payload = await response.json();
    setPending(false);

    if (!response.ok) {
      toast.error(payload.error ?? "Unable to join room.");
      return;
    }

    toast.success("Joined room.");
    router.refresh();
  }

  async function startSession() {
    setStarting(true);
    const response = await fetch("/api/practice/start-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId: room.id })
    });
    const payload = await response.json();
    setStarting(false);

    if (!response.ok) {
      toast.error(payload.error ?? "Unable to start session.");
      return;
    }

    toast.success("Session started.");
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{room.title}</CardTitle>
        <CardDescription>Room code {room.roomCode}. Invite another person, confirm transcript consent, then start the mock interview.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
          <Input value={displayName} onChange={(event) => setDisplayName(event.target.value)} placeholder="Display name" />
          <Select value={role} onChange={(event) => setRole(event.target.value)}>
            <option value="CANDIDATE">Candidate</option>
            <option value="INTERVIEWER">Interviewer</option>
          </Select>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={joinRoom} disabled={!displayName || pending}>
            {pending ? "Joining..." : "Join room"}
          </Button>
          <Button onClick={startSession} disabled={starting}>
            {starting ? "Starting..." : "Start practice session"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
