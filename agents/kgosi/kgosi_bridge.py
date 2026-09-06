#!/usr/bin/env python3
"""KGOSI Bridge — Cactus Needle agent + KGOSI investment tools, one process.

Run:
    python kgosi_bridge.py                    # web UI at http://localhost:5000
    python kgosi_bridge.py --telegram TOKEN   # + telegram remote control
    TELEGRAM_TOKEN=xxx python kgosi_bridge.py # env-var form

Ports:
    5055  Flask/waitress UI + /api/chat  (5000 is taken by macOS AirPlay)
    4000  LiteLLM gateway (must be running elsewhere)
"""
import os, sys, threading

# Guard: importing app.py runs the tool decorators + builds a Needle agent,
# but its own `if __name__ == "__main__"` won't fire on import.
import app as needle_app
import needle

from kgosi_tools import KGOSI_TOOLS

KGOSI_SYSTEM = (
    "You are KGOSI, Chief of the Black Cloud Investment Committee for Studex Group. "
    "You have two toolsets: phone-hardware tools (flashlight, SMS, camera, battery, etc.) "
    "and KGOSI investment tools (score_deal, deal_analyst, get_verdict, morning_brief, "
    "list_deals, ping_kgosi). Route each request to the correct tool. "
    "Brand voice: obsidian-gold, editorial luxury, apex energy, direct."
)

# Rebuild the agent with BOTH the original phone tools and the KGOSI tools
ALL_TOOLS = list(needle_app.tools_list) + KGOSI_TOOLS
needle_app.agent = needle.Needle(tools=ALL_TOOLS, system=KGOSI_SYSTEM)

def _resolve_token() -> str | None:
    tok = os.environ.get("TELEGRAM_TOKEN")
    for i, a in enumerate(sys.argv):
        if a == "--telegram" and i + 1 < len(sys.argv):
            tok = sys.argv[i + 1]
    return tok

def main() -> None:
    from waitress import serve
    print(f"[KGOSI] Tools loaded — {len(needle_app.tools_list)} phone + "
          f"{len(KGOSI_TOOLS)} KGOSI = {len(ALL_TOOLS)} total")

    tok = _resolve_token()
    if tok:
        t = threading.Thread(target=needle_app.start_telegram_bot, args=(tok,), daemon=True)
        t.start()
        print("[KGOSI] Telegram listener started.")

    port = int(os.environ.get("KGOSI_PORT", 5055))
    print(f"[KGOSI] Bridge live → http://localhost:{port}")
    print("[KGOSI] Try 'ping kgosi' in the UI to health-check the model house.")
    serve(needle_app.app, host="0.0.0.0", port=int(os.environ.get("KGOSI_PORT", 5055)))

if __name__ == "__main__":
    main()
