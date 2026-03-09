import { execSync } from "node:child_process";
import path from "node:path";

const ROOT = path.resolve(__dirname, "../..");

export function testDatabaseUrl() {
  return process.env.TEST_DATABASE_URL ?? "postgresql://postgres:postgres@127.0.0.1:5432/mockroom_integration?schema=public";
}

export async function setupIntegrationDatabase() {
  execSync("npx prisma migrate deploy", {
    cwd: ROOT,
    env: {
      ...process.env,
      DATABASE_URL: testDatabaseUrl(),
      DIRECT_URL: testDatabaseUrl()
    },
    stdio: "ignore"
  });

  process.env.DATABASE_URL = testDatabaseUrl();
  process.env.DIRECT_URL = testDatabaseUrl();
  process.env.APP_ENCRYPTION_KEY = "integration-local-secret-integration-local-secret";
  process.env.NEXTAUTH_SECRET = "integration-secret-integration-secret";
  process.env.APP_BASE_URL = "http://127.0.0.1:3000";
  process.env.AI_PROVIDER_PRIORITY = "mock";
}
