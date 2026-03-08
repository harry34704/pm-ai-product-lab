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
- Prisma ORM with SQLite
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
2. Install dependencies.
3. Push the Prisma schema.
4. Seed the local database.
5. Start the web app and Electron shell.

```bash
pnpm install
pnpm prisma:migrate
pnpm prisma:seed
pnpm dev
```

The web app runs at [http://localhost:3000](http://localhost:3000). The Electron shell waits for the Next.js dev server and then opens the visible desktop window.

## Provider Configuration

The default priority is `mock,openai,groq,openrouter,ollama` so the app works locally even without API keys.

- Set `AI_PROVIDER_PRIORITY` in `.env`.
- Configure model env vars per provider.
- Update provider order in the Settings page.
- Enable `local-only mode` if you want the app to avoid remote providers.

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

## Test Commands

```bash
pnpm test
pnpm test:e2e
```

## Seed Accounts

After seeding, these demo accounts are available:

- `pm@example.com` / `Password123!`
- `ba@example.com` / `Password123!`

## Docs

- [Architecture](docs/ARCHITECTURE.md)
- [Setup](docs/SETUP.md)
- [Roadmap](docs/ROADMAP.md)
- [Ethics](docs/ETHICS.md)
