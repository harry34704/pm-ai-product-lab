import type { z } from "zod";
import type { ChatMessage, ProviderCallOptions, ProviderHealth } from "../../types";
import type { AIProvider, ProviderEnvironment } from "./base";

export class OllamaProvider implements AIProvider {
  readonly id = "ollama" as const;

  constructor(private readonly env: ProviderEnvironment) {}

  isConfigured(): boolean {
    return Boolean(this.env.baseUrl && this.env.defaultModel);
  }

  async generateText(messages: ChatMessage[], options?: ProviderCallOptions): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error("Ollama provider is not configured.");
    }

    const response = await fetch(`${this.env.baseUrl}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: options?.model ?? this.env.defaultModel,
        stream: false,
        messages
      }),
      signal: AbortSignal.timeout(options?.timeoutMs ?? 20000)
    });

    if (!response.ok) {
      throw new Error(`Ollama provider failed with ${response.status}.`);
    }

    const payload = await response.json();
    return payload.message?.content ?? "";
  }

  async generateStructured<T>(messages: ChatMessage[], schema: z.ZodSchema<T>, options?: ProviderCallOptions): Promise<T> {
    const text = await this.generateText(messages, options);
    return schema.parse(JSON.parse(text));
  }

  async transcribeAudio(): Promise<string> {
    throw new Error("Ollama transcription is not available in this MVP.");
  }

  async healthCheck(): Promise<ProviderHealth> {
    return {
      provider: this.id,
      ok: this.isConfigured(),
      detail: this.isConfigured() ? "Configured" : "Missing base URL or model"
    };
  }
}
