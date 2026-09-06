"""KGOSI Investment Committee tools — @needle.tool decorated so the Needle agent picks them up.

Tools fall into three families:
  1. Deal scoring — score_deal, deal_analyst, get_verdict, list_deals, morning_brief
  2. Cross-agent — hypothesize (MiroFish), capital_position (AI-Trader)
  3. Comms       — send_email, list_inboxes (AgentMail), ping_kgosi
"""
import json, datetime
from collections import Counter
from pathlib import Path

import needle
import requests
from openai import OpenAI

from kgosi_config import (
    LITELLM_BASE, LITELLM_KEY, DATA_DRIVE,
    AGENTMAIL_KEY, AGENTMAIL_FROM, AGENTMAIL_BASE,
    MIROFISH_URL, AITRADER_URL,
    KGOSI_BUFFETT, KGOSI_MUNGER, KGOSI_CATHIE,
    KGOSI_NALEDI, KGOSI_CASHCLAW, KGOSI_KIGALI,
)

client = OpenAI(base_url=LITELLM_BASE, api_key=LITELLM_KEY)

# ─── The Council of Six ────────────────────────────────────────────────
COUNCIL = {
    "buffett-moat": (KGOSI_BUFFETT,
        "You are Buffett-Moat. Score the deal on cashflow durability, defensibility, "
        "and 'would this exist in 10 years'. Reply with JSON only: "
        '{"score":0-10,"moat":"string","verdict":"INVEST|DEVELOP|DEFER","rationale":"string"}'),
    "munger-regulatory": (KGOSI_MUNGER,
        "You are Munger-Regulatory. Score sovereignty edge, B-BBEE moat, regulatory arbitrage. "
        'JSON only: {"score":0-10,"sovereignty":"string","verdict":"INVEST|DEVELOP|DEFER","rationale":"string"}'),
    "cathie-growth": (KGOSI_CATHIE,
        "You are Cathie-Growth. Score 5-yr revenue ceiling, TAM, innovation curve. "
        'JSON only: {"score":0-10,"tam":"string","verdict":"INVEST|DEVELOP|DEFER","rationale":"string"}'),
    "naledi-brand": (KGOSI_NALEDI,
        "You are Naledi-Brand, African luxury strategist. Score positioning, cultural leverage, "
        'narrative fit. JSON only: {"score":0-10,"positioning":"string","verdict":"INVEST|DEVELOP|DEFER","rationale":"string"}'),
    "cashclaw-econ": (KGOSI_CASHCLAW,
        "You are Cashclaw-Unit-Econ (CFO). Score gross margin, capital efficiency, cash-to-close. "
        'JSON only: {"score":0-10,"unit_econ":"string","verdict":"INVEST|DEVELOP|DEFER","rationale":"string"}'),
    "kigali-sovereign": (KGOSI_KIGALI,
        "You are Kigali-Sovereign-Fit. Score corridor value + sovereignty alignment. "
        'JSON only: {"score":0-10,"geopol":"string","verdict":"INVEST|DEVELOP|DEFER","rationale":"string"}'),
}

# ─── Helpers ───────────────────────────────────────────────────────────
def _read_deal(deal_name: str) -> str | None:
    for sub in ("deals", "inbox"):
        p = DATA_DRIVE / sub / f"{deal_name}.md"
        if p.exists():
            return p.read_text()
    return None

def _write_verdict(deal_name: str, analyst: str, verdict: dict) -> None:
    outdir = DATA_DRIVE / "verdicts" / deal_name
    outdir.mkdir(parents=True, exist_ok=True)
    (outdir / f"{analyst}.md").write_text(
        f"# {analyst} · {deal_name}\n\n"
        f"_Generated {datetime.datetime.now().isoformat(timespec='seconds')}_\n\n"
        f"```json\n{json.dumps(verdict, indent=2)}\n```\n"
    )

def _score(analyst_key: str, deal_text: str) -> dict:
    model, sys_prompt = COUNCIL[analyst_key]
    resp = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": sys_prompt},
            {"role": "user",   "content": f"Deal brief:\n\n{deal_text}"},
        ],
        temperature=0.3,
        response_format={"type": "json_object"},
    )
    return json.loads(resp.choices[0].message.content)

def _agentmail(method: str, path: str, payload: dict | None = None) -> dict:
    if not AGENTMAIL_KEY:
        return {"error": "AGENTMAIL_KGOSI_KEY not set in .env"}
    headers = {"Authorization": f"Bearer {AGENTMAIL_KEY}",
               "Content-Type": "application/json"}
    url = f"{AGENTMAIL_BASE}{path}"
    try:
        r = requests.request(method, url, headers=headers, json=payload, timeout=30)
        return {"status": r.status_code, "body": r.json() if r.text else {}}
    except Exception as e:
        return {"error": str(e)}

