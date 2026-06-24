import { NextResponse } from 'next/server'
import { guard } from '@/lib/guard'

export const runtime = 'nodejs'

export async function GET() {
  return NextResponse.json({ limits: guard.limits(), at: new Date().toISOString() })
}

export async function POST(req: Request) {
  // Manual panic-stop. Body: { action: 'panic' | 'reset' }.
  // Reset is no-op in prod unless GUARD_ALLOW_RESET=1.
  let body: { action?: string } = {}
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 })
  }
  if (body.action === 'panic') {
    guard.panicStop()
    return NextResponse.json({ ok: true, limits: guard.limits() })
  }
  if (body.action === 'reset') {
    if (process.env.GUARD_ALLOW_RESET !== '1') {
      return NextResponse.json({ error: 'reset disabled — set GUARD_ALLOW_RESET=1' }, { status: 403 })
    }
    guard.reset()
    return NextResponse.json({ ok: true, limits: guard.limits() })
  }
  return NextResponse.json({ error: 'unknown action' }, { status: 400 })
}
