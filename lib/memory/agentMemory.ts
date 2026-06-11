/**
 * Swarm memory layer.
 *
 * Primary backend: Reload's built-in workspace context graph
 * (client.memory.* — remember / recall / search with provenance).
 *
 * Optional secondary backend: a self-hosted TencentDB-Agent-Memory service
 * (https://github.com/TencentCloud/TencentDB-Agent-Memory) — clone it with
 * scripts/setup_vendor.sh and point AGENT_MEMORY_URL at the running service.
 */
import { getReloadClient, type SwarmAgent } from '@/lib/comms/reload'

export type MemoryKind = 'decision' | 'fact' | 'preference'

/** Provenance pointer — Reload rejects memories without one. */
export interface MemorySource {
  kind: 'message' | 'artifact' | 'memory'
  id: string
}

/** Write a memory into the workspace context graph. */
export async function remember(opts: {
  agent: SwarmAgent
  content: string
  kind: MemoryKind
  scopeId: string
  derivedFrom: MemorySource[]
}) {
  const client = getReloadClient(opts.agent)
  return client.memory.rememberMemory({
    content: opts.content,
    kind: opts.kind,
    scope_id: opts.scopeId,
    derived_from: opts.derivedFrom,
  })
}

/** Semantic recall over the context graph. */
export async function recall(opts: { agent: SwarmAgent; query: string; scopeId?: string; limit?: number }) {
  const client = getReloadClient(opts.agent)
  return client.memory.recall({
    query: opts.query,
    scope_id: opts.scopeId,
    limit: opts.limit ?? 10,
  })
}

/** Pull bootstrap context for an agent session start. */
export async function bootstrapContext(agent: SwarmAgent, agentIdentityId: string, scopeId?: string) {
  const client = getReloadClient(agent)
  return client.memory.bootstrapContext({ agent_identity_id: agentIdentityId, scope_id: scopeId })
}

/**
 * Optional: query a self-hosted TencentDB-Agent-Memory service.
 * No-ops (returns null) when AGENT_MEMORY_URL is not configured.
 */
export async function recallExternal(query: string): Promise<unknown | null> {
  const base = process.env.AGENT_MEMORY_URL
  if (!base) return null
  const res = await fetch(`${base.replace(/\/$/, '')}/recall`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  })
  if (!res.ok) throw new Error(`Agent memory service error: ${res.status}`)
  return res.json()
}
