import { existsSync, writeFileSync } from "node:fs";
import path from "node:path";

const envPath = path.resolve(process.cwd(), ".env");

if (!existsSync(envPath)) {
  writeFileSync(
    envPath,
    [
      'DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/mockroom_ai?schema=public"',
      'DIRECT_URL="postgresql://postgres:postgres@127.0.0.1:5432/mockroom_ai?schema=public"',
      'NEXTAUTH_SECRET="mockroom-local-dev-secret-mockroom-local-dev-secret"',
      'NEXTAUTH_URL="http://localhost:3000"',
      'APP_BASE_URL="http://localhost:3000"',
      'APP_ENCRYPTION_KEY="mockroom-local-dev-secret-mockroom-local-dev-secret"',
      'AI_PROVIDER_PRIORITY="mock,openai,groq,openrouter,ollama"',
      'TRANSCRIPTION_PROVIDER="browser"',
      'OBJECT_STORAGE_PROVIDER="r2"',
      'OBJECT_STORAGE_REGION="auto"',
      'OBJECT_STORAGE_FORCE_PATH_STYLE="false"',
      'OBJECT_STORAGE_PRESIGN_TTL_SECONDS="900"'
    ].join("\n") + "\n"
  );
  console.log("Created .env with local defaults.");
}
