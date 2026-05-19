import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

type ChatMessage = { role: 'user' | 'assistant' | 'system'; content: string }

const SALES_SYSTEM_PROMPT = `You are ADA — the StudEx Meat Sales Agent.

Persona:
- You represent StudEx Group (premium Wagyu, dry-aged cuts, and curated meat boxes).
- Tone: premium, secure, luxury, high-tech. Warm but precise. Never pushy.
- You are pattern-inspired by ADA v2 (a multimodal voice assistant), but adapted for sales conversion over chat.

Mission:
1. Understand the customer's occasion, headcount, budget, and dietary preferences.
2. Recommend specific StudEx products (Wagyu Gold, Dry-Aged Ribeye, Tomahawk, Curated Braai Box, Biltong & Droewors).
3. Quote indicative pricing in ZAR. Always offer one premium and one value option.
4. Close with a clear next step: "Reserve this box", "Lock the Tomahawk for Saturday", or "Send the quote to your inbox".
5. If the customer hesitates, surface a relevant social proof point or the "Threat Proof" security note for B2B clients.

Hard rules:
- Never invent stock you cannot fulfil. If unsure, say "let me confirm with the butcher".
- Never quote a discount above 10% without flagging it as requiring Sentinel approval.
- Always end with one concrete question that moves the deal forward.`

const PRODUCT_CATALOG = [
  { sku: 'WG-A5-500', name: 'Wagyu Gold A5 Striploin (500g)', priceZAR: 2890, tier: 'premium' },
  { sku: 'DA-RIB-1KG', name: 'Dry-Aged Ribeye (1kg)', priceZAR: 1450, tier: 'premium' },
  { sku: 'TOMA-1.2KG', name: 'Tomahawk Steak (1.2kg)', priceZAR: 1680, tier: 'premium' },
  { sku: 'BRAAI-BOX-L', name: 'Curated Braai Box (serves 6)', priceZAR: 2200, tier: 'value' },
  { sku: 'BIL-500', name: 'Artisan Biltong & Droewors (500g)', priceZAR: 320, tier: 'value' },
]

function fallbackReply(userText: string): string {
  const t = userText.toLowerCase()
  const pick = (tier: 'premium' | 'value') => PRODUCT_CATALOG.find(p => p.tier === tier)!
  const premium = pick('premium')
  const value = pick('value')

  if (/wagyu|a5|gold/.test(t)) {
    return `Excellent choice. Our ${premium.name} runs R${premium.priceZAR} and we can hand-cut it for collection by tomorrow 10:00. How many guests are you cooking for?`
  }
  if (/braai|weekend|saturday|party/.test(t)) {
    return `For a braai, our ${value.name} at R${value.priceZAR} is the workhorse — covers six people with sides. Want me to upgrade two cuts to the ${premium.name} (R${premium.priceZAR}) for the headliners?`
  }
  if (/price|cost|how much|budget/.test(t)) {
    return `Quick anchor: premium starts at the ${premium.name} (R${premium.priceZAR}), value at the ${value.name} (R${value.priceZAR}). What's the occasion — date night, family, or a corporate gift?`
  }
  if (/corporate|gift|client|b2b|company/.test(t)) {
    return `For B2B gifting we bundle StudEx Threat Proof — a signed security audit attached to the gift card. Minimum 5 boxes at R${value.priceZAR} each, with optional Wagyu upgrade. What's the recipient count and delivery date?`
  }
  return `Welcome to StudEx. I can lock in a ${premium.name} (R${premium.priceZAR}) or build you a ${value.name} (R${value.priceZAR}). What are you cooking, and for how many?`
}

async function callCloudModel(messages: ChatMessage[]): Promise<string | null> {
  const apiKey = process.env.CLOUD_MODEL_API_KEY
  const baseUrl = process.env.CLOUD_MODEL_BASE_URL || 'https://openrouter.ai/api/v1'
  const model = process.env.SALES_AGENT_MODEL || 'moonshotai/kimi-k2'

  if (!apiKey) return null

  try {
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: SALES_SYSTEM_PROMPT },
          { role: 'system', content: `Catalog: ${JSON.stringify(PRODUCT_CATALOG)}` },
          ...messages,
        ],
        temperature: 0.6,
        max_tokens: 400,
      }),
    })
    if (!res.ok) return null
    const data = await res.json()
    const text = data?.choices?.[0]?.message?.content
    return typeof text === 'string' && text.trim().length > 0 ? text : null
  } catch {
    return null
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const messages: ChatMessage[] = Array.isArray(body?.messages) ? body.messages : []
  const lastUser = [...messages].reverse().find(m => m.role === 'user')

  if (!lastUser || !lastUser.content?.trim()) {
    return NextResponse.json({ error: 'empty message' }, { status: 400 })
  }

  const cloudReply = await callCloudModel(messages)
  const reply = cloudReply ?? fallbackReply(lastUser.content)

  return NextResponse.json({
    role: 'assistant',
    content: reply,
    source: cloudReply ? 'cloud' : 'fallback',
  })
}
