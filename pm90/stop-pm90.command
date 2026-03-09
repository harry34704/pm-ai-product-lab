#!/bin/zsh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ENV_FILE="$SCRIPT_DIR/.env.localapp"

cd "$SCRIPT_DIR"

if [[ -f "$ENV_FILE" ]]; then
  docker compose --env-file "$ENV_FILE" down
else
  docker compose down
fi
