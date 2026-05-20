import { NextRequest, NextResponse } from 'next/server'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

export const runtime = 'nodejs'

const SAMPLE_DIR = path.join(process.cwd(), 'voice_samples')
const AUDIO_EXT = new Set(['.mp3', '.wav', '.m4a', '.flac', '.ogg', '.webm'])

export async function POST(req: NextRequest) {
  const apiKey = process.env.ELEVENLABS_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'ELEVENLABS_API_KEY not set' }, { status: 503 })
  }

  const body = await req.json().catch(() => ({}))
  const name: string = body?.name || 'ADA Concierge'
  const description: string =
    body?.description || 'StudEx Meat Sales Concierge — warm, premium, high-tech.'

  let entries: string[]
  try {
    entries = await readdir(SAMPLE_DIR)
  } catch {
    return NextResponse.json(
      { error: 'voice_samples/ not found. Drop 1-25 audio clips (30s-3min each) and retry.' },
      { status: 400 },
    )
  }

  const samples = entries.filter(f => AUDIO_EXT.has(path.extname(f).toLowerCase()))
  if (samples.length === 0) {
    return NextResponse.json(
      { error: 'no audio files in voice_samples/. Accepted: mp3, wav, m4a, flac, ogg, webm.' },
      { status: 400 },
    )
  }

  const form = new FormData()
  form.append('name', name)
  form.append('description', description)
  form.append('labels', JSON.stringify({ project: 'studex', agent: 'ada-sales' }))

  for (const file of samples) {
    const buf = await readFile(path.join(SAMPLE_DIR, file))
    form.append('files', new Blob([new Uint8Array(buf)]), file)
  }

  const res = await fetch('https://api.elevenlabs.io/v1/voices/add', {
    method: 'POST',
    headers: { 'xi-api-key': apiKey },
    body: form,
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    return NextResponse.json({ error: 'elevenlabs clone failed', detail }, { status: 502 })
  }
  const data = await res.json()
  return NextResponse.json({
    voice_id: data?.voice_id,
    next_step: 'Set ELEVENLABS_VOICE_ID in .env to this voice_id and restart the dev server.',
    samples_used: samples,
  })
}
