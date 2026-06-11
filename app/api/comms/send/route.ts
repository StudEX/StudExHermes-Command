import { NextRequest, NextResponse } from 'next/server'
import { sendAgentMessage, type SwarmAgent } from '@/lib/comms/reload'

const AGENTS: SwarmAgent[] = ['hermes', 'openclaw', 'codex', 'sentinel']

export async function POST(req: NextRequest) {
  const { agent, channelId, content, threadId } = await req.json()
  if (!AGENTS.includes(agent)) {
    return NextResponse.json({ ok: false, error: `agent must be one of: ${AGENTS.join(', ')}` }, { status: 400 })
  }
  if (!channelId || !content) {
    return NextResponse.json({ ok: false, error: 'channelId and content are required' }, { status: 400 })
  }
  try {
    const result = await sendAgentMessage({ agent, channelId, content, threadId })
    return NextResponse.json({ ok: true, result })
  } catch (err) {
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : 'send failed' }, { status: 502 })
  }
}
