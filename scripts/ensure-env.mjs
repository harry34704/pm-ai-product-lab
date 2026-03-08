import { existsSync, writeFileSync } from "node:fs";
import path from "node:path";

const envPath = path.resolve(process.cwd(), ".env");

if (!existsSync(envPath)) {
  writeFileSync(
    envPath,
    [
      'DATABASE_URL="file:./mockroom.db"',
      'NEXTAUTH_SECRET="mockroom-local-dev-secret"',
      'NEXTAUTH_URL="http://localhost:3000"',
      'APP_ENCRYPTION_KEY="mockroom-local-dev-secret-mockroom-local-dev-secret"',
      'AI_PROVIDER_PRIORITY="mock,openai,groq,openrouter,ollama"',
      'TRANSCRIPTION_PROVIDER="browser"'
    ].join("\n") + "\n"
  );
  console.log("Created .env with local defaults.");
}
