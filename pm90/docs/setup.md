# PM90 Setup

## Quick start

1. Copy the sample environment file.
2. Start the backend, run migrations, then start the frontend.
3. Log in with the seeded demo account.

## Demo credentials

- Email: `demo@pm90.app`
- Password: `Demo123!`

## Backend

```bash
cd pm90/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp ../.env.example .env
alembic upgrade head
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

## Frontend

```bash
cd pm90/frontend
npm install
cp ../.env.example .env.local
npm run dev -- --hostname 0.0.0.0 --port 3000
```

## Open the app

- `http://localhost:3000`
- Swagger docs: `http://localhost:8000/docs`
