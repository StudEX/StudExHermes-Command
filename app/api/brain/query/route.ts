import { NextRequest, NextResponse } from 'next/server'
import { pineconeQuery } from '@/lib/pinecone'

export const runtime = 'nodejs'

// Shared "second brain" retrieval for the swarm. Any agent (OpenJarvis, QwenPaw,
// Charlie's Tools, ADA) queries the StudEx knowledge base — the Obsidian vault and
// ingested meeting transcripts in the shared Pinecone namespace. Optional BRAIN_API_KEY
// gates external agents via the X-Brain-Key header (or ?key=).
function authorized(req: NextRequest, keyFromBody?: string): boolean {
  const expected = process.env.BRAIN_API_KEY
  if (!expected) return true
  const provided = req.headers.get('x-brain-key') || req.nextUrl.searchParams.get('key') || keyFromBody
  return provided === expected
}

function clampTopK(value: unknown): number {
  return Math.min(Math.max(Number(value) || 5, 1), 20)
}

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('q')?.trim()
  if (!authorized(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  if (!query) return NextResponse.json({ error: 'missing q' }, { status: 400 })

  const topK = clampTopK(req.nextUrl.searchParams.get('topK'))
  const chunks = await pineconeQuery(query, topK).catch(() => [])
  return NextResponse.json({ query, count: chunks.length, chunks })
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  if (!authorized(req, body?.key)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const query = (body?.query || body?.q || '').toString().trim()
  if (!query) return NextResponse.json({ error: 'missing query' }, { status: 400 })

  const chunks = await pineconeQuery(query, clampTopK(body?.topK)).catch(() => [])
  return NextResponse.json({ query, count: chunks.length, chunks })
}
