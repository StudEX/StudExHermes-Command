import { NextRequest, NextResponse } from 'next/server'
import { salesReply, type ChatMessage } from '@/lib/sales-brain'
import {
  downloadTwilioMedia,
  sendWhatsAppText,
  twilioAuth,
  verifyTwilioSignature,
} from '@/lib/twilio'

export const runtime = 'nodejs'

type Conversation = { messages: ChatMessage[]; lastTouched: number }

const CONVERSATIONS = new Map<string, Conversation>()
const CONVO_TTL_MS = 1000 * 60 * 60 * 6
const MAX_TURNS = 20

function getConversation(phone: string): ChatMessage[] {
  const now = Date.now()
  const existing = CONVERSATIONS.get(phone)
  if (existing && now - existing.lastTouched < CONVO_TTL_MS) {
    existing.lastTouched = now
    return existing.messages
  }
  const fresh: Conversation = { messages: [], lastTouched: now }
  CONVERSATIONS.set(phone, fresh)
  return fresh.messages
}

function pushTurn(phone: string, user: string, assistant: string) {
  const convo = getConversation(phone)
  convo.push({ role: 'user', content: user })
  convo.push({ role: 'assistant', content: assistant })
  if (convo.length > MAX_TURNS * 2) {
    convo.splice(0, convo.length - MAX_TURNS * 2)
  }
}

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

  const convo = getConversation(from)
  const turnMessages: ChatMessage[] = [...convo, { role: 'user', content: userText }]

  setImmediate(async () => {
    try {
      const reply = await salesReply(turnMessages, 'whatsapp')
      pushTurn(from, userText, reply.content)
      await sendWhatsAppText(from, reply.content)
    } catch (err) {
      await sendWhatsAppText(from, 'My line dropped for a second — could you repeat that?')
    }
  })

  return new NextResponse('<Response/>', {
    status: 200,
    headers: { 'Content-Type': 'text/xml' },
  })
}
