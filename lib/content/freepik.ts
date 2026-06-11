/**
 * Freepik connector for the content generation pipeline.
 *
 * Used by Hermes (content agent) to source stock assets and generate
 * AI imagery for the meat store campaigns and StudEx marketing content.
 *
 * Requires FREEPIK_API_KEY in the environment (from your Freepik
 * membership dashboard → API settings). Never hardcode the key.
 */

const FREEPIK_API_BASE = 'https://api.freepik.com/v1'

function apiKey(): string {
  const key = process.env.FREEPIK_API_KEY
  if (!key) throw new Error('Missing FREEPIK_API_KEY in .env.local')
  return key
}

async function freepikFetch(path: string, init?: RequestInit) {
  const res = await fetch(`${FREEPIK_API_BASE}${path}`, {
    ...init,
    headers: {
      'x-freepik-api-key': apiKey(),
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Freepik API ${res.status}: ${body.slice(0, 200)}`)
  }
  return res.json()
}

/** Search Freepik stock resources (photos, vectors, PSDs). */
export async function searchStock(opts: {
  term: string
  limit?: number
  contentType?: 'photo' | 'vector' | 'psd'
}) {
  const params = new URLSearchParams({
    term: opts.term,
    limit: String(opts.limit ?? 10),
  })
  if (opts.contentType) params.set(`filters[content_type][${opts.contentType}]`, '1')
  return freepikFetch(`/resources?${params}`)
}

/** Generate an AI image from a prompt (Freepik text-to-image). */
export async function generateImage(opts: {
  prompt: string
  negativePrompt?: string
  numImages?: number
}) {
  return freepikFetch('/ai/text-to-image', {
    method: 'POST',
    body: JSON.stringify({
      prompt: opts.prompt,
      negative_prompt: opts.negativePrompt,
      num_images: opts.numImages ?? 1,
    }),
  })
}
