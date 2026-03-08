import type { z } from "zod";
import { PROVIDER_IDS } from "../constants";
import type { ChatMessage, ProviderCallOptions, ProviderHealth, ProviderId } from "../types";
import type { AIProvider } from "./providers/base";
import { GroqCompatibleProvider } from "./providers/groq-compatible";
import { MockProvider } from "./providers/mock";
import { OllamaProvider } from "./providers/ollama";
import { OpenAICompatibleProvider } from "./providers/openai-compatible";
import { OpenRouterCompatibleProvider } from "./providers/openrouter-compatible";

type RouterOptions = {
  priority?: ProviderId[];
  onFallback?: (message: string) => void;
  providers?: Partial<Record<ProviderId, AIProvider>>;
};

export class ProviderRouter {
  private readonly providers: Record<ProviderId, AIProvider>;
  private readonly priority: ProviderId[];
  private readonly onFallback?: (message: string) => void;

  constructor(options: RouterOptions = {}) {
    this.providers = {
      mock: options.providers?.mock ?? new MockProvider(),
      openai:
        options.providers?.openai ??
        new OpenAICompatibleProvider({
          baseUrl: process.env.OPENAI_BASE_URL,
          apiKey: process.env.OPENAI_API_KEY,
          defaultModel: process.env.OPENAI_MODEL
        }),
      groq:
        options.providers?.groq ??
        new GroqCompatibleProvider({
          apiKey: process.env.GROQ_API_KEY,
          defaultModel: process.env.GROQ_MODEL
        }),
      openrouter:
        options.providers?.openrouter ??
        new OpenRouterCompatibleProvider({
          apiKey: process.env.OPENROUTER_API_KEY,
          defaultModel: process.env.OPENROUTER_MODEL
        }),
      ollama:
        options.providers?.ollama ??
        new OllamaProvider({
          baseUrl: process.env.OLLAMA_BASE_URL,
          defaultModel: process.env.OLLAMA_MODEL
        })
    };

    this.priority = options.priority?.length
      ? options.priority
      : ((process.env.AI_PROVIDER_PRIORITY?.split(",").map((entry) => entry.trim()) as ProviderId[] | undefined) ?? [
          "mock",
          "openai",
          "groq",
          "openrouter",
          "ollama"
        ]);

    this.onFallback = options.onFallback;
  }

  private providerOrder(): ProviderId[] {
    const validPriority = this.priority.filter((id): id is ProviderId => PROVIDER_IDS.includes(id));
    return validPriority.length ? validPriority : ["mock"];
  }

  async generateText(messages: ChatMessage[], options?: ProviderCallOptions): Promise<string> {
    return this.runAcrossProviders((provider) => provider.generateText(messages, options));
  }

  async generateStructured<T>(messages: ChatMessage[], schema: z.ZodSchema<T>, options?: ProviderCallOptions): Promise<T> {
    return this.runAcrossProviders((provider) => provider.generateStructured(messages, schema, options));
  }

  async transcribeAudio(audio: Uint8Array, options?: ProviderCallOptions): Promise<string> {
    return this.runAcrossProviders((provider) => provider.transcribeAudio(audio, options));
  }

  async healthCheck(): Promise<ProviderHealth[]> {
    return Promise.all(this.providerOrder().map((providerId) => this.providers[providerId].healthCheck()));
  }

  private async runAcrossProviders<T>(call: (provider: AIProvider) => Promise<T>): Promise<T> {
    const errors: string[] = [];

    for (const providerId of this.providerOrder()) {
      const provider = this.providers[providerId];

      if (!provider.isConfigured() && provider.id !== "mock") {
        errors.push(`${provider.id}: not configured`);
        continue;
      }

      try {
        return await call(provider);
      } catch (error) {
        const detail = error instanceof Error ? error.message : "Unknown provider error";
        errors.push(`${provider.id}: ${detail}`);
        this.onFallback?.(`Falling back after ${provider.id} error: ${detail}`);
      }
    }

    throw new Error(`All AI providers failed. ${errors.join(" | ")}`);
  }
}
