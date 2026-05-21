# 🤖 StudEx Hermes Swarm Agents

Our command center leverages a triad of high-performance agents backed by cloud-hosted models (Kimi, Minimax, GLM-5.1) through the Sentinel-Ollama bridge.

## 📡 The Triad
- **Hermes (Creative/Content):** Powered by `kimi-k2.6:cloud`. Orchestrated via `spawn hermes local`.
- **OpenClaw (Logic/Technical):** Powered by `glm-5.1:cloud`. Orchestrated via `spawn openclaw local`.
- **Codex (Execution/Optimization):** Powered by `minimax-01:cloud`. Orchestrated via `spawn codex local`.

## 💼 Customer-Facing
- **ADA (Sales Concierge):** Superhuman sales agent at `/sales`. Patterns borrowed from [`nazirlouis/ada_v2`](https://github.com/nazirlouis/ada_v2) (dialog loop) and [`dograh-hq/dograh`](https://github.com/dograh-hq/dograh) (STT → LLM → TTS pipeline). Full duplex live-call mode with browser-side VAD, OpenAI Whisper STT, Pinecone-grounded RAG, OpenRouter LLM, and ElevenLabs streaming TTS.

### ADA Pipeline
| Stage | Provider | Env |
|-------|----------|-----|
| Voice in | Browser MediaRecorder + Web Audio VAD | — |
| STT | Whisper-compatible | `STT_API_KEY`, `STT_BASE_URL`, `STT_MODEL` |
| Retrieval | Pinecone (Obsidian vault) | `PINECONE_API_KEY`, `PINECONE_INDEX_HOST`, `PINECONE_NAMESPACE` |
| Embeddings | OpenAI-compatible | `EMBEDDING_API_KEY`, `EMBEDDING_BASE_URL`, `EMBEDDING_MODEL` |
| LLM | OpenRouter (default Kimi K2) | `CLOUD_MODEL_API_KEY`, `CLOUD_MODEL_BASE_URL`, `SALES_AGENT_MODEL` |
| TTS | ElevenLabs streaming | `ELEVENLABS_API_KEY`, `ELEVENLABS_VOICE_ID`, `ELEVENLABS_MODEL` |
| Fallback | Deterministic catalog (always-on demo) | — |

### Routes
- `POST /api/sales/chat` — RAG-grounded reply (web / voice / whatsapp channel)
- `POST /api/sales/voice/stt` — multipart audio → transcript
- `POST /api/sales/voice/tts` — text → streaming MP3
- `POST /api/sales/voice/clone` — mint ADA's voice from `voice_samples/`
- `POST /api/sales/context` — debug Pinecone retrieval
- `POST /api/whatsapp/webhook` — Twilio WhatsApp webhook (text + voice notes)
- `GET /api/sales/catalog` — shared product catalog feed (Charlie Tools webhook + ADA channels)
- `POST /api/memory/ingest` — meeting/call transcript → Obsidian vault + Pinecone

### Meeting & call memory
ADA/Charlie cannot auto-join calls themselves — pair a meeting-bot service (Recall.ai, Fireflies, Otter export) and point its transcript webhook at `POST /api/memory/ingest`. The receiver writes a markdown note to `vault/meetings/<date>-<slug>.md` (Obsidian) and embeds the transcript into Pinecone under the same namespace ADA retrieves from, so past calls become recallable context. Optional `MEMORY_INGEST_SECRET` gates the endpoint via the `X-Ingest-Secret` header.

### WhatsApp channel (Twilio)
Customers message ADA on a Twilio-hosted WhatsApp number. Inbound messages — text or voice notes — are signature-verified, routed through the same `salesReply` brain (RAG + LLM), and replied via the Twilio REST API. Voice notes are downloaded with HTTP Basic auth and transcribed via Whisper. Per-customer conversation state (6h TTL, last 20 turns) persists in Upstash-compatible Redis when `REDIS_REST_URL` + `REDIS_REST_TOKEN` are set, and falls back to per-instance memory otherwise (`lib/session-store.ts`). Env: `TWILIO_ACCOUNT_SID`, `TWILIO_API_KEY_SID` + `TWILIO_API_KEY_SECRET` (or `TWILIO_AUTH_TOKEN`), `TWILIO_WHATSAPP_NUMBER`. Point Twilio Console → Messaging → WhatsApp Sandbox → "When a message comes in" at `https://<your-host>/api/whatsapp/webhook`.

### Knowledge ingestion
Drop Obsidian markdown into `vault/` (or pass a path), then:
```bash
bun run scripts/ingest_vault.ts
```

### Local + cloud model routing (LM Studio)
The agent brain routes LLM calls through `lib/llm.ts`. `LLM_PROVIDER` selects order: `local`, `cloud`, or `auto` (default — try local first, fall back to cloud). Local models run on an LM Studio (or Ollama) OpenAI-compatible server; set `LOCAL_MODEL_BASE_URL`. To serve other machines on the network, start LM Studio's server bound to `0.0.0.0` and point clients at the host's LAN IP, e.g. `http://192.168.1.50:1234/v1`. Cloud fallback uses `CLOUD_MODEL_*`. A dead local node times out in ~4s and falls back automatically.

## 🛠 Command Syntax
Use the Sentinel-Ollama wrapper for rapid deployment:
```bash
ollama launch <agent> --model <model:cloud>
```

## 🔭 Strategy
All agents follow the **Research -> Strategy -> Execution -> Validation** lifecycle managed by **Sentinel (CTO)** and implemented by **Agent Lord** via Cursor.
