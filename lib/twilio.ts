import crypto from 'node:crypto'

type TwilioAuth = { username: string; password: string }

export function twilioAuth(): TwilioAuth | null {
  const apiKeySid = process.env.TWILIO_API_KEY_SID
  const apiKeySecret = process.env.TWILIO_API_KEY_SECRET
  if (apiKeySid && apiKeySecret) return { username: apiKeySid, password: apiKeySecret }

  const sid = process.env.TWILIO_ACCOUNT_SID
  const token = process.env.TWILIO_AUTH_TOKEN
  if (sid && token) return { username: sid, password: token }

  return null
}

function basicAuthHeader(auth: TwilioAuth): string {
  return 'Basic ' + Buffer.from(`${auth.username}:${auth.password}`).toString('base64')
}

export function verifyTwilioSignature(
  signatureHeader: string | null,
  fullUrl: string,
  params: Record<string, string>,
): boolean {
  const authToken = process.env.TWILIO_AUTH_TOKEN
  if (!authToken || !signatureHeader) return false

  const sortedKeys = Object.keys(params).sort()
  const concatenated = sortedKeys.reduce((acc, k) => acc + k + params[k], fullUrl)
  const expected = crypto
    .createHmac('sha1', authToken)
    .update(Buffer.from(concatenated, 'utf-8'))
    .digest('base64')

  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signatureHeader))
  } catch {
    return false
  }
}

export async function sendWhatsAppText(toWhatsApp: string, body: string): Promise<boolean> {
  const auth = twilioAuth()
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const from = process.env.TWILIO_WHATSAPP_NUMBER
  if (!auth || !accountSid || !from) return false

  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
    method: 'POST',
    headers: {
      Authorization: basicAuthHeader(auth),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ From: from, To: toWhatsApp, Body: body }),
  })
  return res.ok
}

export async function downloadTwilioMedia(mediaUrl: string): Promise<Blob | null> {
  const auth = twilioAuth()
  if (!auth) return null
  const res = await fetch(mediaUrl, { headers: { Authorization: basicAuthHeader(auth) } })
  if (!res.ok) return null
  return await res.blob()
}
