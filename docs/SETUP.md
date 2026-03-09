# Setup

## Install

Start PostgreSQL locally if you want a disposable dev database:

```bash
pnpm db:start
```

Or point the app at a hosted PostgreSQL instance and skip Docker entirely.

Then install dependencies:

```bash
pnpm install
```

## Environment

Copy `.env.example` to `.env` and update any secrets or provider keys you need. The app defaults to the `mock` AI provider, so external keys are optional for local MVP use.

Minimum required values:

- `DATABASE_URL`
- `DIRECT_URL`
- `APP_ENCRYPTION_KEY`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `APP_BASE_URL`

Required for production uploads:

- `OBJECT_STORAGE_PROVIDER`
- `OBJECT_STORAGE_BUCKET`
- `OBJECT_STORAGE_ENDPOINT`
- `OBJECT_STORAGE_ACCESS_KEY_ID`
- `OBJECT_STORAGE_SECRET_ACCESS_KEY`

Optional but recommended for production:

- `OBJECT_STORAGE_PUBLIC_BASE_URL`
- `LIVEKIT_URL`
- `LIVEKIT_API_KEY`
- `LIVEKIT_API_SECRET`
- `WHISPER_API_BASE_URL`
- `WHISPER_API_KEY`

## Database

Apply the committed PostgreSQL migrations:

```bash
pnpm prisma:migrate
```

Seed the database:

```bash
pnpm prisma:seed
```

## Development

```bash
pnpm dev
```

This starts:

- Next.js at `http://localhost:3000`
- Electron after the web server is reachable

## Vercel

1. Create a new Vercel project from this repository.
2. Set the root directory to `apps/web`.
3. Add all production environment variables from `.env.example`.
4. Set `DATABASE_URL` to your pooled PostgreSQL URL and `DIRECT_URL` to the direct connection string.
5. Configure your S3/R2 bucket CORS to allow `PUT` from your Vercel domain.
6. Run `pnpm prisma:migrate` against the production database before the first release.

## Packaging

```bash
pnpm build
pnpm electron:build
```

For signed desktop builds in CI, add these GitHub secrets:

- `CSC_LINK`
- `CSC_KEY_PASSWORD`
- `WIN_CSC_LINK`
- `WIN_CSC_KEY_PASSWORD`
- `APPLE_ID`
- `APPLE_APP_SPECIFIC_PASSWORD`
- `APPLE_TEAM_ID`

## Tests

```bash
pnpm test
pnpm test:e2e
```

`pnpm test:e2e` expects PostgreSQL on `127.0.0.1:5432`. Reuse `pnpm db:start` locally or add a PostgreSQL service in CI.
