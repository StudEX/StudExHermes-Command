import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'
import { embed } from '@/lib/embeddings'
import { pineconeUpsert } from '@/lib/pinecone'

export const runtime = 'nodejs'

const MAX_CHARS = 1800

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

function chunkText(text: string): string[] {
  const out: string[] = []
  for (let i = 0; i < text.length; i += MAX_CHARS) out.push(text.slice(i, i + MAX_CHARS))
  return out
}

function idFor(source: string, idx: number): string {
  return crypto.createHash('sha1').update(`${source}|${idx}`).digest('hex').slice(0, 24)
}

// Receiver for meeting/call transcripts. Point a meeting-bot service
// (Recall.ai, Fireflies, Otter export, etc.) at this endpoint. It persists
// the transcript to the Obsidian vault and embeds it into Pinecone so ADA
// and Charlie can recall what was discussed.
export async function POST(req: NextRequest) {
  const ingestSecret = process.env.MEMORY_INGEST_SECRET
  if (ingestSecret) {
    const provided = req.headers.get('x-ingest-secret')
    if (provided !== ingestSecret) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }
  }

  const body = await req.json().catch(() => ({}))
  const title: string = (body?.title || '').toString().trim() || 'Untitled meeting'
  const transcript: string = (body?.transcript || body?.text || '').toString().trim()
  const source: string = (body?.source || 'meeting').toString().trim()
  const date: string = (body?.date || new Date().toISOString().slice(0, 10)).toString()
  const participants: string[] = Array.isArray(body?.participants) ? body.participants : []

  if (!transcript) {
    return NextResponse.json({ error: 'missing transcript' }, { status: 400 })
  }

  const slug = `${date}-${slugify(title)}`
  const relPath = path.join('meetings', `${slug}.md`)

  const frontmatter = [
    '---',
    `title: ${JSON.stringify(title)}`,
    `date: ${date}`,
    `source: ${source}`,
    `participants: ${JSON.stringify(participants)}`,
    '---',
    '',
  ].join('\n')
  const markdown = `${frontmatter}# ${title}\n\n${transcript}\n`

  let vaultWritten = false
  try {
    const dir = path.join(process.cwd(), 'vault', 'meetings')
    await mkdir(dir, { recursive: true })
    await writeFile(path.join(dir, `${slug}.md`), markdown, 'utf8')
    vaultWritten = true
  } catch {
    // Vault write is best-effort (read-only FS in some deploys); Pinecone is the durable store.
  }

  const chunks = chunkText(transcript)
  const records: { id: string; vector: number[]; metadata: Record<string, unknown> }[] = []
  for (let i = 0; i < chunks.length; i++) {
    const vector = await embed(`${title}\n\n${chunks[i]}`)
    if (!vector) continue
    records.push({
      id: idFor(relPath, i),
      vector,
      metadata: { source: relPath, heading: title, text: chunks[i], date, kind: 'meeting' },
    })
  }

  let upserted = false
  if (records.length > 0) {
    upserted = await pineconeUpsert(records)
  }

  return NextResponse.json({
    ok: true,
    title,
    date,
    vaultWritten,
    chunks: chunks.length,
    embedded: records.length,
    upserted,
  })
}
