import { OpenAICompatibleProvider } from "./openai-compatible";
import type { ProviderEnvironment } from "./base";

export class OpenRouterCompatibleProvider extends OpenAICompatibleProvider {
  readonly id = "openrouter" as const;

  constructor(env: ProviderEnvironment) {
    super({
      baseUrl: env.baseUrl ?? "https://openrouter.ai/api/v1",
      apiKey: env.apiKey,
      defaultModel: env.defaultModel,
      headers: {
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "MockRoom AI",
        ...env.headers
      }
    });
  }
}
