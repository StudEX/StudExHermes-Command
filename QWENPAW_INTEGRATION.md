# 🐾 QwenPaw Integration Plan — StudEx Team Channels

> **Status:** Plan only. Not built today. QwenPaw runs as a **separate service**;
> this document defines how it connects to the StudEx Hermes command center.
> Source: [`agentscope-ai/QwenPaw`](https://github.com/agentscope-ai/QwenPaw)

## Why QwenPaw (and where it fits)

QwenPaw is a Python personal-assistant framework with **native multi-channel support**
(Discord, Telegram, WeChat, Feishu, DingTalk, iMessage), a skills/plugin system,
evolving memory, and LLM routing across Qwen/Gemini/OpenAI and local (Ollama/LM Studio).

We are **not** merging it into this Next.js repo. It becomes the **internal team
assistant** layer, deployed on its own. Clear division of labour:

| Surface | Owner | Audience |
|---------|-------|----------|
| Web chat `/sales`, WhatsApp, RAG, onboarding | This repo (ADA) | **Customers** |
| Phone calls (inbound + post-purchase) | ElevenLabs (Charlie) | **Customers** |
| Discord / Telegram / Slack team assistant | **QwenPaw** | **Internal team** |

Keep customer-facing and internal assistants separate so a team query never leaks
into a customer thread.

## Channel reality check

QwenPaw ships Discord + Telegram natively. **Slack is NOT a built-in QwenPaw channel.**
Three options for the Slack requirement:

1. **QwenPaw plugin for Slack** — write a `/plugins` adapter using Slack Bolt. Cleanest, keeps one brain.
2. **Separate Slack bot** in this repo (`/api/slack/events`) calling the shared backend. More code, but stays in our stack.
3. **Bridge** (e.g. matterbridge) Discord ⇄ Slack. Quick, hacky, not recommended for production.

Recommendation: **Option 1** once QwenPaw is stood up; Discord + Telegram come for free.

## Connection points to this command center

QwenPaw talks to StudEx over HTTP — no shared code, just our existing endpoints:

| QwenPaw skill | Calls | Purpose |
|---------------|-------|---------|
| Catalog lookup | `GET /api/sales/catalog` | Same product/price source as ADA + Charlie |
| Meeting memory | `POST /api/memory/ingest` | Team notes land in the same Obsidian vault + Pinecone |
| Lead handoff | `POST /api/onboard` | Team can register a lead from a channel |
| Knowledge (RAG) | Pinecone (shared namespace) | Reads the same `PINECONE_NAMESPACE` ADA retrieves from |

### Shared LLM routing
QwenPaw should point at the **same models** this repo uses (see `lib/llm.ts`):
- **Local first:** LM Studio / Ollama at `LOCAL_MODEL_BASE_URL` (e.g. `http://192.168.1.50:1234/v1`)
- **Cloud fallback:** OpenRouter via `CLOUD_MODEL_API_KEY` (Kimi/GLM/Qwen)

This keeps voice tone and product knowledge consistent across customer + team assistants.

## Deployment shape (when we build it)

```
┌────────────────────────┐        HTTP         ┌──────────────────────────┐
│  QwenPaw service        │ ──────────────────▶ │  StudEx Next.js (Vercel)  │
│  (Docker, own host)     │   catalog / memory  │  /api/sales/catalog       │
│  Discord + Telegram     │   / onboard         │  /api/memory/ingest       │
│  (+ Slack plugin)       │ ◀────────────────── │  /api/onboard             │
└────────────────────────┘                     └──────────────────────────┘
        │                                                  │
        └──────────────► Pinecone (shared namespace) ◀─────┘
        └──────────────► LM Studio / OpenRouter (shared)
```

- **Host:** any box with Docker (a small VPS or an on-prem node next to LM Studio).
- **Run:** `qwenpaw init` → configure channels + model → `qwenpaw app` (console on `:8088`), or Docker.

## What we need before building (not today)

- [ ] Decision on host for the QwenPaw service (VPS vs on-prem near LM Studio)
- [ ] **Discord** bot token + application (developer portal)
- [ ] **Telegram** bot token (BotFather) — optional
- [ ] **Slack** app (Bolt) credentials — only if Option 1 is chosen
- [ ] Confirm shared `PINECONE_NAMESPACE` so team + customer assistants read one knowledge base
- [ ] StudEx public URL deployed (so QwenPaw skills can reach `/api/*`)

## Boundaries / guardrails

- QwenPaw is **internal**: never exposes customer PII to a public channel.
- Tool guards + skill security scanning (QwenPaw built-ins) stay enabled.
- The customer-facing brain (`lib/sales-brain.ts`) is **not** imported by QwenPaw — they share data via HTTP + Pinecone only, never code.
