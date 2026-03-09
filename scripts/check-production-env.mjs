const required = [
  "DATABASE_URL",
  "DIRECT_URL",
  "APP_ENCRYPTION_KEY",
  "NEXTAUTH_SECRET",
  "NEXTAUTH_URL",
  "APP_BASE_URL"
];

const objectStorage = [
  "OBJECT_STORAGE_PROVIDER",
  "OBJECT_STORAGE_BUCKET",
  "OBJECT_STORAGE_ENDPOINT",
  "OBJECT_STORAGE_ACCESS_KEY_ID",
  "OBJECT_STORAGE_SECRET_ACCESS_KEY"
];

const missing = [...required, ...objectStorage].filter((name) => {
  const value = process.env[name];
  return !value || !value.trim();
});

if (missing.length) {
  console.error("Missing required production environment variables:");
  for (const name of missing) {
    console.error(`- ${name}`);
  }
  process.exit(1);
}

if ((process.env.APP_ENCRYPTION_KEY ?? "").length < 32) {
  console.error("APP_ENCRYPTION_KEY must be at least 32 characters long.");
  process.exit(1);
}

if ((process.env.NEXTAUTH_SECRET ?? "").length < 32) {
  console.error("NEXTAUTH_SECRET must be at least 32 characters long.");
  process.exit(1);
}

console.log("Production environment validation passed.");
