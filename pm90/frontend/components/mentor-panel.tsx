"use client";

import { useState } from "react";

import { api } from "@/lib/api";
import type { MentorResponse } from "@/lib/types";

declare global {
  interface Window {
    webkitSpeechRecognition?: new () => SpeechRecognition;
    SpeechRecognition?: new () => SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
}

interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
    length: number;
  };
}

export function MentorPanel({
  token,
  context,
  defaultPrompt = "",
  mode = "coach",
}: {
  token: string;
  context?: string;
  defaultPrompt?: string;
  mode?: string;
}) {
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<MentorResponse | null>(null);

  const speak = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 0.95;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    if (typeof window === "undefined") {
      return;
    }
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      return;
    }
    const recognition = new Recognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setPrompt((current) => (current ? `${current} ${transcript}` : transcript));
    };
    recognition.start();
  };

  const submit = async () => {
    setLoading(true);
    try {
      const result = await api.mentorChat({ prompt, context, mode }, token);
      setResponse(result);
      speak(result.response);
    } catch (error) {
      setResponse({
        mode,
        provider: "system",
        response: error instanceof Error ? error.message : "Unable to reach the AI mentor right now.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-[30px] border border-cyan-300/15 bg-slate-950/60 p-6 shadow-[0_20px_60px_rgba(2,6,23,0.32)] backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/75">AI Mentor</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">Coach, review, or simulate in one panel.</h3>
        </div>
        <button
          onClick={startListening}
          className="rounded-2xl border border-white/10 px-4 py-3 text-sm text-slate-200 transition hover:border-white/20 hover:bg-white/5"
        >
          Voice input
        </button>
      </div>
      <textarea
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        placeholder="Ask about a product concept, share a PRD excerpt, or rehearse a PM interview answer."
        className="mt-5 min-h-[170px] w-full rounded-[24px] border border-white/10 bg-white/5 px-4 py-4 text-sm text-white outline-none placeholder:text-slate-500"
      />
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          onClick={submit}
          disabled={loading || prompt.trim().length < 3}
          className="rounded-2xl bg-gradient-to-r from-cyan-400 to-teal-300 px-5 py-3 text-sm font-medium text-slate-950 transition disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Thinking..." : "Send to mentor"}
        </button>
      </div>
      <div className="mt-5 rounded-[24px] border border-white/10 bg-white/5 p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-white">Latest response</p>
          {response ? <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{response.provider}</p> : null}
        </div>
        <pre className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-200">
          {response?.response ?? "Your coaching feedback will appear here."}
        </pre>
      </div>
    </div>
  );
}
