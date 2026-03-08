# Setup

## Install

```bash
pnpm install
```

## Environment

Copy `.env.example` to `.env` and update any secrets or provider keys you need. The app defaults to the `mock` AI provider, so external keys are optional for local MVP use.

Required local values:

- `DATABASE_URL`
- `APP_ENCRYPTION_KEY`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

## Database

Push the schema and generate the client:

```bash
pnpm prisma:migrate
```

Seed the local SQLite database:

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

## Packaging

```bash
pnpm build
pnpm electron:build
```

## Tests

```bash
pnpm test
pnpm test:e2e
```
