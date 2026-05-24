// The StudEx agent fleet — single source of truth for the support dashboard.

export type Capability = 'llm' | 'pinecone' | 'twilio' | 'elevenlabs' | 'redis' | 'stt'
export type FleetStatus = Record<Capability, boolean>

export type AgentKind = 'customer' | 'internal' | 'core'
export type Readiness = 'operational' | 'degraded' | 'external' | 'planned'

export type Agent = {
  id: string
  name: string
  tagline: string
  kind: AgentKind
  businesses: string[]
  channels: string[]
  requires: Capability[] // capabilities that must be configured to be operational
  external?: boolean // runs as a separate service / SaaS console, not this app
  planned?: boolean // not built/deployed yet
  href?: string
}

export const BUSINESSES: { id: string; name: string; blurb: string }[] = [
  { id: 'meat', name: 'StudEx Meat', blurb: 'Premium Wagyu & dry-aged e-commerce' },
  { id: 'aas', name: 'Agent-as-a-Service', blurb: 'AI agents sold to B2B clients' },
  { id: 'group', name: 'StudEx Group', blurb: 'Shared corporate operations' },
]

export const CAPABILITY_LABELS: Record<Capability, string> = {
  llm: 'LLM (cloud/local)',
  pinecone: 'Pinecone RAG',
  twilio: 'Twilio WhatsApp',
  elevenlabs: 'ElevenLabs TTS',
  redis: 'Redis sessions',
  stt: 'Speech-to-text',
}

export const FLEET: Agent[] = [
  {
    id: 'ada',
    name: 'ADA',
    tagline: 'Customer sales & support concierge',
    kind: 'customer',
    businesses: ['meat', 'aas'],
    channels: ['Web', 'WhatsApp', 'Voice'],
    requires: ['llm'],
    href: '/sales',
  },
  {
    id: 'charlie',
    name: 'Charlie',
    tagline: 'Post-purchase outbound calling agent',
    kind: 'customer',
    businesses: ['meat'],
    channels: ['Phone'],
    requires: [],
    external: true,
  },
  {
    id: 'onboarding',
    name: 'Onboarding Desk',
    tagline: 'Signs up & captures B2B client leads',
    kind: 'customer',
    businesses: ['aas'],
    channels: ['Web'],
    requires: [],
    href: '/onboard',
  },
  {
    id: 'hermes',
    name: 'Hermes',
    tagline: 'Creative / content generation',
    kind: 'core',
    businesses: ['group'],
    channels: ['Internal'],
    requires: ['llm'],
  },
  {
    id: 'openclaw',
    name: 'OpenClaw',
    tagline: 'Logic / technical reasoning',
    kind: 'core',
    businesses: ['group'],
    channels: ['Internal'],
    requires: ['llm'],
  },
  {
    id: 'codex',
    name: 'Codex',
    tagline: 'Execution / optimization',
    kind: 'core',
    businesses: ['group'],
    channels: ['Internal'],
    requires: ['llm'],
  },
  {
    id: 'openjarvis',
    name: 'OpenJarvis',
    tagline: 'Autonomous internal automation & digests',
    kind: 'internal',
    businesses: ['group'],
    channels: ['Scheduled'],
    requires: [],
    planned: true,
  },
  {
    id: 'qwenpaw',
    name: 'QwenPaw',
    tagline: 'Team assistant on Discord / Telegram / Slack',
    kind: 'internal',
    businesses: ['group'],
    channels: ['Discord', 'Telegram', 'Slack'],
    requires: [],
    planned: true,
  },
]

export function agentReadiness(agent: Agent, status: FleetStatus | null): Readiness {
  if (agent.planned) return 'planned'
  if (agent.external) return 'external'
  if (!status) return 'degraded'
  const missing = agent.requires.filter(cap => !status[cap])
  return missing.length === 0 ? 'operational' : 'degraded'
}

export function missingCapabilities(agent: Agent, status: FleetStatus | null): Capability[] {
  if (!status) return agent.requires
  return agent.requires.filter(cap => !status[cap])
}
