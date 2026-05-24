import { NextResponse } from 'next/server'
import type { FleetStatus } from '@/lib/fleet'

export const runtime = 'nodejs'

// Reports which integrations are configured. Returns booleans only — never the
// secret values themselves — so it is safe to expose to the dashboard.
export async function GET() {
  const twilioAuth = Boolean(
    process.env.TWILIO_AUTH_TOKEN ||
      (process.env.TWILIO_API_KEY_SID && process.env.TWILIO_API_KEY_SECRET),
  )

  const capabilities: FleetStatus = {
    llm: Boolean(process.env.CLOUD_MODEL_API_KEY || process.env.LOCAL_MODEL_BASE_URL),
    pinecone: Boolean(process.env.PINECONE_API_KEY && process.env.PINECONE_INDEX_HOST),
    twilio: Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_WHATSAPP_NUMBER && twilioAuth),
    elevenlabs: Boolean(process.env.ELEVENLABS_API_KEY && process.env.ELEVENLABS_VOICE_ID),
    redis: Boolean(process.env.REDIS_REST_URL && process.env.REDIS_REST_TOKEN),
    stt: Boolean(process.env.STT_API_KEY || process.env.OPENAI_API_KEY),
  }

  return NextResponse.json({ capabilities, checkedAt: new Date().toISOString() })
}
