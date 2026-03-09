import { afterEach, describe, expect, it } from "vitest";
import { getDefaultProviderPriority, getSessionCookieConfig } from "../../apps/web/lib/config";

const ENV_KEYS = ["NODE_ENV", "SESSION_COOKIE_DOMAIN", "AI_PROVIDER_PRIORITY"] as const;
const originalEnv = Object.fromEntries(ENV_KEYS.map((key) => [key, process.env[key]]));

afterEach(() => {
  for (const key of ENV_KEYS) {
    const value = originalEnv[key];
    if (value === undefined) {
      delete process.env[key];
      continue;
    }

    process.env[key] = value;
  }
});

describe("runtime config", () => {
  it("uses a host-only secure cookie in production when no cookie domain is set", () => {
    process.env.NODE_ENV = "production";
    delete process.env.SESSION_COOKIE_DOMAIN;

    const cookie = getSessionCookieConfig();

    expect(cookie.name).toBe("__Host-mockroom_session");
    expect(cookie.options.secure).toBe(true);
  });

  it("uses the configured provider order when supplied", () => {
    process.env.AI_PROVIDER_PRIORITY = "openai,groq,mock";

    expect(getDefaultProviderPriority()).toEqual(["openai", "groq", "mock"]);
  });
});
