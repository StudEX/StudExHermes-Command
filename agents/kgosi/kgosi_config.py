"""KGOSI runtime config. One file, every path + endpoint the bridge needs."""
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent / ".env")

# ── LiteLLM gateway ────────────────────────────────────────────
LITELLM_BASE = os.environ.get("LITELLM_BASE", "http://localhost:4000/v1")
LITELLM_KEY  = os.environ.get("LITELLM_KEY",  "sk-anything")

# ── Obsidian vault + Data drive ────────────────────────────────
OBSIDIAN_VAULT = Path(os.environ.get("OBSIDIAN_VAULT",
    str(Path.home() / "Documents" / "Obsidian Vault")))
DATA_DRIVE = OBSIDIAN_VAULT / "Data Ceters"
SESSIONS_DIR = OBSIDIAN_VAULT / "Agents" / "Sessions" / "KGOSI"

for sub in ("inbox", "deals", "verdicts", "portfolio", "RALF", "archive"):
    (DATA_DRIVE / sub).mkdir(parents=True, exist_ok=True)
SESSIONS_DIR.mkdir(parents=True, exist_ok=True)

# ── AgentMail (scoped to KGOSI, not empire-wide) ───────────────
AGENTMAIL_KEY  = os.environ.get("AGENTMAIL_KGOSI_KEY", "")
AGENTMAIL_FROM = os.environ.get("AGENTMAIL_FROM", "kgosi@studex.dev")
AGENTMAIL_BASE = "https://api.agentmail.to/v0"

# ── Cross-agent endpoints ──────────────────────────────────────
MIROFISH_URL = os.environ.get("MIROFISH_URL", "http://localhost:3000")
AITRADER_URL = os.environ.get("AITRADER_URL", "http://localhost:8000")

# ── KGOSI model aliases — must match litellm_config.yaml ───────
KGOSI_ARBITER_QWEN   = "kgosi-arbiter-qwen"
KGOSI_ARBITER_GLM    = "kgosi-arbiter-glm"
KGOSI_ARBITER_ORNITH = "kgosi-arbiter-ornith"
KGOSI_BUFFETT        = "kgosi-buffett-moat"
KGOSI_MUNGER         = "kgosi-munger-regulatory"
KGOSI_CATHIE         = "kgosi-cathie-growth"
KGOSI_NALEDI         = "kgosi-naledi-brand"
KGOSI_CASHCLAW       = "kgosi-cashclaw-econ"
KGOSI_KIGALI         = "kgosi-kigali-sovereign"
KGOSI_TIEBREAKER     = "planner-opus"
