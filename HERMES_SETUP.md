# Hermes Command Centre — Operating System Setup

**Host layout:** Mac Mini M4 Pro = server (LiteLLM router, KGOSI Bridge, Ollama, LM Studio, Cloudflare Tunnel). MacBook Pro = dev + voice (JARVIS/VoiceBox). Windows PC (192.168.1.114, 2× GTX 1080) = GPU compute (video, heavy inference).

## 1. Boot order (Mac Mini)

```bash
# 1. Ollama (models pinned in ~/.ollama/models)
launchctl load ~/Library/LaunchAgents/com.ollama.plist   # or: ollama serve &

# 2. LM Studio server on :1234 (Developer → Start Server, load 5 models)

# 3. LiteLLM router on :4000
cd ~/studex-hermes-router
source ../black-cloud-os/StudExHermes-Command/agents/black-cloud-os/load_env.sh
litellm --config litellm_config.yaml --port 4000 &

# 4. KGOSI Bridge on :5055 (Cactus Needle + 10 KGOSI tools)
cd ~/black-cloud-os/StudExHermes-Command/agents/black-cloud-os
./start-black-cloud.sh
```

Verify: `curl -s http://localhost:4000/v1/models | jq '.data | length'` returns 20+, and `curl -s http://localhost:5055/api/chat -d '{"message":"ping kgosi"}' -H 'content-type: application/json'` returns model house health.

## 2. JARVIS voice bridge (MacBook)

VoiceBox post-transcript hook → `agents/black-cloud-os/jarvis_kgosi_pipe.sh`. Investment/deal keywords route to KGOSI Bridge over Tailscale mesh to Mac Mini; everything else falls through to the original `~/second-brain/jarvis_pipe.sh`.

Trigger keywords: `score | verdict | hypothes | deal | portfolio | invest | kgosi | council | analyst | morning brief | capital position | black cloud | inbox | send email`.

## 3. Google Workspace connection (studex.dev)

- MX confirmed: `aspmx.l.google.com` — studex.dev is a real Google Workspace domain.
- Working service account: `agent-dataroom@agentic-lab-3324f.iam.gserviceaccount.com` → JSON at `~/.openclaw/workspace/keys/agent-dataroom.json`. Referenced in the MCP config as `GOOGLE_APPLICATION_CREDENTIALS`.
- For Google Chat / Gmail / Calendar as `t.ramaphosa@studex.dev`, enable **domain-wide delegation** for the service account in the Workspace admin console (`admin.google.com` → Security → API controls → Domain-wide delegation → add the service account's OAuth client ID with scopes: `https://www.googleapis.com/auth/chat.messages`, `.../drive`, `.../gmail.send`, `.../calendar`).
- Two Google accounts on gcloud: `t.ramaphosa@studex.dev` (Workspace) and `tumelor001@gmail.com` (active, owns `agentic-lab-3324f` + Gemini projects). Active project: `social-engine-493019`.

## 4. Agents on the MCP bundle

See `agents/mcp/hermes.mcp.json`. Servers wired: obsidian-vault, hermes-repo, github-studex, google-drive, kgosi-bridge, litellm-router, orgo, agentmail. Agents defined: hermes, openclaw, codex, kgosi, robusca, grok-bots (external).

Load into Claude Code: copy the `mcpServers` block into `~/.claude.json` under the top-level `mcpServers` key.

Load into Claude Desktop: merge into `~/Library/Application Support/Claude/claude_desktop_config.json`.

## 5. Buzz agents policy

**Do not modify Buzz agents in this pass.** Configure via CLI only — no code changes.

## 6. Herdr + OpenHands

- Herdr repo at `~/Herdr` (Rust). Build: `cd ~/Herdr && cargo build --release`. Then `./target/release/herdr` binds to the LiteLLM router.
- OpenHands: `pipx install openhands-ai` OR run the docker image; wire it to `http://localhost:4000/v1` and use any of the KGOSI aliases as the model name.

## 7. Storage of secrets

Real values in `~/Desktop/Founder/studex-api-keys/.env.complete`. `load_env.sh` sources it once at boot; nothing else needs a copy. Do not commit `.env` files.
