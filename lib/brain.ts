// Unified brain query — fan out to Pinecone (current) and GBrain (when configured),
// merge, dedupe by id, sort by score, return cited synthesis.
//
// Both backends are optional. If neither is configured, returns an empty
// answer with backend = 'none' so the dashboard can show "configure a brain".

import { guard } from './guard'
import { pineconeQuery } from './pinecone'

export type Citation = {
  id: string
  title: string
  score: number
  snippet: string
  source: 'pinecone' | 'gbrain' | 'vault'
}

export type BrainAnswer = {
  answer: string
  citations: Citation[]
  gaps: string[]
  backend: 'pinecone' | 'gbrain' | 'hybrid' | 'none'
}

export type BrainQuery = {
  q: string
  topK?: number
  namespace?: string
  graph?: boolean
}

function pineconeConfigured(): boolean {
  return Boolean(process.env.PINECONE_API_KEY && process.env.PINECONE_INDEX_HOST)
}

function gbrainConfigured(): boolean {
  return Boolean(process.env.GBRAIN_BASE_URL)
}

async function queryPinecone(q: BrainQuery): Promise<Citation[]> {
  if (!pineconeConfigured()) return []
  const chunks = await pineconeQuery(q.q, q.topK ?? 6).catch(() => [])
  return chunks.map(c => ({
    id: c.id,
    title: c.source ?? c.id,
    score: c.score,
    snippet: c.text.slice(0, 240),
    source: 'pinecone' as const,
  }))
}

async function queryGbrain(q: BrainQuery): Promise<{ citations: Citation[]; answer?: string }> {
  if (!gbrainConfigured()) return { citations: [] }
  const base = process.env.GBRAIN_BASE_URL!.replace(/\/$/, '')
  const key = process.env.GBRAIN_API_KEY
  try {
    const res = await fetch(`${base}/query`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(key ? { 'x-api-key': key } : {}),
      },
      body: JSON.stringify({ q: q.q, topK: q.topK ?? 6, graph: q.graph ?? true }),
      // gbrain runs locally — short timeout so a hung node never blocks UX
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return { citations: [] }
    const data = await res.json()
    const citations: Citation[] = (data.citations ?? []).map((c: { id: string; title?: string; score?: number; snippet?: string }) => ({
      id: c.id,
      title: c.title ?? c.id,
      score: c.score ?? 0,
      snippet: c.snippet ?? '',
      source: 'gbrain' as const,
    }))
    return { citations, answer: data.answer }
  } catch {
    return { citations: [] }
  }
}

function dedupe(citations: Citation[]): Citation[] {
  const seen = new Map<string, Citation>()
  for (const c of citations) {
    const prev = seen.get(c.id)
    if (!prev || c.score > prev.score) seen.set(c.id, c)
  }
  return [...seen.values()].sort((a, b) => b.score - a.score)
}

function synthesize(q: string, citations: Citation[], gbrainAnswer?: string): string {
  if (gbrainAnswer) return gbrainAnswer
  if (citations.length === 0) {
    return `No matches in the StudEx brain for "${q}". Capture a note first or widen the query.`
  }
  const top = citations.slice(0, 3)
  return top.map(c => `${c.title}: ${c.snippet}`.trim()).join('\n\n')
}

function detectGaps(citations: Citation[]): string[] {
  const gaps: string[] = []
  if (citations.length === 0) gaps.push('no matches — brain may be empty for this topic')
  if (citations.length > 0 && citations[0].score < 0.5) {
    gaps.push(`top match scored ${citations[0].score.toFixed(2)} — low confidence, verify before quoting`)
  }
  return gaps
}

export async function queryBrain(q: BrainQuery): Promise<BrainAnswer> {
  const result = await guard.run({
    agent: 'brain',
    tool: 'brain.query',
    estCostUsd: 0.0005,
    fn: async () => {
      const [pine, gb] = await Promise.all([queryPinecone(q), queryGbrain(q)])
      const merged = dedupe([...pine, ...gb.citations])
      const usedPinecone = pine.length > 0
      const usedGbrain = gb.citations.length > 0 || Boolean(gb.answer)
      const backend: BrainAnswer['backend'] =
        usedPinecone && usedGbrain ? 'hybrid' : usedGbrain ? 'gbrain' : usedPinecone ? 'pinecone' : 'none'
      return {
        answer: synthesize(q.q, merged, gb.answer),
        citations: merged.slice(0, q.topK ?? 6),
        gaps: detectGaps(merged),
        backend,
      }
    },
  })
  if (!result.ok) {
    return {
      answer: `Brain query refused by guard: ${result.reason}.`,
      citations: [],
      gaps: [result.reason],
      backend: 'none',
    }
  }
  return result.value
}
