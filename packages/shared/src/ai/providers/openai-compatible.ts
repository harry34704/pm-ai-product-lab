import type { z } from "zod";
import { safeJsonParse } from "../../utils/json";
import type { ChatMessage, ProviderCallOptions, ProviderHealth } from "../../types";
import type { AIProvider, ProviderEnvironment } from "./base";

export class OpenAICompatibleProvider implements AIProvider {
  readonly id = "openai" as const;

  constructor(private readonly env: ProviderEnvironment) {}

  isConfigured(): boolean {
    return Boolean(this.env.baseUrl && this.env.apiKey);
  }

  async generateText(messages: ChatMessage[], options?: ProviderCallOptions): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error("OpenAI provider is not configured.");
    }

    const response = await fetch(`${this.env.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.env.apiKey}`,
        ...this.env.headers
      },
      body: JSON.stringify({
        model: options?.model ?? this.env.defaultModel,
        temperature: options?.temperature ?? 0.2,
        messages
      }),
      signal: AbortSignal.timeout(options?.timeoutMs ?? 15000)
    });

    if (!response.ok) {
      throw new Error(`OpenAI provider failed with ${response.status}.`);
    }

    const payload = await response.json();
    return payload.choices?.[0]?.message?.content ?? "";
  }

  async generateStructured<T>(messages: ChatMessage[], schema: z.ZodSchema<T>, options?: ProviderCallOptions): Promise<T> {
    const text = await this.generateText(messages, options);
    const parsed = safeJsonParse<T>(text);

    if (!parsed) {
      throw new Error("OpenAI provider did not return valid JSON.");
    }

    return schema.parse(parsed);
  }

  async transcribeAudio(audio: Uint8Array, options?: ProviderCallOptions): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error("OpenAI provider is not configured.");
    }

    const formData = new FormData();
    formData.append("model", options?.model ?? this.env.defaultModel ?? "whisper-1");
    formData.append("file", new Blob([audio], { type: "audio/webm" }), "audio.webm");

    const response = await fetch(`${this.env.baseUrl}/audio/transcriptions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.env.apiKey}`,
        ...this.env.headers
      },
      body: formData,
      signal: AbortSignal.timeout(options?.timeoutMs ?? 30000)
    });

    if (!response.ok) {
      throw new Error(`OpenAI transcription failed with ${response.status}.`);
    }

    const payload = await response.json();
    return payload.text ?? "";
  }

  async healthCheck(): Promise<ProviderHealth> {
    return {
      provider: this.id,
      ok: this.isConfigured(),
      detail: this.isConfigured() ? "Configured" : "Missing base URL or API key"
    };
  }
}
