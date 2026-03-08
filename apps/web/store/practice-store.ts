"use client";

import { create } from "zustand";
import type { CoachingHints, TranscriptEvent } from "@mockroom/shared";

type PracticeState = {
  micStatus: "idle" | "ready" | "recording" | "denied";
  consentGiven: boolean;
  transcriptActive: boolean;
  transcript: TranscriptEvent[];
  coaching: CoachingHints | null;
  sessionId: string | null;
  setMicStatus: (status: PracticeState["micStatus"]) => void;
  setConsentGiven: (consent: boolean) => void;
  setTranscriptActive: (active: boolean) => void;
  appendTranscript: (event: TranscriptEvent) => void;
  setCoaching: (hints: CoachingHints | null) => void;
  setSessionId: (sessionId: string | null) => void;
  reset: () => void;
};

export const usePracticeStore = create<PracticeState>((set) => ({
  micStatus: "idle",
  consentGiven: false,
  transcriptActive: false,
  transcript: [],
  coaching: null,
  sessionId: null,
  setMicStatus: (micStatus) => set({ micStatus }),
  setConsentGiven: (consentGiven) => set({ consentGiven }),
  setTranscriptActive: (transcriptActive) => set({ transcriptActive }),
  appendTranscript: (event) => set((state) => ({ transcript: [...state.transcript, event] })),
  setCoaching: (coaching) => set({ coaching }),
  setSessionId: (sessionId) => set({ sessionId }),
  reset: () =>
    set({
      micStatus: "idle",
      consentGiven: false,
      transcriptActive: false,
      transcript: [],
      coaching: null,
      sessionId: null
    })
}));
