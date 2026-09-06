#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════
# BLACK CLOUD OS · Master Startup Script
# Starts every layer of the stack in the right order.
# Run: ./start-black-cloud.sh [--with-mirofish] [--with-aitrader] [--telegram TOKEN]
# ═══════════════════════════════════════════════════════
set -e
BC_ROOT="$HOME/black-cloud-os"
cd "$BC_ROOT"

# ─── flag parsing ─────────────────────────────────────
WITH_MIRO=0; WITH_TRADER=0; TG_TOKEN=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --with-mirofish) WITH_MIRO=1; shift;;
    --with-aitrader) WITH_TRADER=1; shift;;
    --telegram)      TG_TOKEN="$2"; shift 2;;
    *) shift;;
  esac
done

echo "═══════════════════════════════════════════════════════"
echo "  BLACK CLOUD OS · starting stack"
echo "═══════════════════════════════════════════════════════"

# ─── 1. LiteLLM router ────────────────────────────────
if lsof -i :4000 >/dev/null 2>&1; then
  echo "✓ LiteLLM router already up on :4000"
else
  echo "✗ LiteLLM router not on :4000 — start Hermes router first:"
  echo "    cd ~/studex-hermes-router && litellm --config litellm_config.yaml --port 4000 &"
  echo "  (then re-run this script)"
  exit 1
fi

# ─── 2. Ollama ────────────────────────────────────────
if curl -s http://localhost:11434/api/tags >/dev/null 2>&1; then
  echo "✓ Ollama up on :11434"
else
  echo "→ Starting Ollama…"
  ollama serve >/tmp/ollama.log 2>&1 &
  sleep 3
fi

# ─── 3. LM Studio server ──────────────────────────────
if curl -s http://localhost:1234/v1/models >/dev/null 2>&1; then
  echo "✓ LM Studio server up on :1234"
else
  echo "⚠ LM Studio server not on :1234"
  echo "  Open LM Studio → Developer tab → Start Server (port 1234)"
  echo "  Load: Qwen3.8-27B, Muse-Glimmer-30B, Ornith-1.5-9B, GLM-4.7-Flash, Ministral-3-14B"
fi

# ─── 4. MiroFish (optional) ───────────────────────────
if [[ $WITH_MIRO -eq 1 ]]; then
  if curl -s http://localhost:3000 >/dev/null 2>&1; then
    echo "✓ MiroFish already up on :3000"
  else
    echo "→ Starting MiroFish (docker compose)…"
    (cd "$BC_ROOT/mirofish-offline" && docker compose up -d)
    echo "  MiroFish will be at http://localhost:3000 in ~30s"
    echo "  Neo4j browser at http://localhost:7474"
  fi
fi

# ─── 5. AI-Trader (optional) ──────────────────────────
if [[ $WITH_TRADER=1 ]]; then
  if curl -s http://localhost:8000 >/dev/null 2>&1; then
    echo "✓ AI-Trader already up on :8000"
  else
    echo "→ AI-Trader start: cd ai-trader && ./run-local.sh (in another terminal)"
  fi
fi

# ─── 6. KGOSI Bridge ──────────────────────────────────
echo ""
echo "→ Starting KGOSI Bridge on :5000…"
cd "$BC_ROOT/needle-bridge"
source .venv/bin/activate

if [[ -n "$TG_TOKEN" ]]; then
  export TELEGRAM_TOKEN="$TG_TOKEN"
fi

echo ""
echo "═══════════════════════════════════════════════════════"
echo "  KGOSI Bridge live → http://localhost:5000"
echo "  Try: 'ping kgosi', 'list deals', 'score deal alibaba'"
echo "═══════════════════════════════════════════════════════"
exec python3 kgosi_bridge.py
