"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ConsentBanner } from "./consent-banner";
import { PracticeRoomLobby } from "./practice-room-lobby";
import { SessionTimer } from "./session-timer";
import { AudioControls } from "./audio-controls";
import { ParticipantList } from "./participant-list";
import { TranscriptPanel } from "./transcript-panel";
import { CoachingPanel } from "./coaching-panel";
import { usePracticeStore } from "@/store/practice-store";
import { useSpeechTranscription } from "@/hooks/use-speech-transcription";

async function fetchRoom(roomId: string) {
  const response = await fetch(`/api/practice/room/${roomId}`);
  if (!response.ok) {
    throw new Error("Unable to load room.");
  }
  return response.json();
}

export function PracticeRoomScreen({ roomId, initialRoom }: { roomId: string; initialRoom: any }) {
  const queryClient = useQueryClient();
  const [manualEntry, setManualEntry] = useState("");
  const {
    micStatus,
    consentGiven,
    transcriptActive,
    transcript,
    coaching,
    sessionId,
    setMicStatus,
    setConsentGiven,
    setTranscriptActive,
    appendTranscript,
    setCoaching,
    setSessionId
  } = usePracticeStore();

  const { data } = useQuery({
    queryKey: ["practice-room", roomId],
    queryFn: () => fetchRoom(roomId),
    initialData: { room: initialRoom },
    refetchInterval: 2000
  });

  const room = data.room;
  const currentSession = room.sessions?.[0] ?? null;

  useEffect(() => {
    if (currentSession?.id) {
      setSessionId(currentSession.id);
    }
  }, [currentSession?.id, setSessionId]);

  async function sendTranscript(text: string, role: "CANDIDATE" | "INTERVIEWER" | "SYSTEM" = "CANDIDATE") {
    if (!sessionId || !consentGiven || !text.trim()) {
      return;
    }

    const event = {
      speakerLabel: role === "INTERVIEWER" ? "Interviewer" : role === "SYSTEM" ? "Manual Note" : "Candidate",
      role,
      text,
      timestampMs: Date.now()
    };

    appendTranscript(event);

    await fetch("/api/practice/transcript-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, event })
    });

    queryClient.invalidateQueries({ queryKey: ["practice-room", roomId] });
  }

  const speech = useSpeechTranscription((text) => {
    if (transcriptActive) {
      sendTranscript(text, "CANDIDATE");
    }
  });

  useEffect(() => {
    if (!sessionId || !consentGiven || room.status !== "LIVE") {
      return;
    }

    const interval = window.setInterval(async () => {
      const response = await fetch(`/api/practice/coaching?sessionId=${sessionId}`);
      const payload = await response.json();
      if (response.ok) {
        setCoaching(payload.hints);
      }
    }, 3000);

    return () => window.clearInterval(interval);
  }, [consentGiven, room.status, sessionId, setCoaching]);

  const mergedTranscript = useMemo(() => {
    const persisted = (currentSession?.transcriptJson ?? []) as any[];
    return persisted.length ? persisted : transcript;
  }, [currentSession?.transcriptJson, transcript]);

  async function toggleTranscript() {
    if (!speech.isSupported) {
      toast.info("Browser speech recognition is unavailable. Use the manual note field below.");
      return;
    }

    if (transcriptActive) {
      speech.stop();
      setTranscriptActive(false);
      return;
    }

    speech.start();
    setTranscriptActive(true);
  }

  async function submitManualEntry() {
    await sendTranscript(manualEntry, "SYSTEM");
    setManualEntry("");
  }

  async function endSession() {
    if (!sessionId) {
      return;
    }

    const response = await fetch("/api/practice/end-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId })
    });
    const payload = await response.json();

    if (!response.ok) {
      toast.error(payload.error ?? "Could not end session.");
      return;
    }

    toast.success("Session ended. Review is ready.");
    queryClient.invalidateQueries({ queryKey: ["practice-room", roomId] });
  }

  return (
    <div className="space-y-6">
      {room.status === "LOBBY" ? <PracticeRoomLobby room={room} /> : null}
      <ConsentBanner consentGiven={consentGiven} onConsent={() => setConsentGiven(true)} />
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-2">
            <SessionTimer durationMinutes={room.durationMinutes} startedAt={currentSession?.startedAt ?? room.startedAt} />
            <Card>
              <CardContent className="space-y-4 py-4">
                <AudioControls micStatus={micStatus} onMicReady={setMicStatus} />
                <div className="flex flex-wrap gap-3">
                  <Button variant="secondary" onClick={toggleTranscript} disabled={!consentGiven || room.status !== "LIVE"}>
                    {transcriptActive ? "Stop transcript" : "Start transcript"}
                  </Button>
                  <Button variant="danger" onClick={endSession} disabled={room.status !== "LIVE"}>
                    End session
                  </Button>
                </div>
                <p className="text-sm text-slate-400">
                  Browser speech recognition: {speech.isSupported ? (speech.isActive ? "listening" : "available") : "unsupported"}
                </p>
              </CardContent>
            </Card>
          </div>
          <TranscriptPanel transcript={mergedTranscript} />
          <Card>
            <CardContent className="space-y-3 py-4">
              <p className="font-medium">Manual note fallback</p>
              <Textarea value={manualEntry} onChange={(event) => setManualEntry(event.target.value)} placeholder="Add manual notes when speech recognition is unavailable..." />
              <Button variant="secondary" onClick={submitManualEntry} disabled={!manualEntry || !sessionId || !consentGiven}>
                Save note
              </Button>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <ParticipantList participants={room.participants} />
          <CoachingPanel micStatus={micStatus} transcriptActive={transcriptActive} hints={coaching} />
        </div>
      </div>
    </div>
  );
}
