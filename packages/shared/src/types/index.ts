export type ProviderId = "mock" | "openai" | "groq" | "openrouter" | "ollama";

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type ProviderCallOptions = {
  model?: string;
  temperature?: number;
  timeoutMs?: number;
};

export type TranscriptEvent = {
  speakerLabel: string;
  role: "CANDIDATE" | "INTERVIEWER" | "SYSTEM";
  text: string;
  timestampMs: number;
};

export type CoachingHints = {
  questionIntent: string;
  answerStructure: string[];
  resumeEvidence: string[];
  starReminders: string[];
  followUps: string[];
  nudges: string[];
};

export type ProviderHealth = {
  provider: ProviderId;
  ok: boolean;
  detail: string;
};
