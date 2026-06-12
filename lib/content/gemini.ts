/**
 * Google Gemini connector for the content pipeline.
 *
 * Powers AI text generation (campaign copy, product descriptions, captions)
 * to pair with Freepik imagery for the meat store and StudEx marketing.
 *
 * Requires GEMINI_API_KEY — an `AIza…` key from https://aistudio.google.com.
 * Optional GEMINI_MODEL (defaults to a current Gemini Flash model).
 *
 * NOTE: This is an API-key integration (Gemini generative API only).
 * Drive / Calendar / Gmail need a full OAuth2 client and are not wired here.
 */

const GLM_API_BASE = 'https://generativelanguage.googleapis.com/v1beta'

function apiKey(): string {
  const key = process.env.GEMINI_API_KEY
  if (!key) throw new Error('Missing GEMINI_API_KEY in .env.local (get an AIza… key from aistudio.google.com)')
  return key
}

function model(): string {
  return process.env.GEMINI_MODEL ?? 'gemini-2.5-flash'
}

/** Generate text from a prompt using Gemini. */
export async function generateText(opts: { prompt: string; system?: string }): Promise<string> {
  const body: Record<string, unknown> = {
    contents: [{ role: 'user', parts: [{ text: opts.prompt }] }],
  }
  if (opts.system) {
    body.systemInstruction = { parts: [{ text: opts.system }] }
  }

  const res = await fetch(`${GLM_API_BASE}/models/${model()}:generateContent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey(),
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Gemini API ${res.status}: ${text.slice(0, 200)}`)
  }
  const data = await res.json()
  const parts = data?.candidates?.[0]?.content?.parts ?? []
  return parts.map((p: { text?: string }) => p.text ?? '').join('').trim()
}

/** Convenience: draft marketing copy for a campaign brief. */
export async function draftCampaignCopy(brief: string): Promise<string> {
  return generateText({
    system:
      'You are Hermes, the content agent for the StudEx meat store. Write punchy, on-brand marketing copy. Keep it concise and conversion-focused.',
    prompt: brief,
  })
}
