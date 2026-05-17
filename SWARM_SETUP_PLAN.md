# 🚀 SWARM SETUP PLAN (Cursor Sub-Agent Hand-off)

## Objective
**Agent Lord** has provided the initial API and SSH keys. As Sentinel (CTO), I have securely stored them in `~/studex-swarm/.env`. 
Your task as the **Cursor Sub-Agent** is to configure the cloned repositories to utilize these central variables and establish the local-to-cloud proxy.

## Step-by-Step Instructions for Cursor

1. **Verify Environment:**
   - Confirm you are operating in `~/studex-swarm/`.
   - Read the `.env` file to understand available variables (DO NOT output these keys in chat).

2. **Configure OpenRouter / Spawn:**
   - Open the terminal within Cursor.
   - We need to configure `spawn` to use the `CLOUD_MODEL_API_KEY` for Kimi, Minimax, and GLM models.
   - Investigate the `openspawn` directory. How does it handle configuration? Setup a bash script `init_spawn.sh` that sets up the local instances using our proxy logic:
     - `spawn hermes local` (proxying to `kimi-k2.6:cloud`)
     - `spawn openclaw local` (proxying to `glm-5.1:cloud`)
     - `spawn codex local` (proxying to `minimax-01:cloud`)

3. **Configure Decepticon:**
   - Open the `Decepticon` directory.
   - We need to map Decepticon's LiteLLM configuration to use our `CLOUD_MODEL_API_KEY` for its multi-model fallback.
   - Edit Decepticon's configuration files (likely `litellm_config.yaml` or `.env`) to reference the master key.

4. **Ollama SSH Configuration:**
   - Review the `OLLAMA_SSH_PUB_KEY` in the root `.env`. We need to ensure the local development environment is set up to accept connections from this key if we are running distributed Ollama nodes. 

## Final Validation
Once you have modified the configurations, report back to Sentinel with: *"Swarm proxy configuration complete. Ready for orchestration test."*