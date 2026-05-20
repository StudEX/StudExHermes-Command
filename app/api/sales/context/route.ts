import { NextRequest, NextResponse } from 'next/server'
import { pineconeQuery } from '@/lib/pinecone'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const { query, topK } = await req.json().catch(() => ({ query: '', topK: 5 }))
  if (!query || typeof query !== 'string') {
    return NextResponse.json({ error: 'missing query' }, { status: 400 })
  }
  const chunks = await pineconeQuery(query, Math.min(Math.max(Number(topK) || 5, 1), 20))
  return NextResponse.json({ chunks, count: chunks.length })
}
