import type { ChatMessage } from './sales-brain'
import { redisCommand, usingRedis } from './redis'

export type Conversation = { messages: ChatMessage[]; lastTouched: number }

const CONVO_TTL_SECONDS = 60 * 60 * 6
const MAX_TURNS = 20

// In-memory fallback (per-instance, lost on restart). Used when REDIS_REST_URL is unset.
const MEMORY = new Map<string, Conversation>()

function key(phone: string): string {
  return `ada:convo:${phone}`
}

export async function loadConversation(phone: string): Promise<ChatMessage[]> {
  if (usingRedis()) {
    const raw = await redisCommand(['GET', key(phone)])
    if (typeof raw === 'string') {
      try {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) return parsed as ChatMessage[]
      } catch {
        // fall through to empty
      }
    }
    return []
  }

  const now = Date.now()
  const existing = MEMORY.get(phone)
  if (existing && now - existing.lastTouched < CONVO_TTL_SECONDS * 1000) {
    return existing.messages
  }
  return []
}

export async function saveTurn(phone: string, user: string, assistant: string): Promise<void> {
  const messages = await loadConversation(phone)
  messages.push({ role: 'user', content: user })
  messages.push({ role: 'assistant', content: assistant })
  if (messages.length > MAX_TURNS * 2) {
    messages.splice(0, messages.length - MAX_TURNS * 2)
  }

  if (usingRedis()) {
    await redisCommand(['SET', key(phone), JSON.stringify(messages), 'EX', CONVO_TTL_SECONDS])
    return
  }

  MEMORY.set(phone, { messages, lastTouched: Date.now() })
}
