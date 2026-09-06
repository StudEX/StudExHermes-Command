#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════
# JARVIS ↔ KGOSI voice bridge
# Wire this as VoiceBox's post-transcript hook (replaces jarvis_pipe.sh)
# — Investment/deal language routes to KGOSI (:5055)
# — Everything else falls through to the original jarvis_pipe.sh
# ═══════════════════════════════════════════════════════════════════
set -euo pipefail

VAULT="/Users/tumeloramaphosa/Documents/Obsidian Vault/2nd Brain"
DATE=$(date +%Y-%m-%d)
LOG_DIR="${VAULT}/Agents/Sessions/KGOSI"
LOG_FILE="${LOG_DIR}/${DATE}.md"
mkdir -p "$LOG_DIR"

# Read transcript (VoiceBox conventions)
TRANSCRIPT="${VOICEBOX_TRANSCRIPT:-}"
if [ -z "$TRANSCRIPT" ] && [ ! -t 0 ]; then
  TRANSCRIPT=$(cat)
fi
[ -z "$TRANSCRIPT" ] && { echo "[kgosi-pipe] empty transcript" >&2; exit 0; }

log_line() {
  echo "- **$(date +%H:%M:%S)** $1" >> "$LOG_FILE"
}

# ── Router: does this sound like a KGOSI request? ───────────────────
lower=$(echo "$TRANSCRIPT" | tr '[:upper:]' '[:lower:]')
KGOSI_TRIGGERS='score|verdict|hypothes|deal|portfolio|invest|kgosi|council|analyst|morning brief|capital position|black cloud|inbox|send email'

if echo "$lower" | grep -qE "$KGOSI_TRIGGERS"; then
  log_line "→ KGOSI route: $TRANSCRIPT"

  # POST to KGOSI Bridge /api/chat (Needle's endpoint)
  KGOSI_PORT="${KGOSI_PORT:-5055}"
  REPLY=$(curl -s -X POST "http://localhost:${KGOSI_PORT}/api/chat" \
              -H 'Content-Type: application/json' \
              -d "$(python3 -c "import json,sys; print(json.dumps({'message': sys.argv[1]}))" "$TRANSCRIPT")" \
          | python3 -c "
import json, sys
try:
    d = json.load(sys.stdin)
    parts = []
    for r in d.get('results') or []:
        if isinstance(r, dict):
            parts.append(json.dumps(r))
        else:
            parts.append(str(r))
    reasoning = d.get('reasoning','')
    text = ' '.join(parts) if parts else reasoning or 'KGOSI had no output.'
    print(text[:1200])
except Exception as e:
    print(f'KGOSI parse error: {e}')
")

  log_line "← KGOSI: ${REPLY:0:200}..."

  # Speak reply (VoiceBox / macOS say / ElevenLabs — pick your poison)
  if command -v say >/dev/null 2>&1; then
    echo "$REPLY" | say -v Samantha
  fi
  echo "$REPLY"
  exit 0
fi

# ── Fall through: not a KGOSI query → original JARVIS pipe ──────────
log_line "→ JARVIS (fallthrough): $TRANSCRIPT"
exec "$HOME/second-brain/jarvis_pipe.sh"
