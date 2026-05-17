# 🛡️ Sentinel CTO Protocol

This repository is the central command center for **StudEx Hermes**. 

## 🏗️ Orchestration Role
Sentinel (CLI Agent) acts as the engine, managing the underlying infrastructure, API bridging, and multi-agent coordination.

## 🕹️ User Interaction
**Agent Lord** directs the swarm using this repo as the base.
- **CLI:** Use `ollama launch` for rapid agent spin-up.
- **IDE:** Open this repo in **Cursor** to leverage the `.cursorrules` and `SWARM_SETUP_PLAN.md`.

## 🔒 Security
Sensitive keys are managed in a local `.env` file and must never be committed. Use `.env.example` as a template for new environments.
