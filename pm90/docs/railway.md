# PM90 on Railway

PM90 deploys cleanly to Railway as an isolated monorepo: one frontend service, one backend service, and one PostgreSQL service.

## What this repo now includes

- [backend/railway.json](../backend/railway.json): Railway config-as-code for the FastAPI API
- [frontend/railway.json](../frontend/railway.json): Railway config-as-code for the Next.js frontend
- Dockerfiles in both service directories that respect Railway's `PORT`

## Railway model for this repo

Create one Railway project with three services:

1. `pm90-api`
2. `pm90-web`
3. `pm90-db` (PostgreSQL)

This naming matters because Railway variable references use the service name as the namespace.

Official references:

- Railway monorepo root-directory setup: [Deploying a Monorepo](https://docs.railway.com/guides/monorepo)
- Railway config-as-code: [Using Config as Code](https://docs.railway.com/config-as-code)
- Railway service variables and `RAILWAY_PUBLIC_DOMAIN`: [Variables Reference](https://docs.railway.com/reference/variables)
- Railway PostgreSQL: [PostgreSQL](https://docs.railway.com/guides/postgresql)

## Service setup

### 1. Create the backend service

- Create a new service from your GitHub repo.
- Name it `pm90-api`.
- In service settings, set the root directory to `pm90/backend`.
- In service settings, set the config-as-code file path to `/pm90/backend/railway.json`.
- Deploy once.
- In Networking, click `Generate Domain`.

### 2. Create the frontend service

- Create another service from the same GitHub repo.
- Name it `pm90-web`.
- Set the root directory to `pm90/frontend`.
- Set the config-as-code file path to `/pm90/frontend/railway.json`.
- Deploy once.
- In Networking, click `Generate Domain`.

### 3. Add PostgreSQL

- Add a PostgreSQL service to the same Railway project.
- Name it `pm90-db`.

Railway exposes a `DATABASE_URL` variable from the Postgres service that you can reference from `pm90-api`.

## Required Railway variables

### Backend service: `pm90-api`

Set these variables in the Railway dashboard:

- `DATABASE_URL=${{pm90-db.DATABASE_URL}}`
- `JWT_SECRET=<long random secret>`
- `AI_PROVIDER=fallback`
- `OPENAI_MODEL=gpt-4.1-mini`
- `OLLAMA_BASE_URL=http://localhost:11434`
- `OLLAMA_MODEL=llama3.2`
- `FRONTEND_BASE_URL=https://${{pm90-web.RAILWAY_PUBLIC_DOMAIN}}`
- `DEMO_USER_EMAIL=demo@pm90.app`
- `DEMO_USER_PASSWORD=Demo123!`

Optional:

- `OPENAI_API_KEY=<your key>` if you want live OpenAI responses
- `AI_PROVIDER=openai` if you set `OPENAI_API_KEY`

Notes:

- The backend now automatically adds `FRONTEND_BASE_URL` into the CORS allowlist.
- The Docker startup command already runs `alembic upgrade head` before launching Uvicorn.

### Frontend service: `pm90-web`

Set:

- `NEXT_PUBLIC_API_BASE_URL=https://${{pm90-api.RAILWAY_PUBLIC_DOMAIN}}/api`

## Deployment order

Recommended order:

1. Create `pm90-api`
2. Create `pm90-web`
3. Create `pm90-db`
4. Generate public domains for `pm90-api` and `pm90-web`
5. Set the variables above
6. Redeploy both app services

## Smoke test after deploy

Use these checks:

- Frontend home page loads
- `/auth` loads
- Demo login works with `demo@pm90.app` / `Demo123!`
- API health endpoint returns OK at `https://<pm90-api-domain>/health`
- Frontend can register a new account without CORS errors

## LinkedIn launch recommendation

Use the frontend service domain as your share URL. If you later connect a custom domain, update:

- `FRONTEND_BASE_URL` on `pm90-api`
- `NEXT_PUBLIC_API_BASE_URL` only if your backend domain also changes

## Important limits

Railway is not a forever-free always-on platform. Pricing and trial details can change, so check the current official pricing before launch: [Railway Pricing](https://railway.com/pricing)
