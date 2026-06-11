#!/usr/bin/env bash
# Clone vendored agent tooling into ./vendor (gitignored).
#  - TencentDB-Agent-Memory: optional self-hosted memory backend (see lib/memory/agentMemory.ts)
#  - obsidian-skills: skill packs to install for the swarm agents
set -euo pipefail

cd "$(dirname "$0")/.."
mkdir -p vendor

clone_or_pull() {
  local url="$1" dir="vendor/$2"
  if [ -d "$dir/.git" ]; then
    git -C "$dir" pull --ff-only
  else
    git clone --depth 1 "$url" "$dir"
  fi
}

clone_or_pull https://github.com/TencentCloud/TencentDB-Agent-Memory.git TencentDB-Agent-Memory
clone_or_pull https://github.com/kepano/obsidian-skills.git obsidian-skills

echo "✅ Vendor repos ready in ./vendor"
echo "   - Start TencentDB-Agent-Memory and set AGENT_MEMORY_URL in .env.local to enable the external memory backend."
echo "   - Point your agents' skill loaders at ./vendor/obsidian-skills."
