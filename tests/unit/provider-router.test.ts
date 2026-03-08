import { z } from "zod";
import { ProviderRouter } from "../../packages/shared/src/ai/provider-router";
import type { AIProvider } from "../../packages/shared/src/ai/providers/base";
import type { ProviderHealth } from "../../packages/shared/src/types";

function makeProvider(
  id: "mock" | "openai" | "groq" | "openrouter" | "ollama",
  config: {
    configured?: boolean;
    text?: string;
    fail?: boolean;
  }
): AIProvider {
  return {
    id,
    isConfigured: () => config.configured ?? true,
    async generateText() {
      if (config.fail) {
        throw new Error(`${id} failed`);
      }
      return config.text ?? `${id}-text`;
    },
    async generateStructured(_messages, schema) {
      if (config.fail) {
        throw new Error(`${id} failed`);
      }
      return schema.parse({ answer: `${id}-structured` });
    },
    async transcribeAudio() {
      if (config.fail) {
        throw new Error(`${id} failed`);
      }
      return `${id}-transcript`;
    },
    async healthCheck(): Promise<ProviderHealth> {
      return {
        provider: id,
        ok: !config.fail,
        detail: config.fail ? "failed" : "ok"
      };
    }
  };
}

describe("ProviderRouter", () => {
  it("falls back to the next provider when the first one fails", async () => {
    const logs: string[] = [];
    const router = new ProviderRouter({
      priority: ["openai", "mock"],
      onFallback: (message) => logs.push(message),
      providers: {
        openai: makeProvider("openai", { fail: true }),
        mock: makeProvider("mock", { text: "fallback worked" })
      }
    });

    await expect(router.generateText([{ role: "user", content: "hello" }])).resolves.toBe("fallback worked");
    expect(logs[0]).toContain("Falling back after openai error");
  });

  it("returns structured data from the first working provider", async () => {
    const router = new ProviderRouter({
      priority: ["groq", "mock"],
      providers: {
        groq: makeProvider("groq", { configured: false }),
        mock: makeProvider("mock", {})
      }
    });

    await expect(
      router.generateStructured([{ role: "user", content: "json" }], z.object({ answer: z.string() }))
    ).resolves.toEqual({ answer: "mock-structured" });
  });
});
