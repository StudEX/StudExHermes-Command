import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const { text } = await req.json().catch(() => ({ text: '' }))
  if (!text || typeof text !== 'string') {
    return NextResponse.json({ error: 'missing text' }, { status: 400 })
  }

  const apiKey = process.env.ELEVENLABS_API_KEY
  const voiceId = process.env.ELEVENLABS_VOICE_ID
  if (!apiKey || !voiceId) {
    return NextResponse.json(
      { error: 'tts disabled', reason: 'ELEVENLABS_API_KEY or ELEVENLABS_VOICE_ID not set' },
      { status: 503 },
    )
  }

  const model = process.env.ELEVENLABS_MODEL || 'eleven_turbo_v2_5'
  const ttsRes = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream?optimize_streaming_latency=3`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg',
      },
      body: JSON.stringify({
        text,
        model_id: model,
        voice_settings: { stability: 0.5, similarity_boost: 0.85, style: 0.35, use_speaker_boost: true },
      }),
    },
  )

  if (!ttsRes.ok || !ttsRes.body) {
    const detail = await ttsRes.text().catch(() => '')
    return NextResponse.json({ error: 'elevenlabs failed', detail }, { status: 502 })
  }

  return new NextResponse(ttsRes.body, {
    status: 200,
    headers: {
      'Content-Type': 'audio/mpeg',
      'Cache-Control': 'no-store',
    },
  })
}
