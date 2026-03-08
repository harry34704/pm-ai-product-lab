import { OpenAICompatibleProvider } from "./openai-compatible";
import type { ProviderEnvironment } from "./base";

export class GroqCompatibleProvider extends OpenAICompatibleProvider {
  override readonly id = "groq" as const;

  constructor(env: ProviderEnvironment) {
    super({
      baseUrl: env.baseUrl ?? "https://api.groq.com/openai/v1",
      apiKey: env.apiKey,
      defaultModel: env.defaultModel,
      headers: env.headers
    });
  }
}
