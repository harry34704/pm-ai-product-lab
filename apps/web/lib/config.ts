const DEFAULT_PROVIDER_PRIORITY = ["mock", "openai", "groq", "openrouter", "ollama"] as const;
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 14;

function readEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
}

function parseBoolean(value: string | undefined, fallback: boolean) {
  if (!value) {
    return fallback;
  }

  return value === "true";
}

function assertProductionValue(name: string, value: string | undefined, message: string) {
  if (!value && process.env.NODE_ENV === "production") {
    throw new Error(`${name} is required in production. ${message}`);
  }

  return value;
}

export function isProductionRuntime() {
  return process.env.NODE_ENV === "production";
}

export function getAppBaseUrl() {
  const configured =
    readEnv("APP_BASE_URL") ??
    readEnv("NEXTAUTH_URL") ??
    (readEnv("VERCEL_URL") ? `https://${readEnv("VERCEL_URL")}` : undefined);

  return configured ?? "http://127.0.0.1:3000";
}

export function getAuthSecret() {
  const secret = readEnv("APP_ENCRYPTION_KEY") ?? readEnv("NEXTAUTH_SECRET");

  if (!secret && !isProductionRuntime()) {
    return "mockroom-local-dev-secret-mockroom-local-dev-secret";
  }

  const required = assertProductionValue(
    "APP_ENCRYPTION_KEY",
    secret,
    "Set APP_ENCRYPTION_KEY or NEXTAUTH_SECRET to a high-entropy secret."
  );

  if (!required || required.length < 32) {
    throw new Error("APP_ENCRYPTION_KEY must be at least 32 characters long.");
  }

  return required;
}

export function getSessionCookieConfig() {
  const domain = readEnv("SESSION_COOKIE_DOMAIN");
  const secure = isProductionRuntime();
  const name = secure ? (domain ? "__Secure-mockroom_session" : "__Host-mockroom_session") : "mockroom_session";

  return {
    name,
    ttlSeconds: SESSION_TTL_SECONDS,
    options: {
      httpOnly: true,
      sameSite: "lax" as const,
      secure,
      path: "/",
      priority: "high" as const,
      maxAge: SESSION_TTL_SECONDS,
      ...(domain ? { domain } : {})
    }
  };
}

export function getDefaultProviderPriority() {
  const configured = readEnv("AI_PROVIDER_PRIORITY");
  if (!configured) {
    return [...DEFAULT_PROVIDER_PRIORITY];
  }

  const parsed = configured
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return parsed.length ? parsed : [...DEFAULT_PROVIDER_PRIORITY];
}

export function getDefaultModel() {
  return (
    readEnv("OPENAI_MODEL") ??
    readEnv("GROQ_MODEL") ??
    readEnv("OPENROUTER_MODEL") ??
    readEnv("OLLAMA_MODEL") ??
    "mock-1"
  );
}

export function getObjectStorageConfig() {
  const provider = readEnv("OBJECT_STORAGE_PROVIDER");
  const bucket = readEnv("OBJECT_STORAGE_BUCKET");
  const accessKeyId = readEnv("OBJECT_STORAGE_ACCESS_KEY_ID");
  const secretAccessKey = readEnv("OBJECT_STORAGE_SECRET_ACCESS_KEY");
  const endpoint = readEnv("OBJECT_STORAGE_ENDPOINT");

  if (!provider || !bucket || !accessKeyId || !secretAccessKey || !endpoint) {
    return null;
  }

  return {
    provider,
    bucket,
    endpoint,
    accessKeyId,
    secretAccessKey,
    region: readEnv("OBJECT_STORAGE_REGION") ?? (provider === "r2" ? "auto" : "us-east-1"),
    publicBaseUrl: readEnv("OBJECT_STORAGE_PUBLIC_BASE_URL"),
    forcePathStyle: parseBoolean(readEnv("OBJECT_STORAGE_FORCE_PATH_STYLE"), provider === "s3"),
    presignTtlSeconds: Number(readEnv("OBJECT_STORAGE_PRESIGN_TTL_SECONDS") ?? "900")
  };
}

export function requireObjectStorageConfig() {
  const config = getObjectStorageConfig();

  if (!config) {
    throw new Error(
      "Object storage is not configured. Set OBJECT_STORAGE_PROVIDER, OBJECT_STORAGE_BUCKET, OBJECT_STORAGE_ENDPOINT, OBJECT_STORAGE_ACCESS_KEY_ID, and OBJECT_STORAGE_SECRET_ACCESS_KEY."
    );
  }

  return config;
}

export function getLiveKitConfig() {
  return {
    url: readEnv("LIVEKIT_URL"),
    apiKey: readEnv("LIVEKIT_API_KEY"),
    apiSecret: readEnv("LIVEKIT_API_SECRET")
  };
}

export function getTranscriptionConfig() {
  return {
    provider: readEnv("TRANSCRIPTION_PROVIDER") ?? "browser",
    whisperApiBaseUrl: readEnv("WHISPER_API_BASE_URL"),
    whisperApiKey: readEnv("WHISPER_API_KEY")
  };
}

export function getRuntimeFeatureStatus() {
  const storage = getObjectStorageConfig();
  const livekit = getLiveKitConfig();
  const transcription = getTranscriptionConfig();
  const cookie = getSessionCookieConfig();

  return {
    auth: {
      cookieName: cookie.name,
      secureCookies: cookie.options.secure,
      baseUrl: getAppBaseUrl()
    },
    storage: {
      configured: Boolean(storage),
      provider: storage?.provider ?? null,
      bucket: storage?.bucket ?? null
    },
    realtime: {
      configured: Boolean(livekit.url && livekit.apiKey && livekit.apiSecret),
      livekitUrl: livekit.url ?? null
    },
    transcription: {
      provider: transcription.provider,
      whisperConfigured: Boolean(transcription.whisperApiBaseUrl && transcription.whisperApiKey)
    }
  };
}
