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
