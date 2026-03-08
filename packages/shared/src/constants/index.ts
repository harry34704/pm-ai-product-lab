export const PROVIDER_IDS = ["mock", "openai", "groq", "openrouter", "ollama"] as const;

export const PRACTICE_DURATIONS = [15, 30, 45, 60] as const;

export const PRACTICE_ROLES = ["CANDIDATE", "INTERVIEWER"] as const;

export const STORY_CATEGORIES = [
  "LEADERSHIP",
  "DELIVERY",
  "ANALYTICS",
  "STAKEHOLDER_MANAGEMENT",
  "OWNERSHIP",
  "CONFLICT",
  "FAILURE",
  "CUSTOMER_FOCUS",
  "AMBIGUITY"
] as const;