# ─── Tools · Deal Scoring ─────────────────────────────────────────────

@needle.tool
def list_deals() -> str:
    """List every deal currently in the Black Cloud pipeline."""
    active = sorted((DATA_DRIVE / "deals").glob("*.md"))
    inbox  = sorted((DATA_DRIVE / "inbox").glob("*.md"))
    if not active and not inbox:
        return "No deals yet. Drop a deal brief in Data Ceters/inbox/ as {name}.md"
    lines = []
    if active:
        lines += ["Active deals:"] + [f"  • {f.stem}" for f in active]
    if inbox:
        lines += ["", "Inbox (unqualified):"] + [f"  • {f.stem}" for f in inbox]
    return "\n".join(lines)

@needle.tool
def score_deal(deal_name: str) -> str:
    """Convene the full 6-analyst KGOSI council on a deal and produce a portfolio verdict."""
    deal_text = _read_deal(deal_name)
    if not deal_text:
        return f"Deal '{deal_name}' not found. Drop {deal_name}.md into Data Ceters/inbox/ first."
    results = {}
    for analyst_key in COUNCIL:
        try:
            v = _score(analyst_key, deal_text)
            _write_verdict(deal_name, analyst_key, v)
            results[analyst_key] = v
        except Exception as e:
            results[analyst_key] = {"error": str(e)}
    scores = [v["score"] for v in results.values() if isinstance(v, dict) and "score" in v]
    avg = round(sum(scores) / len(scores), 2) if scores else 0
    verdicts = [v["verdict"] for v in results.values() if isinstance(v, dict) and "verdict" in v]
    verdict = Counter(verdicts).most_common(1)[0][0] if verdicts else "DEFER"
    synthesis = {"deal": deal_name, "avg_score": avg, "verdict": verdict,
                 "generated": datetime.datetime.now().isoformat(timespec='seconds'),
                 "council": results}
    out = DATA_DRIVE / "portfolio" / f"{deal_name}.json"
    out.write_text(json.dumps(synthesis, indent=2))
    return f"✓ {deal_name}: avg={avg}/10, verdict={verdict}. Written to portfolio/{deal_name}.json"

@needle.tool
def deal_analyst(deal_name: str, lens: str) -> str:
    """Run a single-lens analyst on a deal. lens ∈ {buffett-moat, munger-regulatory, cathie-growth, naledi-brand, cashclaw-econ, kigali-sovereign}."""
    if lens not in COUNCIL:
        return f"Unknown lens '{lens}'. Valid: {list(COUNCIL.keys())}"
    deal_text = _read_deal(deal_name)
    if not deal_text:
        return f"Deal '{deal_name}' not found."
    v = _score(lens, deal_text)
    _write_verdict(deal_name, lens, v)
    return json.dumps(v, indent=2)

@needle.tool
def get_verdict(deal_name: str) -> str:
    """Read the latest synthesized portfolio verdict for a deal."""
    p = DATA_DRIVE / "portfolio" / f"{deal_name}.json"
    if not p.exists():
        return f"No verdict yet for '{deal_name}'. Run score_deal first."
    return p.read_text()

@needle.tool
def morning_brief() -> str:
    """Generate today's KGOSI morning brief — every scored deal, verdict, and avg score."""
    portfolio = sorted((DATA_DRIVE / "portfolio").glob("*.json"))
    if not portfolio:
        return "No deals in portfolio yet. Score at least one first."
    briefs = []
    for f in portfolio:
        d = json.loads(f.read_text())
        briefs.append(f"• {d['deal']}: {d['verdict']} (avg {d['avg_score']}/10)")
    body = "\n".join(briefs)
    today = datetime.date.today().isoformat()
    out = DATA_DRIVE / "RALF" / f"{today}.md"
    out.write_text(f"# KGOSI Morning Brief · {today}\n\n{body}\n")
    return f"Brief written → RALF/{today}.md\n\n{body}"

# ─── Tools · Cross-Agent (MiroFish + AI-Trader) ───────────────────────

