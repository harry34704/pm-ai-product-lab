# Vercel Deployment

## What This Repo Expects

This monorepo deploys the web app from `apps/web` and imports shared code from `packages/shared`.

The repo now includes:

- [`apps/web/vercel.json`](/Users/user/Documents/New%20project/apps/web/vercel.json)
- [`vercel.json`](/Users/user/Documents/New%20project/vercel.json)
- [`scripts/check-production-env.mjs`](/Users/user/Documents/New%20project/scripts/check-production-env.mjs)

That means Vercel only needs the correct project settings and environment variables.

## Vercel Project Settings

Create one Vercel project with these values:

- Framework Preset: `Next.js`
- Root Directory: `apps/web`
- Include source files outside the Root Directory in the Build Step: `Enabled`
- Node.js Version: `22`

The project-local [`apps/web/vercel.json`](/Users/user/Documents/New%20project/apps/web/vercel.json) handles install and build commands from there.

## Required Environment Variables

Add these in Vercel for `Production`, `Preview`, and optionally `Development`:

### Core

- `DATABASE_URL`
- `DIRECT_URL`
- `APP_ENCRYPTION_KEY`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `APP_BASE_URL`
- `AI_PROVIDER_PRIORITY`
- `TRANSCRIPTION_PROVIDER`

### Object Storage

- `OBJECT_STORAGE_PROVIDER`
- `OBJECT_STORAGE_BUCKET`
- `OBJECT_STORAGE_REGION`
- `OBJECT_STORAGE_ENDPOINT`
- `OBJECT_STORAGE_ACCESS_KEY_ID`
- `OBJECT_STORAGE_SECRET_ACCESS_KEY`
- `OBJECT_STORAGE_PUBLIC_BASE_URL` if you want stable object URLs
- `OBJECT_STORAGE_FORCE_PATH_STYLE`
- `OBJECT_STORAGE_PRESIGN_TTL_SECONDS`

### Optional AI Providers

- `OPENAI_BASE_URL`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `GROQ_API_KEY`
- `GROQ_MODEL`
- `OPENROUTER_API_KEY`
- `OPENROUTER_MODEL`

### Optional Realtime / Transcription

- `LIVEKIT_URL`
- `LIVEKIT_API_KEY`
- `LIVEKIT_API_SECRET`
- `WHISPER_API_BASE_URL`
- `WHISPER_API_KEY`

## Database

Use hosted PostgreSQL.

Recommended mapping:

- `DATABASE_URL`: pooled/runtime connection string
- `DIRECT_URL`: direct migration connection string

Run migrations before the first production launch:

```bash
pnpm prisma:deploy
```

If you want demo data:

```bash
pnpm prisma:seed
```

## Object Storage

Uploads for resumes and job descriptions use presigned S3-compatible `PUT` URLs.

Your bucket CORS must allow:

- `PUT`
- `GET`
- `HEAD`
- your Vercel domain as an allowed origin
- `Content-Type` header

## First Production Deployment

1. Push the repo to GitHub.
2. Import it into Vercel.
3. Set root directory to `apps/web`.
4. Enable source files outside the root directory.
5. Add all required env vars.
6. Deploy once.
7. Set `APP_BASE_URL` and `NEXTAUTH_URL` to the generated `*.vercel.app` URL if you used a temporary domain.
8. Redeploy.
9. Run `pnpm prisma:deploy` against the production database.
10. Verify `/login`, `/api/health`, resume upload, JD upload, and analysis flow.

## Custom Domain Later

You do not need a domain for the first deployment.

Vercel will give you a default `*.vercel.app` hostname. When you buy a domain later:

1. Add it in Vercel `Project Settings` → `Domains`
2. Update DNS at your registrar
3. Update `APP_BASE_URL`
4. Update `NEXTAUTH_URL`
5. Redeploy
