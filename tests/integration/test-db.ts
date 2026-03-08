import path from "node:path";
import { rmSync } from "node:fs";
import { execSync } from "node:child_process";

const ROOT = path.resolve(__dirname, "../..");
const TEST_DB_PATH = path.join(ROOT, "prisma", "integration.db");

export function testDatabaseUrl() {
  return "file:./integration.db";
}

export async function setupIntegrationDatabase() {
  rmSync(TEST_DB_PATH, { force: true });

  execSync("npx prisma db push --skip-generate", {
    cwd: ROOT,
    env: {
      ...process.env,
      DATABASE_URL: testDatabaseUrl()
    },
    stdio: "ignore"
  });

  process.env.DATABASE_URL = testDatabaseUrl();
  process.env.APP_ENCRYPTION_KEY = "integration-local-secret-integration-local-secret";
  process.env.NEXTAUTH_SECRET = "integration-secret";
  process.env.AI_PROVIDER_PRIORITY = "mock";
}
