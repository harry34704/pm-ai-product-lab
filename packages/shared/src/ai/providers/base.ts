import type { z } from "zod";
import type { ChatMessage, ProviderCallOptions, ProviderHealth, ProviderId } from "../../types";

export interface AIProvider {
  id: ProviderId;
  isConfigured(): boolean;
  generateText(messages: ChatMessage[], options?: ProviderCallOptions): Promise<string>;
  generateStructured<T>(messages: ChatMessage[], schema: z.ZodSchema<T>, options?: ProviderCallOptions): Promise<T>;
  transcribeAudio(audio: Uint8Array, options?: ProviderCallOptions): Promise<string>;
  healthCheck(): Promise<ProviderHealth>;
}

export type ProviderEnvironment = {
  baseUrl?: string;
  apiKey?: string;
  defaultModel?: string;
  headers?: Record<string, string>;
};
