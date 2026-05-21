// Minimal Upstash-compatible Redis REST client. Shared by session-store and leads.
// Unset env => callers fall back to in-memory.

function restConfig(): { url: string; token: string } | null {
  const url = process.env.REDIS_REST_URL
  const token = process.env.REDIS_REST_TOKEN
  if (!url || !token) return null
  return { url, token }
}

export function usingRedis(): boolean {
  return restConfig() !== null
}

export async function redisCommand(command: (string | number)[]): Promise<unknown> {
  const cfg = restConfig()
  if (!cfg) return null
  try {
    const res = await fetch(cfg.url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${cfg.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(command),
    })
    if (!res.ok) return null
    const data = await res.json()
    return data?.result ?? null
  } catch {
    return null
  }
}
