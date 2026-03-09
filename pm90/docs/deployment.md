# PM90 Deployment Guide

## Local Docker deployment

```bash
cd pm90
cp .env.example .env
docker compose up --build
```

Services:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- Postgres: `localhost:5432`

On macOS, you can skip Terminal entirely and double-click `start-pm90.command`. The launcher writes a local `.env.localapp`, starts Docker Compose, and opens the correct browser URL automatically.

## Local non-Docker development

Backend:

```bash
cd pm90/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp ../.env.example .env
alembic upgrade head
uvicorn app.main:app --reload
```

Frontend:

```bash
cd pm90/frontend
npm install
cp ../.env.example .env.local
npm run dev
```

## Production topology

- Frontend: Vercel or any platform that supports Next.js standalone output.
- Backend: Render, Railway, Fly.io, ECS, or Docker-based hosting.
- Database: Managed PostgreSQL such as Neon, Supabase, Railway, or RDS.

## Required environment variables

- `DATABASE_URL`
- `JWT_SECRET`
- `NEXT_PUBLIC_API_BASE_URL`
- `AI_PROVIDER`
- `OPENAI_API_KEY` when `AI_PROVIDER=openai`
- `OLLAMA_BASE_URL` and `OLLAMA_MODEL` when `AI_PROVIDER=ollama`

## Render blueprint

The included [render.yaml](../render.yaml) deploys the FastAPI backend and managed Postgres. The backend start command runs `alembic upgrade head` before `uvicorn`.

## Container notes

- The backend container now copies `alembic/` and runs migrations automatically at startup.
- The frontend container uses Next.js standalone output for a lean runtime image.
- `AI_PROVIDER=fallback` is safe for first deploys without model credentials.
