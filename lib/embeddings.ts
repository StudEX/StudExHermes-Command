export type EmbeddingVector = number[]

export async function embed(text: string): Promise<EmbeddingVector | null> {
  const apiKey = process.env.EMBEDDING_API_KEY || process.env.OPENAI_API_KEY
  const baseUrl = process.env.EMBEDDING_BASE_URL || 'https://api.openai.com/v1'
  const model = process.env.EMBEDDING_MODEL || 'text-embedding-3-small'
  if (!apiKey) return null

  const res = await fetch(`${baseUrl}/embeddings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model, input: text }),
  })
  if (!res.ok) return null
  const data = await res.json()
  const vec = data?.data?.[0]?.embedding
  return Array.isArray(vec) ? vec : null
}
