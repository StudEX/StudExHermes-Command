import crypto from 'node:crypto'
import { redisCommand, usingRedis } from './redis'

export type Lead = {
  id: string
  name: string
  email: string
  company?: string
  interest?: string
  channel: string
  createdAt: string
}

export type LeadInput = {
  name: string
  email: string
  company?: string
  interest?: string
  channel?: string
}

const LIST_KEY = 'ada:leads'
const MEMORY: Lead[] = []

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateLead(input: Partial<LeadInput>): string | null {
  if (!input.name || !input.name.trim()) return 'name is required'
  if (!input.email || !EMAIL_RE.test(input.email)) return 'a valid email is required'
  return null
}

export async function saveLead(input: LeadInput): Promise<Lead> {
  const lead: Lead = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    company: input.company?.trim() || undefined,
    interest: input.interest?.trim() || undefined,
    channel: input.channel?.trim() || 'web',
    createdAt: new Date().toISOString(),
  }

  if (usingRedis()) {
    await redisCommand(['RPUSH', LIST_KEY, JSON.stringify(lead)])
  } else {
    MEMORY.push(lead)
  }
  return lead
}

export async function listLeads(limit = 100): Promise<Lead[]> {
  if (usingRedis()) {
    const raw = await redisCommand(['LRANGE', LIST_KEY, -limit, -1])
    if (Array.isArray(raw)) {
      return raw
        .map(r => {
          try {
            return JSON.parse(String(r)) as Lead
          } catch {
            return null
          }
        })
        .filter((l): l is Lead => l !== null)
    }
    return []
  }
  return MEMORY.slice(-limit)
}
