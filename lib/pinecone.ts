import { embed, type EmbeddingVector } from './embeddings'

export type RetrievedChunk = {
  id: string
  score: number
  text: string
  source?: string
}

function pineconeHost(): string | null {
  return process.env.PINECONE_INDEX_HOST || null
}

export async function pineconeQuery(text: string, topK = 5): Promise<RetrievedChunk[]> {
  const apiKey = process.env.PINECONE_API_KEY
  const host = pineconeHost()
  const namespace = process.env.PINECONE_NAMESPACE || 'studex-vault'
  if (!apiKey || !host) return []

  const vector = await embed(text)
  if (!vector) return []

  const res = await fetch(`${host}/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Api-Key': apiKey },
    body: JSON.stringify({ vector, topK, namespace, includeMetadata: true }),
  })
  if (!res.ok) return []
  const data = await res.json()
  const matches = Array.isArray(data?.matches) ? data.matches : []
  return matches.map((m: any) => ({
    id: m.id,
    score: m.score ?? 0,
    text: m.metadata?.text ?? '',
    source: m.metadata?.source,
  }))
}

export async function pineconeUpsert(
  records: { id: string; vector: EmbeddingVector; metadata: Record<string, unknown> }[],
): Promise<boolean> {
  const apiKey = process.env.PINECONE_API_KEY
  const host = pineconeHost()
  const namespace = process.env.PINECONE_NAMESPACE || 'studex-vault'
  if (!apiKey || !host) return false

  const res = await fetch(`${host}/vectors/upsert`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Api-Key': apiKey },
    body: JSON.stringify({
      namespace,
      vectors: records.map(r => ({ id: r.id, values: r.vector, metadata: r.metadata })),
    }),
  })
  return res.ok
}
