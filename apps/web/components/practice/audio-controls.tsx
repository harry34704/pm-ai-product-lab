"use client";

import { useState } from "react";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AudioControls({
  micStatus,
  onMicReady
}: {
  micStatus: "idle" | "ready" | "recording" | "denied";
  onMicReady: (status: "ready" | "denied") => void;
}) {
  const [pending, setPending] = useState(false);

  async function requestMic() {
    try {
      setPending(true);
      await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      onMicReady("ready");
    } catch {
      onMicReady("denied");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button onClick={requestMic} disabled={pending}>
        {micStatus === "ready" || micStatus === "recording" ? <Mic className="mr-2 h-4 w-4" /> : <MicOff className="mr-2 h-4 w-4" />}
        {pending ? "Checking mic..." : micStatus === "ready" || micStatus === "recording" ? "Mic ready" : "Enable microphone"}
      </Button>
      <p className="text-sm text-slate-400">{micStatus === "denied" ? "Microphone permission denied." : "Audio is required for the practice room."}</p>
    </div>
  );
}
