import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const apiKey = process.env.STT_API_KEY || process.env.OPENAI_API_KEY
  const baseUrl = process.env.STT_BASE_URL || 'https://api.openai.com/v1'
  const model = process.env.STT_MODEL || 'whisper-1'
  if (!apiKey) {
    return NextResponse.json(
      { error: 'stt disabled', reason: 'STT_API_KEY not set' },
      { status: 503 },
    )
  }

  const incoming = await req.formData().catch(() => null)
  const audio = incoming?.get('audio')
  if (!(audio instanceof Blob)) {
    return NextResponse.json({ error: 'missing audio blob (form field: audio)' }, { status: 400 })
  }

  const upstream = new FormData()
  upstream.append('file', audio, 'turn.webm')
  upstream.append('model', model)
  upstream.append('response_format', 'json')

  const res = await fetch(`${baseUrl}/audio/transcriptions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}` },
    body: upstream,
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    return NextResponse.json({ error: 'stt failed', detail }, { status: 502 })
  }
  const data = await res.json()
  return NextResponse.json({ text: data?.text ?? '' })
}
