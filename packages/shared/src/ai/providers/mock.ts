import type { z } from "zod";
import type { ChatMessage, ProviderCallOptions, ProviderHealth } from "../../types";
import type { AIProvider } from "./base";

export class MockProvider implements AIProvider {
  readonly id = "mock" as const;

  isConfigured(): boolean {
    return true;
  }

  async generateText(messages: ChatMessage[]): Promise<string> {
    const lastUserMessage = [...messages].reverse().find((message) => message.role === "user");
    return `Mock provider response for: ${lastUserMessage?.content ?? "request"}`;
  }

  async generateStructured<T>(_messages: ChatMessage[], schema: z.ZodSchema<T>, _options?: ProviderCallOptions): Promise<T> {
    const fallbackObject = schema.safeParse({});

    if (fallbackObject.success) {
      return fallbackObject.data;
    }

    throw new Error("Mock provider requires services to supply deterministic fallbacks.");
  }

  async transcribeAudio(): Promise<string> {
    return "Mock transcription unavailable. Use browser speech or manual notes.";
  }

  async healthCheck(): Promise<ProviderHealth> {
    return {
      provider: this.id,
      ok: true,
      detail: "Always available for local MVP"
    };
  }
}
