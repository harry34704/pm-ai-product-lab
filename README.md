# MockRoom AI

MockRoom AI is a desktop-first interview rehearsal platform for ethical mock interviews. It helps candidates upload resumes, add job descriptions, analyze fit, extract STAR stories, run visible practice sessions, stream consent-based transcripts, and review answers after the session.

## Practice-Only Boundary

MockRoom AI is for practice and rehearsal only.

- No stealth overlays
- No hidden prompts
- No transparent or click-through windows
- No undisclosed assistance during real interviews
- No covert capture or detection evasion

All coaching is clearly labeled and visible in `Practice Mode`.

## Stack

- Next.js App Router + TypeScript + Tailwind CSS
- Electron desktop shell with preload IPC bridge
- Prisma ORM with PostgreSQL
- S3/R2 object storage for uploaded source files
- Zustand + TanStack Query
- Zod validation
- Provider router for OpenAI-compatible, Groq-compatible, OpenRouter-compatible, Ollama, and Mock providers
- Vitest + Playwright

## Repository Layout

```text
apps/
  desktop/
  web/
packages/
  shared/
prisma/
tests/
docs/
```

## Local Run

1. Copy `.env.example` to `.env`.
2. Start PostgreSQL locally or point `DATABASE_URL` and `DIRECT_URL` at a hosted PostgreSQL instance.
3. Install dependencies.
4. Apply Prisma migrations.
5. Seed the database.
6. Start the web app and Electron shell.

```bash
pnpm db:start
pnpm install
pnpm prisma:migrate
pnpm prisma:seed
pnpm dev
```

If you do not want to use Docker locally, replace `DATABASE_URL` and `DIRECT_URL` with a Neon, Supabase, Railway, or other hosted PostgreSQL connection string and skip `pnpm db:start`.

The web app runs at [http://localhost:3000](http://localhost:3000). The Electron shell waits for the Next.js dev server and then opens the visible desktop window.

## Provider Configuration

The default priority is `mock,openai,groq,openrouter,ollama` so the app works locally even without API keys.

- Set `AI_PROVIDER_PRIORITY` in `.env`.
- Configure model env vars per provider.
- Update provider order in the Settings page.
- Enable `local-only mode` if you want the app to avoid remote providers.

## Production Environment

Required production groups:

- Auth: `APP_ENCRYPTION_KEY`, `NEXTAUTH_SECRET`, `APP_BASE_URL`, `NEXTAUTH_URL`
- Database: `DATABASE_URL`, `DIRECT_URL`
- Object storage: `OBJECT_STORAGE_PROVIDER`, `OBJECT_STORAGE_BUCKET`, `OBJECT_STORAGE_ENDPOINT`, `OBJECT_STORAGE_ACCESS_KEY_ID`, `OBJECT_STORAGE_SECRET_ACCESS_KEY`
- Optional AI providers: `OPENAI_*`, `GROQ_*`, `OPENROUTER_*`, `OLLAMA_*`
- Optional transcription: `TRANSCRIPTION_PROVIDER`, `WHISPER_API_*`
- Optional realtime: `LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`

In production, session cookies are `HttpOnly`, `SameSite=Lax`, `Secure`, and use `__Host-` or `__Secure-` naming automatically.

## Vercel Deployment

The repository includes a root [vercel.json](/Users/user/Documents/New%20project/vercel.json) for monorepo installs and builds.
There is also an app-local [apps/web/vercel.json](/Users/user/Documents/New%20project/apps/web/vercel.json) for projects whose Vercel Root Directory is `apps/web`.

Recommended Vercel setup:

- Framework preset: `Next.js`
- Root directory: `apps/web`
- Install command: inherited from `vercel.json`
- Build command: inherited from `vercel.json`
- Environment variables: set every production variable from `.env.example`
- Database: use the pooled PostgreSQL URL in `DATABASE_URL` and the direct connection string in `DIRECT_URL`
- Storage: configure an S3 or Cloudflare R2 bucket with CORS allowing `PUT` from your deployed domain

Use the default `*.vercel.app` URL first and attach your custom domain later.

A full deployment walkthrough is in [docs/VERCEL.md](/Users/user/Documents/New%20project/docs/VERCEL.md).

## Electron Dev Mode

```bash
pnpm dev
```

That starts:

- the Next.js UI in `apps/web`
- the Electron shell in `apps/desktop`

## Build and Package

```bash
pnpm build
pnpm electron:build
```

The desktop packaging flow is configured for signed macOS and Windows builds in GitHub Actions:

- macOS signing and notarization use `CSC_LINK`, `CSC_KEY_PASSWORD`, `APPLE_ID`, `APPLE_APP_SPECIFIC_PASSWORD`, and `APPLE_TEAM_ID`
- Windows signing uses `WIN_CSC_LINK` and `WIN_CSC_KEY_PASSWORD`
- Workflow files live in [ci.yml](/Users/user/Documents/New%20project/.github/workflows/ci.yml) and [desktop-release.yml](/Users/user/Documents/New%20project/.github/workflows/desktop-release.yml)

## Test Commands

```bash
pnpm test
pnpm test:e2e
```

`pnpm test:e2e` expects PostgreSQL to be running on `127.0.0.1:5432`.

## Seed Accounts

After seeding, these demo accounts are available:

- `pm@example.com` / `Password123!`
- `ba@example.com` / `Password123!`

## Docs

- [Architecture](docs/architecture.md)
- [Setup](docs/SETUP.md)
- [Vercel](docs/VERCEL.md)
- [Roadmap](docs/ROADMAP.md)
- [Ethics](docs/ETHICS.md)
