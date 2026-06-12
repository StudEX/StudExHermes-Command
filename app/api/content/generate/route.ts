import { NextRequest, NextResponse } from 'next/server'
import { draftCampaignCopy } from '@/lib/content/gemini'
import { searchStock, generateImage } from '@/lib/content/freepik'

/**
 * Content pipeline endpoint: Hermes drafts campaign copy (Gemini) and
 * sources/generates matching imagery (Freepik) in one call.
 *
 * POST { brief, imageMode?: 'stock' | 'generate', imageTerm? }
 */
export async function POST(req: NextRequest) {
  const { brief, imageMode = 'generate', imageTerm } = await req.json()
  if (!brief) {
    return NextResponse.json({ ok: false, error: 'brief is required' }, { status: 400 })
  }
  try {
    const copyPromise = draftCampaignCopy(brief)
    const term = imageTerm ?? brief
    const imagePromise =
      imageMode === 'stock' ? searchStock({ term, limit: 6 }) : generateImage({ prompt: term })

    const [copy, imagery] = await Promise.all([copyPromise, imagePromise])
    return NextResponse.json({ ok: true, copy, imagery })
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'content generation failed' },
      { status: 502 }
    )
  }
}
