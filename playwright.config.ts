import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 90_000,
  use: {
    baseURL: "http://127.0.0.1:3005",
    headless: true
  },
  webServer: {
    command: "pnpm prisma:migrate && pnpm prisma:seed && pnpm --filter @mockroom/web exec next dev --hostname 127.0.0.1 --port 3005",
    url: "http://127.0.0.1:3005",
    reuseExistingServer: !process.env.CI,
    env: {
      DATABASE_URL: "postgresql://postgres:postgres@127.0.0.1:5432/mockroom_e2e?schema=public",
      DIRECT_URL: "postgresql://postgres:postgres@127.0.0.1:5432/mockroom_e2e?schema=public",
      APP_ENCRYPTION_KEY: "playwright-local-secret-playwright-local-secret",
      NEXTAUTH_SECRET: "playwright-secret-playwright-secret",
      NEXTAUTH_URL: "http://127.0.0.1:3005",
      APP_BASE_URL: "http://127.0.0.1:3005",
      AI_PROVIDER_PRIORITY: "mock"
    }
  }
});
