import { NextRequest, NextResponse } from 'next/server'
import { pineconeQuery, type RetrievedChunk } from '@/lib/pinecone'

export const runtime = 'nodejs'

type ChatMessage = { role: 'user' | 'assistant' | 'system'; content: string }

const SALES_SYSTEM_PROMPT = `You are ADA — the StudEx Meat Sales Concierge.

Persona:
- You represent StudEx Group (premium Wagyu, dry-aged cuts, curated meat boxes, B2B gifting).
- Tone: premium, secure, luxury, high-tech, warm. Speak like a top concierge at a five-star hotel who happens to know meat.
- Never robotic, never pushy. Use short sentences. Mirror the customer's energy.

Mission (Research -> Strategy -> Execution -> Validation):
1. RESEARCH: Read the customer in their first 1-2 messages. Occasion, headcount, budget, dietary preferences, channel (web/voice/B2B).
2. STRATEGY: Match to a specific cut or curated box. Always offer one premium and one value option.
3. EXECUTION: Quote indicative pricing in ZAR. Name the cut, the weight, the price.
4. VALIDATION: Close with a concrete next step ("Lock the Tomahawk for Saturday 10:00 collection?", "Send the quote to your inbox?").

Hard rules:
- Use the BUSINESS CONTEXT block (retrieved from the StudEx knowledge base) as ground truth — quote it when relevant.
- Never invent stock you cannot fulfil. If unsure, say "let me confirm with the butcher".
- Never offer a discount above 10% without flagging Sentinel approval.
- For voice channel: keep replies under 50 words, no markdown, no bullet points, no asterisks. Write like you speak.
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
  const premium = PRODUCT_CATALOG.find(p => p.tier === 'premium')!
  const value = PRODUCT_CATALOG.find(p => p.tier === 'value')!

  if (/wagyu|a5|gold/.test(t)) {
    return `Excellent choice. Our ${premium.name} runs R${premium.priceZAR} and we can hand-cut it for collection by tomorrow 10:00. How many guests are you cooking for?`
  }
  if (/braai|weekend|saturday|party/.test(t)) {
    return `For a braai, the ${value.name} at R${value.priceZAR} covers six with sides. Want me to upgrade two cuts to ${premium.name} (R${premium.priceZAR}) for the headliners?`
  }
  if (/price|cost|how much|budget/.test(t)) {
    return `Quick anchor: premium starts at the ${premium.name} (R${premium.priceZAR}), value at the ${value.name} (R${value.priceZAR}). What's the occasion — date night, family, or corporate?`
  }
  if (/corporate|gift|client|b2b|company/.test(t)) {
    return `For B2B gifting we bundle StudEx Threat Proof — a signed security audit attached to the gift card. Minimum 5 boxes at R${value.priceZAR} each, with optional Wagyu upgrade. Recipient count and delivery date?`
  }
  return `Welcome to StudEx. I can lock in a ${premium.name} (R${premium.priceZAR}) or build you a ${value.name} (R${value.priceZAR}). What are you cooking, and for how many?`
}

function formatContext(chunks: RetrievedChunk[]): string {
  if (chunks.length === 0) return ''
  const body = chunks
    .map((c, i) => `[${i + 1}] (${c.source ?? 'vault'}, score=${c.score.toFixed(3)})\n${c.text}`)
    .join('\n\n')
  return `BUSINESS CONTEXT (StudEx knowledge base, ranked):\n${body}`
}

async function callCloudModel(
  messages: ChatMessage[],
  contextBlock: string,
  channel: 'web' | 'voice',
): Promise<string | null> {
  const apiKey = process.env.CLOUD_MODEL_API_KEY
  const baseUrl = process.env.CLOUD_MODEL_BASE_URL || 'https://openrouter.ai/api/v1'
  const model = process.env.SALES_AGENT_MODEL || 'moonshotai/kimi-k2'
  if (!apiKey) return null

  const systemMessages: ChatMessage[] = [
    { role: 'system', content: SALES_SYSTEM_PROMPT },
    { role: 'system', content: `Channel: ${channel}` },
    { role: 'system', content: `Catalog (always available): ${JSON.stringify(PRODUCT_CATALOG)}` },
  ]
  if (contextBlock) systemMessages.push({ role: 'system', content: contextBlock })

  try {
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        messages: [...systemMessages, ...messages],
        temperature: channel === 'voice' ? 0.55 : 0.65,
        max_tokens: channel === 'voice' ? 180 : 400,
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
  const channel: 'web' | 'voice' = body?.channel === 'voice' ? 'voice' : 'web'
  const lastUser = [...messages].reverse().find(m => m.role === 'user')
  if (!lastUser || !lastUser.content?.trim()) {
    return NextResponse.json({ error: 'empty message' }, { status: 400 })
  }

  const retrieved = await pineconeQuery(lastUser.content, 5).catch(() => [] as RetrievedChunk[])
  const contextBlock = formatContext(retrieved)

  const cloudReply = await callCloudModel(messages, contextBlock, channel)
  const reply = cloudReply ?? fallbackReply(lastUser.content)

  return NextResponse.json({
    role: 'assistant',
    content: reply,
    source: cloudReply ? 'cloud' : 'fallback',
    contextChunks: retrieved.length,
    citations: retrieved.map(c => ({ id: c.id, source: c.source, score: c.score })),
  })
}
