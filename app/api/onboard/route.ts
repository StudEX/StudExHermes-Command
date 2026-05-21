import { NextRequest, NextResponse } from 'next/server'
import { listLeads, saveLead, validateLead, type LeadInput } from '@/lib/leads'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const error = validateLead(body)
  if (error) return NextResponse.json({ error }, { status: 400 })

  const lead = await saveLead(body as LeadInput)
  return NextResponse.json({ ok: true, lead })
}

export async function GET(req: NextRequest) {
  const adminKey = process.env.ADMIN_API_KEY
  if (adminKey) {
    if (req.headers.get('x-admin-key') !== adminKey) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }
  }
  const leads = await listLeads()
  return NextResponse.json({ count: leads.length, leads })
}
