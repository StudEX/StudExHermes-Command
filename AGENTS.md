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
- `POST /api/sales/chat` — RAG-grounded reply (web or voice channel)
- `POST /api/sales/voice/stt` — multipart audio → transcript
- `POST /api/sales/voice/tts` — text → streaming MP3
- `POST /api/sales/voice/clone` — mint ADA's voice from `voice_samples/`
- `POST /api/sales/context` — debug Pinecone retrieval

### Knowledge ingestion
Drop Obsidian markdown into `vault/` (or pass a path), then:
```bash
bun run scripts/ingest_vault.ts
```

## 🛠 Command Syntax
Use the Sentinel-Ollama wrapper for rapid deployment:
```bash
ollama launch <agent> --model <model:cloud>
```

## 🔭 Strategy
All agents follow the **Research -> Strategy -> Execution -> Validation** lifecycle managed by **Sentinel (CTO)** and implemented by **Agent Lord** via Cursor.
