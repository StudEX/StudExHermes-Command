# 🤖 StudEx Hermes Swarm Agents

Our command center leverages a triad of high-performance agents backed by cloud-hosted models (Kimi, Minimax, GLM-5.1) through the Sentinel-Ollama bridge.

## 📡 The Triad
- **Hermes (Creative/Content):** Powered by `kimi-k2.6:cloud`. Orchestrated via `spawn hermes local`.
- **OpenClaw (Logic/Technical):** Powered by `glm-5.1:cloud`. Orchestrated via `spawn openclaw local`.
- **Codex (Execution/Optimization):** Powered by `minimax-01:cloud`. Orchestrated via `spawn codex local`.

## 🛠 Command Syntax
Use the Sentinel-Ollama wrapper for rapid deployment:
```bash
ollama launch <agent> --model <model:cloud>
```

## 🔭 Strategy
All agents follow the **Research -> Strategy -> Execution -> Validation** lifecycle managed by **Sentinel (CTO)** and implemented by **Agent Lord** via Cursor.

## 📞 Communication Layer (Reload)
All swarm agents communicate over **Reload** (`@reload.chat/sdk`). The integration lives in `lib/comms/reload.ts`:
- Tokens come from env vars (`RELOAD_API_TOKEN`, optional `RELOAD_TOKEN_<AGENT>` overrides) — copy `.env.example` to `.env.local`. **Never commit real keys.**
- Channels are registered via `RELOAD_CHANNEL_OPS`, `RELOAD_CHANNEL_CONTENT`, `RELOAD_CHANNEL_MEAT_STORE`.
- Server-side send endpoint: `POST /api/comms/send` with `{ agent, channelId, content, threadId? }`.

## 🧠 Memory
`lib/memory/agentMemory.ts` wraps Reload's workspace context graph (`remember` / `recall` / `bootstrapContext`, with provenance pointers). An optional self-hosted [TencentDB-Agent-Memory](https://github.com/TencentCloud/TencentDB-Agent-Memory) backend can be enabled by running `scripts/setup_vendor.sh` and setting `AGENT_MEMORY_URL`.

## 🎨 Content Pipeline (Freepik + Gemini)
Hermes' content workflow pairs AI copy with imagery:
- `lib/content/gemini.ts` — Google Gemini text generation (`generateText`, `draftCampaignCopy`). Requires `GEMINI_API_KEY` (an `AIza…` key from aistudio.google.com); model via optional `GEMINI_MODEL`.
- `lib/content/freepik.ts` — Freepik `searchStock()` for stock assets and `generateImage()` for AI imagery. Requires `FREEPIK_API_KEY`.
- Combined endpoint: `POST /api/content/generate` with `{ brief, imageMode?: 'stock' | 'generate', imageTerm? }` returns `{ copy, imagery }`.

> Google Drive / Calendar / Gmail are **not** wired — they need a full OAuth2 client (client id + secret + refresh token), not an API key.

## 🛰️ MCP
`.mcp.json` registers the Reload MCP server (`https://mcp.reload.chat/mcp`) for agent tooling; its bearer token is expanded from `RELOAD_API_TOKEN` at runtime, never committed.

## 🧰 Skill Packs
Run `scripts/setup_vendor.sh` to pull [obsidian-skills](https://github.com/kepano/obsidian-skills) into `./vendor/obsidian-skills` and point agent skill loaders there.
