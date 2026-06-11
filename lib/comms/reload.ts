/**
 * Reload communication layer for the StudEx Hermes swarm.
 *
 * Reload (https://reload.chat) is the message bus the triad uses to talk:
 * Hermes (content), OpenClaw (logic), Codex (execution), coordinated by Sentinel.
 *
 * Tokens are read from the environment — never hardcode them:
 *   RELOAD_API_TOKEN          shared/default token
 *   RELOAD_TOKEN_<AGENT>      optional per-agent override (e.g. RELOAD_TOKEN_HERMES)
 */
import { ReloadApiClient, ReloadApiEnvironment } from '@reload.chat/sdk'

export type SwarmAgent = 'hermes' | 'openclaw' | 'codex' | 'sentinel'

/** Channel registry — set channel ids in env, e.g. RELOAD_CHANNEL_OPS=chan_xxx */
export const channels = {
  ops: () => process.env.RELOAD_CHANNEL_OPS ?? '',
  content: () => process.env.RELOAD_CHANNEL_CONTENT ?? '',
  meatStore: () => process.env.RELOAD_CHANNEL_MEAT_STORE ?? '',
}

const clientCache = new Map<string, ReloadApiClient>()

function tokenFor(agent?: SwarmAgent): string {
  const perAgent = agent ? process.env[`RELOAD_TOKEN_${agent.toUpperCase()}`] : undefined
  const token = perAgent ?? process.env.RELOAD_API_TOKEN
  if (!token) {
    throw new Error(
      `Missing Reload token for ${agent ?? 'default'}. Set RELOAD_API_TOKEN (or RELOAD_TOKEN_${(agent ?? 'agent').toUpperCase()}) in .env.local`
    )
  }
  return token
}

/** Get a Reload client for an agent (cached per token). */
export function getReloadClient(agent?: SwarmAgent): ReloadApiClient {
  const token = tokenFor(agent)
  let client = clientCache.get(token)
  if (!client) {
    client = new ReloadApiClient({ token, environment: ReloadApiEnvironment.Production })
    clientCache.set(token, client)
  }
  return client
}

/** Send a message into a channel as a given agent. */
export async function sendAgentMessage(opts: {
  agent: SwarmAgent
  channelId: string
  content: string
  threadId?: string
}) {
  const client = getReloadClient(opts.agent)
  return client.messages.sendMessage({
    channelId: opts.channelId,
    content: opts.content,
    threadId: opts.threadId,
  })
}

/** Broadcast the same message to several channels (e.g. ops + content). */
export async function broadcast(agent: SwarmAgent, channelIds: string[], content: string) {
  const client = getReloadClient(agent)
  return Promise.all(
    channelIds.filter(Boolean).map((channelId) => client.messages.sendMessage({ channelId, content }))
  )
}

/** Sanity check the connection — useful at boot / from the dashboard. */
export async function verifyComms(agent: SwarmAgent = 'sentinel') {
  const client = getReloadClient(agent)
  return client.workspace.whoami()
}
