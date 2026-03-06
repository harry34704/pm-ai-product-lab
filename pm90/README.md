# PM90

PM90 is an AI-powered, gamified learning and productivity platform for aspiring product managers. It combines a 90-day curriculum, AI mentorship, product simulations, analytics drills, portfolio artifact generation, and community mechanics in one product workspace.

## Stack

- Frontend: Next.js 16, React 19, Tailwind CSS 4
- Backend: FastAPI, SQLAlchemy
- Database: PostgreSQL in Docker Compose, SQLite fallback for local backend-only runs
- AI: OpenAI Responses API, Ollama chat API, deterministic fallback mode

## Core capabilities

- 90-day curriculum with six phases and sequential unlocking
- XP, levels, streaks, badges, leaderboard, and skill-tree progress
- AI mentor for concept explanation, PRD review, challenge evaluation, and interview practice
- PM simulation engine for churn, growth, prioritization, launch, and stakeholder scenarios
- PRD, roadmap, and prioritization board generation with Markdown, PDF, and Notion-style export
- Product analytics playground with funnels, cohorts, retention, A/B testing, and sample event data
- Community board, weekly challenges, and public progress feed
- Portfolio dashboard for saved PM artifacts

## Repo structure

```text
pm90/
  backend/        FastAPI API, data model, seed content, AI service layer
  frontend/       Next.js product UI
  docker-compose.yml
  .env.example
```

## Demo account

- Email: `demo@pm90.app`
- Password: `Demo123!`

The backend seeds this demo user on startup by default so the product opens with realistic data immediately.

## Local development

### 1. Backend

```bash
cd /Users/user/Documents/New_project/pm90/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp ../.env.example .env
uvicorn app.main:app --reload
```

The backend runs at [http://localhost:8000](http://localhost:8000). Swagger docs are available at [http://localhost:8000/docs](http://localhost:8000/docs).

### 2. Frontend

```bash
cd /Users/user/Documents/New_project/pm90/frontend
npm install
cp ../.env.example .env.local
npm run dev
```

The frontend runs at [http://localhost:3000](http://localhost:3000).

## Docker deployment

```bash
cd /Users/user/Documents/New_project/pm90
cp .env.example .env
docker compose up --build
```

Services:

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:8000](http://localhost:8000)
- Postgres: `localhost:5432`

## Exact deploy commands

### Option 1: Vercel frontend + Render backend

Vercel frontend:

```bash
cd /Users/user/Documents/New_project/pm90
npx vercel link --cwd frontend
npx vercel env add NEXT_PUBLIC_API_BASE_URL production --cwd frontend
npx vercel env add NEXT_PUBLIC_API_BASE_URL preview --cwd frontend
npx vercel --cwd frontend --prod
```

When `vercel env add` prompts for a value, enter your Render backend URL with `/api`, for example:

```text
https://pm90-api.onrender.com/api
```

Render backend:

```bash
cd /Users/user/Documents/New_project/pm90
render blueprints validate render.yaml
```

Then in the Render dashboard:

1. Click `New` -> `Blueprint`
2. Select this repository
3. Set the Blueprint file path to `pm90/render.yaml`
4. Create the Blueprint
5. After the backend is live, copy the Render service URL and use it in the Vercel `NEXT_PUBLIC_API_BASE_URL` variable

After the first Render deploy, manual redeploys can be triggered with:

```bash
render deploys create <RENDER_SERVICE_ID> --wait
```

### Option 2: Docker-only deployment

```bash
cd /Users/user/Documents/New_project/pm90
cp .env.example .env
docker compose up --build -d
docker compose ps
```

To stop it:

```bash
cd /Users/user/Documents/New_project/pm90
docker compose down
```

To rebuild after changes:

```bash
cd /Users/user/Documents/New_project/pm90
docker compose up --build -d
```

## Environment variables

- `AI_PROVIDER`: `fallback`, `openai`, or `ollama`
- `OPENAI_API_KEY`: required when `AI_PROVIDER=openai`
- `OPENAI_MODEL`: OpenAI model name
- `OLLAMA_BASE_URL`: Ollama host URL
- `OLLAMA_MODEL`: local model name such as `llama3.2`
- `JWT_SECRET`: strong random secret for auth tokens
- `DATABASE_URL`: SQLAlchemy connection string
- `CORS_ORIGINS`: comma-separated frontend origins
- `NEXT_PUBLIC_API_BASE_URL`: browser-facing API base URL

## Production notes

- Replace the seeded demo credentials before public launch.
- Use a managed PostgreSQL instance and inject `DATABASE_URL` securely.
- Terminate TLS at the platform layer and keep `JWT_SECRET` out of source control.
- If using OpenAI, set `AI_PROVIDER=openai` and provide `OPENAI_API_KEY`.
- If using Ollama, keep `AI_PROVIDER=ollama` and point `OLLAMA_BASE_URL` to your reachable model host.
- The frontend uses client-side auth tokens in local storage. For a hardened public launch, move to HTTP-only cookies and a dedicated session refresh flow.

## Suggested deployment targets

- Frontend: Vercel, Netlify, or Docker on Fly.io / Render
- Backend: Render, Railway, Fly.io, or ECS
- Database: Neon, Supabase Postgres, Railway Postgres, or RDS

## See the app locally

Backend:

```bash
cd /Users/user/Documents/New_project/pm90/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Frontend:

```bash
cd /Users/user/Documents/New_project/pm90/frontend
npm install
npm run dev -- --hostname 0.0.0.0 --port 3000
```

Open:

- [http://localhost:3000](http://localhost:3000)
- Demo login: `demo@pm90.app` / `Demo123!`

## What ships seeded

- Full 90-day curriculum across six phases
- Demo user with initial progress, artifacts, and simulation history
- Community leaderboard seed users and starter discussion posts
- Resource hub and weekly challenge catalog

## Next hardening steps

- Add Alembic migrations
- Move auth to secure cookies and refresh tokens
- Add rate limiting to AI endpoints
- Add server-side analytics event ingestion
- Add background jobs for export generation and async AI tasks
