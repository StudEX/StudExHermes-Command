/**
 * Walks the local Obsidian vault, chunks markdown by heading, embeds each chunk,
 * and upserts to Pinecone under namespace PINECONE_NAMESPACE (default: studex-vault).
 *
 * Usage:
 *   bun run scripts/ingest_vault.ts            # reads ./vault
 *   bun run scripts/ingest_vault.ts /path/to/obsidian/vault
 *
 * Required env: PINECONE_API_KEY, PINECONE_INDEX_HOST, EMBEDDING_API_KEY (or OPENAI_API_KEY).
 */
import { readdir, readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'
import { embed } from '../lib/embeddings'
import { pineconeUpsert } from '../lib/pinecone'

const MAX_CHARS = 1800
const BATCH = 50

async function walk(dir: string): Promise<string[]> {
  const out: string[] = []
  for (const entry of await readdir(dir)) {
    if (entry.startsWith('.')) continue
    const full = path.join(dir, entry)
    const s = await stat(full)
    if (s.isDirectory()) out.push(...(await walk(full)))
    else if (entry.endsWith('.md')) out.push(full)
  }
  return out
}

function chunkByHeading(md: string): { heading: string; text: string }[] {
  const sections: { heading: string; text: string }[] = []
  const lines = md.split('\n')
  let currentHeading = 'intro'
  let buffer: string[] = []
  const flush = () => {
    const text = buffer.join('\n').trim()
    if (text.length > 0) sections.push({ heading: currentHeading, text })
    buffer = []
  }
  for (const line of lines) {
    const m = line.match(/^#{1,6}\s+(.+)/)
    if (m) {
      flush()
      currentHeading = m[1].trim()
    } else {
      buffer.push(line)
    }
  }
  flush()
  const out: { heading: string; text: string }[] = []
  for (const s of sections) {
    if (s.text.length <= MAX_CHARS) {
      out.push(s)
    } else {
      for (let i = 0; i < s.text.length; i += MAX_CHARS) {
        out.push({ heading: s.heading, text: s.text.slice(i, i + MAX_CHARS) })
      }
    }
  }
  return out
}

function idFor(source: string, heading: string, idx: number): string {
  const hash = crypto.createHash('sha1').update(`${source}|${heading}|${idx}`).digest('hex')
  return hash.slice(0, 24)
}

async function main() {
  const vaultDir = process.argv[2] || path.join(process.cwd(), 'vault')
  console.log(`[ingest] reading vault: ${vaultDir}`)
  const files = await walk(vaultDir).catch(() => [] as string[])
  if (files.length === 0) {
    console.error(`[ingest] no .md files found in ${vaultDir}`)
    process.exit(1)
  }
  console.log(`[ingest] found ${files.length} markdown files`)

  const records: { id: string; vector: number[]; metadata: Record<string, unknown> }[] = []
  for (const file of files) {
    const rel = path.relative(vaultDir, file)
    const md = await readFile(file, 'utf8')
    const chunks = chunkByHeading(md)
    for (let i = 0; i < chunks.length; i++) {
      const c = chunks[i]
      const vector = await embed(`${c.heading}\n\n${c.text}`)
      if (!vector) {
        console.warn(`[ingest] embedding failed for ${rel} :: ${c.heading}`)
        continue
      }
      records.push({
        id: idFor(rel, c.heading, i),
        vector,
        metadata: { source: rel, heading: c.heading, text: c.text },
      })
      if (records.length >= BATCH) {
        const ok = await pineconeUpsert(records.splice(0, records.length))
        console.log(`[ingest] upserted batch (ok=${ok})`)
      }
    }
  }
  if (records.length > 0) {
    const ok = await pineconeUpsert(records)
    console.log(`[ingest] upserted final batch (ok=${ok})`)
  }
  console.log('[ingest] done')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
