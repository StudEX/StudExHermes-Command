# 🤖 StudEx Hermes Swarm Agents

Our command center leverages a triad of high-performance agents backed by cloud-hosted models (Kimi, Minimax, GLM-5.1) through the Sentinel-Ollama bridge.

## 📡 The Triad
- **Hermes (Creative/Content):** Powered by `kimi-k2.6:cloud`. Orchestrated via `spawn hermes local`.
- **OpenClaw (Logic/Technical):** Powered by `glm-5.1:cloud`. Orchestrated via `spawn openclaw local`.
- **Codex (Execution/Optimization):** Powered by `minimax-01:cloud`. Orchestrated via `spawn codex local`.

## 💼 Customer-Facing
- **ADA (Sales Agent):** Pattern adapted from [`nazirlouis/ada_v2`](https://github.com/nazirlouis/ada_v2). Lives at `/sales` with backend `app/api/sales/chat`. Routes to the cloud model via `CLOUD_MODEL_API_KEY` / `CLOUD_MODEL_BASE_URL` (default `https://openrouter.ai/api/v1`) using `SALES_AGENT_MODEL` (default `moonshotai/kimi-k2`). Falls back to a deterministic catalog responder when no key is set, so the console stays live for demos.

## 🛠 Command Syntax
Use the Sentinel-Ollama wrapper for rapid deployment:
```bash
ollama launch <agent> --model <model:cloud>
```

## 🔭 Strategy
All agents follow the **Research -> Strategy -> Execution -> Validation** lifecycle managed by **Sentinel (CTO)** and implemented by **Agent Lord** via Cursor.
