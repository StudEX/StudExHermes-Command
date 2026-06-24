import { NextRequest, NextResponse } from 'next/server'
import { queryBrain } from '@/lib/brain'

export const runtime = 'nodejs'

// Unified Second Brain query — fans out across configured backends (Pinecone,
// GBrain) via lib/brain.ts, applies Guard, returns synthesis + citations.
// Optional BRAIN_API_KEY gates external agents via X-Brain-Key (or ?key=).

function authorized(req: NextRequest, keyFromBody?: string): boolean {
  const expected = process.env.BRAIN_API_KEY
  if (!expected) return true
  const provided =
    req.headers.get('x-brain-key') ||
    req.nextUrl.searchParams.get('key') ||
    keyFromBody
  return provided === expected
}

function clampTopK(value: unknown): number {
  return Math.min(Math.max(Number(value) || 6, 1), 20)
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const q = req.nextUrl.searchParams.get('q')?.trim()
  if (!q) return NextResponse.json({ error: 'q required' }, { status: 400 })
  const topK = clampTopK(req.nextUrl.searchParams.get('topK'))
  const result = await queryBrain({ q, topK })
  return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
  let body: { q?: string; query?: string; topK?: number; namespace?: string; graph?: boolean; key?: string } = {}
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 })
  }
  if (!authorized(req, body.key)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const q = ((body.q ?? body.query) ?? '').toString().trim()
  if (!q) return NextResponse.json({ error: 'q required' }, { status: 400 })

  const result = await queryBrain({
    q,
    topK: clampTopK(body.topK),
    namespace: body.namespace,
    graph: body.graph,
  })
  return NextResponse.json(result)
}
