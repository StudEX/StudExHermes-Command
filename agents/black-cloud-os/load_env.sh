#!/usr/bin/env bash
# load_env.sh — pulls API keys from the founder vault + local overrides
# Usage: source agents/black-cloud-os/load_env.sh
set -a
VAULT="$HOME/Desktop/Founder/studex-api-keys/.env.complete"
LOCAL="$HOME/black-cloud-os/needle-bridge/.env"

if [ -f "$VAULT" ]; then
  # shellcheck disable=SC1090
  . "$VAULT"
fi
if [ -f "$LOCAL" ]; then
  # shellcheck disable=SC1090
  . "$LOCAL"
fi

# Alias vault names → what KGOSI expects
export AGENTMAIL_KGOSI_KEY="${AGENTMAIL_KGOSI_KEY:-$AGENTMAIL_KEY}"
export AGENTMAIL_FROM="${AGENTMAIL_FROM:-kgosi@studex.dev}"
export KGOSI_PORT="${KGOSI_PORT:-5055}"
export GOOGLE_APPLICATION_CREDENTIALS="${GOOGLE_APPLICATION_CREDENTIALS:-$HOME/.openclaw/workspace/keys/agent-dataroom.json}"
export GWS_DOMAIN="${GWS_DOMAIN:-studex.dev}"
export GWS_ADMIN="${GWS_ADMIN:-t.ramaphosa@studex.dev}"
export LITELLM_BASE="${LITELLM_BASE:-http://localhost:4000}"
export LITELLM_KEY="${LITELLM_KEY:-sk-anything}"
export OBSIDIAN_VAULT="${OBSIDIAN_VAULT:-$HOME/Documents/Obsidian Vault}"
export MIROFISH_URL="${MIROFISH_URL:-http://localhost:7860}"
export AITRADER_URL="${AITRADER_URL:-http://localhost:8000}"
set +a

echo "[hermes] env loaded — LITELLM=$LITELLM_BASE  KGOSI_PORT=$KGOSI_PORT  GWS=$GWS_DOMAIN"
