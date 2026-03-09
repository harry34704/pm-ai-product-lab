#!/bin/zsh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ENV_FILE="$SCRIPT_DIR/.env.localapp"
LOG_FILE="$SCRIPT_DIR/.pm90-launch.log"

find_free_port() {
  local port
  for port in "$@"; do
    if ! lsof -n -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1; then
      echo "$port"
      return 0
    fi
  done
  return 1
}

wait_for_docker() {
  local attempt=0
  until docker info >/dev/null 2>&1; do
    attempt=$((attempt + 1))
    if [[ "$attempt" -eq 1 ]]; then
      echo "Starting Docker Desktop..."
      open -a Docker >/dev/null 2>&1 || true
    fi
    if [[ "$attempt" -gt 60 ]]; then
      echo "Docker Desktop did not become ready. Open Docker Desktop and try again."
      exit 1
    fi
    sleep 2
  done
}

FRONTEND_PORT="$(find_free_port 3000 3001 3002 3003 3004 || true)"
BACKEND_PORT="$(find_free_port 8000 8001 8002 8003 8004 || true)"

if [[ -z "$FRONTEND_PORT" || -z "$BACKEND_PORT" ]]; then
  echo "PM90 could not find a free frontend or backend port."
  echo "Close anything using ports 3000-3004 or 8000-8004 and try again."
  exit 1
fi

cat > "$ENV_FILE" <<EOF
AI_PROVIDER=${AI_PROVIDER:-fallback}
OPENAI_API_KEY=${OPENAI_API_KEY:-}
OPENAI_MODEL=${OPENAI_MODEL:-gpt-4.1-mini}
OLLAMA_BASE_URL=${OLLAMA_BASE_URL:-http://host.docker.internal:11434}
OLLAMA_MODEL=${OLLAMA_MODEL:-llama3.2}
JWT_SECRET=${JWT_SECRET:-replace-with-a-long-random-secret}
DATABASE_URL=postgresql+psycopg://pm90:pm90@db:5432/pm90
CORS_ORIGINS=http://localhost:${FRONTEND_PORT},http://127.0.0.1:${FRONTEND_PORT}
FRONTEND_BASE_URL=http://localhost:${FRONTEND_PORT}
NEXT_PUBLIC_API_BASE_URL=http://localhost:${BACKEND_PORT}/api
DEMO_USER_EMAIL=${DEMO_USER_EMAIL:-demo@pm90.app}
DEMO_USER_PASSWORD=${DEMO_USER_PASSWORD:-Demo123!}
FRONTEND_PORT=${FRONTEND_PORT}
BACKEND_PORT=${BACKEND_PORT}
EOF

cd "$SCRIPT_DIR"

wait_for_docker

echo "Starting PM90..."
echo "Frontend will open on http://localhost:${FRONTEND_PORT}"
echo "API docs will be at http://localhost:${BACKEND_PORT}/docs"

: > "$LOG_FILE"
docker compose --env-file "$ENV_FILE" up --build -d >>"$LOG_FILE" 2>&1

echo "Waiting for the API to become healthy..."
for _ in {1..90}; do
  if curl -fsS "http://127.0.0.1:${BACKEND_PORT}/health" >/dev/null 2>&1; then
    echo "PM90 is ready."
    echo "Opening the app in your browser..."
    open "http://localhost:${FRONTEND_PORT}"
    exit 0
  fi
  sleep 2
done

echo "PM90 started, but the API did not become healthy in time."
echo "Check $LOG_FILE for the full Docker output."
exit 1
