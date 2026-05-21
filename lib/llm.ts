import type { ChatMessage } from './sales-brain'

type Endpoint = { baseUrl: string; apiKey: string; model: string; label: 'local' | 'cloud' }

// LM Studio (and Ollama) expose an OpenAI-compatible server. Point LOCAL_MODEL_BASE_URL
// at the host running it, e.g. http://192.168.1.50:1234/v1 so other machines on the
// network can reach it. CLOUD_MODEL_* is the API fallback (OpenRouter by default).
function localEndpoint(): Endpoint | null {
  const baseUrl = process.env.LOCAL_MODEL_BASE_URL
  if (!baseUrl) return null
  return {
    baseUrl,
    apiKey: process.env.LOCAL_MODEL_API_KEY || 'lm-studio',
    model: process.env.LOCAL_MODEL || 'local-model',
    label: 'local',
  }
}

function cloudEndpoint(): Endpoint | null {
  const apiKey = process.env.CLOUD_MODEL_API_KEY
  if (!apiKey) return null
  return {
    baseUrl: process.env.CLOUD_MODEL_BASE_URL || 'https://openrouter.ai/api/v1',
    apiKey,
    model: process.env.SALES_AGENT_MODEL || 'moonshotai/kimi-k2',
    label: 'cloud',
  }
}

// Ordered by LLM_PROVIDER: 'local' | 'cloud' | 'auto' (default 'auto' = local first, cloud fallback).
function orderedEndpoints(): Endpoint[] {
  const provider = (process.env.LLM_PROVIDER || 'auto').toLowerCase()
  const local = localEndpoint()
  const cloud = cloudEndpoint()
  if (provider === 'local') return [local].filter(Boolean) as Endpoint[]
  if (provider === 'cloud') return [cloud].filter(Boolean) as Endpoint[]
  return [local, cloud].filter(Boolean) as Endpoint[]
}

export type ChatOptions = { temperature: number; maxTokens: number; model?: string }

async function tryEndpoint(
  ep: Endpoint,
  messages: ChatMessage[],
  opts: ChatOptions,
): Promise<string | null> {
  // Short timeout so a dead local node falls back to cloud quickly.
  const timeoutMs = ep.label === 'local' ? 4000 : 30000
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(`${ep.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${ep.apiKey}` },
      body: JSON.stringify({
        model: opts.model || ep.model,
        messages,
        temperature: opts.temperature,
        max_tokens: opts.maxTokens,
      }),
      signal: controller.signal,
    })
    if (!res.ok) return null
    const data = await res.json()
    const text = data?.choices?.[0]?.message?.content
    return typeof text === 'string' && text.trim().length > 0 ? text : null
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}

// Runs the prepared messages through the first reachable endpoint (local LM Studio,
// then cloud API). Returns null if every endpoint fails or none is configured.
export async function chatCompletion(
  messages: ChatMessage[],
  opts: ChatOptions,
): Promise<string | null> {
  for (const ep of orderedEndpoints()) {
    const out = await tryEndpoint(ep, messages, opts)
    if (out) return out
  }
  return null
}

export function llmConfigured(): boolean {
  return orderedEndpoints().length > 0
}