@needle.tool
def hypothesize(deal_name: str, persona_count: int = 200) -> str:
    """Send a deal to MiroFish to simulate persona_count stakeholders' reaction over 72h."""
    deal_text = _read_deal(deal_name)
    if not deal_text:
        return f"Deal '{deal_name}' not found."
    try:
        r = requests.post(f"{MIROFISH_URL}/api/simulate",
                          json={"document": deal_text, "personas": persona_count,
                                "hours": 72, "deal_name": deal_name},
                          timeout=60)
        if r.status_code >= 400:
            return f"MiroFish at {MIROFISH_URL} rejected: {r.status_code} {r.text[:200]}"
        result = r.json()
        out = DATA_DRIVE / "verdicts" / deal_name / "mirofish.json"
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(json.dumps(result, indent=2))
        return f"✓ MiroFish simulated {persona_count} personas on {deal_name}. See verdicts/{deal_name}/mirofish.json"
    except requests.exceptions.ConnectionError:
        return (f"MiroFish not running at {MIROFISH_URL}. "
                f"Start it: cd ~/black-cloud-os/mirofish-offline && docker compose up -d")

@needle.tool
def capital_position() -> str:
    """Ask AI-Trader for current cash + open positions to inform KGOSI capital allocation."""
    try:
        r = requests.get(f"{AITRADER_URL}/api/portfolio", timeout=15)
        if r.status_code >= 400:
            return f"AI-Trader rejected: {r.status_code} {r.text[:200]}"
        return json.dumps(r.json(), indent=2)
    except requests.exceptions.ConnectionError:
        return (f"AI-Trader not running at {AITRADER_URL}. "
                f"Start it: cd ~/black-cloud-os/ai-trader && ./run-local.sh")

# ─── Tools · Comms (AgentMail) ────────────────────────────────────────

@needle.tool
def list_inboxes() -> str:
    """List AgentMail inboxes available to KGOSI."""
    res = _agentmail("GET", "/inboxes")
    if "error" in res:
        return res["error"]
    boxes = res.get("body", {}).get("inboxes", [])
    if not boxes:
        return f"No inboxes returned. Status {res.get('status')}."
    return "\n".join(f"• {b.get('address', b.get('email','?'))} — {b.get('name','?')}" for b in boxes)

@needle.tool
def send_email(to: str, subject: str, body: str, from_addr: str = "") -> str:
    """Send an email via AgentMail. from_addr defaults to kgosi@studex.dev if empty."""
    payload = {
        "to": [to] if isinstance(to, str) else to,
        "from": from_addr or AGENTMAIL_FROM,
        "subject": subject,
        "text": body,
    }
    res = _agentmail("POST", "/messages/send", payload)
    if "error" in res:
        return f"AgentMail error: {res['error']}"
    if res.get("status", 500) >= 400:
        return f"AgentMail rejected: {res.get('status')} {json.dumps(res.get('body'))[:300]}"
    return f"✓ Email sent to {to} — subject '{subject}'"

# ─── Tools · Health ────────────────────────────────────────────────────

@needle.tool
def ping_kgosi() -> str:
    """Health check for the entire Black Cloud stack — LiteLLM, MiroFish, AI-Trader, AgentMail."""
    lines = []
    # LiteLLM: try a tiny chat completion instead of /models (which has a DB dep)
    try:
        r = client.chat.completions.create(
            model=KGOSI_CASHCLAW,
            messages=[{"role": "user", "content": "reply OK"}],
            max_tokens=5, temperature=0)
        lines.append(f"✓ LiteLLM ({LITELLM_BASE}) — {KGOSI_CASHCLAW} responded")
    except Exception as e:
        lines.append(f"✗ LiteLLM ({LITELLM_BASE}) — {str(e)[:120]}")
    # MiroFish
    try:
        r = requests.get(f"{MIROFISH_URL}/", timeout=3)
        lines.append(f"✓ MiroFish ({MIROFISH_URL}) — HTTP {r.status_code}")
    except Exception:
        lines.append(f"✗ MiroFish ({MIROFISH_URL}) — not running")
    # AI-Trader
    try:
        r = requests.get(f"{AITRADER_URL}/", timeout=3)
        lines.append(f"✓ AI-Trader ({AITRADER_URL}) — HTTP {r.status_code}")
    except Exception:
        lines.append(f"✗ AI-Trader ({AITRADER_URL}) — not running")
    # AgentMail
    if AGENTMAIL_KEY:
        res = _agentmail("GET", "/inboxes")
        st = res.get("status", "err")
        lines.append(f"{'✓' if isinstance(st,int) and st < 400 else '✗'} AgentMail — status {st}")
    else:
        lines.append("✗ AgentMail — key not set")
    return "\n".join(lines)

KGOSI_TOOLS = [
    list_deals, score_deal, deal_analyst, get_verdict, morning_brief,
    hypothesize, capital_position,
    list_inboxes, send_email,
    ping_kgosi,
]
