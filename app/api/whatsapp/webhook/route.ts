import { NextRequest, NextResponse } from 'next/server'
import { salesReply, type ChatMessage } from '@/lib/sales-brain'
import { loadConversation, saveTurn } from '@/lib/session-store'
import {
  downloadTwilioMedia,
  sendWhatsAppText,
  twilioAuth,
  verifyTwilioSignature,
} from '@/lib/twilio'

export const runtime = 'nodejs'

async function transcribeAudio(blob: Blob): Promise<string> {
  const apiKey = process.env.STT_API_KEY || process.env.OPENAI_API_KEY
  const baseUrl = process.env.STT_BASE_URL || 'https://api.openai.com/v1'
  const model = process.env.STT_MODEL || 'whisper-1'
  if (!apiKey) return ''

  const form = new FormData()
  form.append('file', blob, 'voice-note.ogg')
  form.append('model', model)
  form.append('response_format', 'json')

  const res = await fetch(`${baseUrl}/audio/transcriptions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form,
  })
  if (!res.ok) return ''
  const data = await res.json().catch(() => ({}))
  return (data?.text ?? '').toString().trim()
}

export async function GET(req: NextRequest) {
  return NextResponse.json({
    ok: true,
    channel: 'whatsapp',
    configured: Boolean(twilioAuth() && process.env.TWILIO_WHATSAPP_NUMBER && process.env.TWILIO_ACCOUNT_SID),
  })
}

export async function POST(req: NextRequest) {
  const raw = await req.text()
  const params = Object.fromEntries(new URLSearchParams(raw))
  const from = params.From || ''
  const body = (params.Body || '').trim()
  const numMedia = parseInt(params.NumMedia || '0', 10)

  if (process.env.TWILIO_AUTH_TOKEN) {
    const signature = req.headers.get('x-twilio-signature')
    const fullUrl = req.headers.get('x-forwarded-proto') && req.headers.get('host')
      ? `${req.headers.get('x-forwarded-proto')}://${req.headers.get('host')}${req.nextUrl.pathname}`
      : req.url
    if (!verifyTwilioSignature(signature, fullUrl, params)) {
      return new NextResponse('forbidden', { status: 403 })
    }
  }

  if (!from) return new NextResponse('bad request', { status: 400 })

  let userText = body

  if (numMedia > 0) {
    const mediaUrl = params.MediaUrl0
    const contentType = params.MediaContentType0 || ''
    if (mediaUrl && contentType.startsWith('audio/')) {
      const blob = await downloadTwilioMedia(mediaUrl)
      if (blob) {
        const transcript = await transcribeAudio(blob)
        if (transcript) userText = userText ? `${userText}\n\n[voice note] ${transcript}` : transcript
      }
    }
  }

  if (!userText) {
    await sendWhatsAppText(from, "Hi, this is ADA from StudEx. I didn't catch that — could you send it again as text or a voice note?")
    return new NextResponse('<Response/>', {
      status: 200,
      headers: { 'Content-Type': 'text/xml' },
    })
  }

  const capturedText = userText

  setImmediate(async () => {
    try {
      const convo = await loadConversation(from)
      const turnMessages: ChatMessage[] = [...convo, { role: 'user', content: capturedText }]
      const reply = await salesReply(turnMessages, 'whatsapp')
      await saveTurn(from, capturedText, reply.content)
      await sendWhatsAppText(from, reply.content)
    } catch {
      await sendWhatsAppText(from, 'My line dropped for a second — could you repeat that?')
    }
  })

  return new NextResponse('<Response/>', {
    status: 200,
    headers: { 'Content-Type': 'text/xml' },
  })
}
