import { NextRequest, NextResponse } from 'next/server'
import { salesReply, type ChatMessage, type Channel } from '@/lib/sales-brain'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const messages: ChatMessage[] = Array.isArray(body?.messages) ? body.messages : []
  const channel: Channel =
    body?.channel === 'voice' ? 'voice' : body?.channel === 'whatsapp' ? 'whatsapp' : 'web'
  const lastUser = [...messages].reverse().find(m => m.role === 'user')
  if (!lastUser || !lastUser.content?.trim()) {
    return NextResponse.json({ error: 'empty message' }, { status: 400 })
  }

  const reply = await salesReply(messages, channel)

  return NextResponse.json({
    role: 'assistant',
    content: reply.content,
    source: reply.source,
    contextChunks: reply.contextChunks,
    citations: reply.citations,
  })
}
