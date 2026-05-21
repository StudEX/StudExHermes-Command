import { NextResponse } from 'next/server'
import { PRODUCT_CATALOG } from '@/lib/sales-brain'

export const runtime = 'nodejs'

// Read-only catalog feed. Designed as a Tool/webhook source for the ElevenLabs
// "Charlie" agent and the web/WhatsApp ADA channels, so every channel quotes
// the same products. Swap PRODUCT_CATALOG for a live Shopify pull when the
// SHOPIFY_ADMIN_TOKEN is wired up.
export async function GET() {
  return NextResponse.json(
    {
      currency: 'ZAR',
      updatedAt: new Date().toISOString(),
      categories: {
        meat: PRODUCT_CATALOG,
      },
    },
    { headers: { 'Cache-Control': 'public, max-age=60' } },
  )
}
