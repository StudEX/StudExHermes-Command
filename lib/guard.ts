// CashClaw-inspired runtime Guard. Single in-memory ledger per process — fine for
// single-node Vercel/Proxmox deploys; swap the ledger for Redis when we go horizontal.
//
// Public surface:
//   guard.run({ agent, tool, estCostUsd, fn })  → GuardResult<T>
//   guard.limits()                              → snapshot for dashboard
//   guard.reset()                               → test hook only

export type GuardReason =
  | 'daily-cap'
  | 'rate-limit'
  | 'recursion'
  | 'tool-blocked'
  | 'panic-stop'

export type GuardResult<T> =
  | { ok: true; value: T; costUsd: number }
  | { ok: false; reason: GuardReason; detail?: string }

export type GuardLimits = {
  dailyCapUsd: number
  dailySpentUsd: number
  dailyRemainingUsd: number
  agentMinuteCalls: number
  maxRecursion: number
  toolAllowlist: string[] | '*'
  panicStopped: boolean
  perAgentCalls: Record<string, number>
}

type RunOpts<T> = {
  agent: string
  tool: string
  estCostUsd: number
  fn: () => Promise<T>
  actualCostUsd?: (value: T) => number
}

function envNum(key: string, fallback: number): number {
  const raw = process.env[key]
  if (!raw) return fallback
  const n = Number(raw)
  return Number.isFinite(n) ? n : fallback
}

function envList(key: string, fallback: string[] | '*'): string[] | '*' {
  const raw = process.env[key]
  if (!raw || raw === '*') return fallback
  return raw.split(',').map(s => s.trim()).filter(Boolean)
}

function utcDayKey(now = new Date()): string {
  return now.toISOString().slice(0, 10)
}

class GuardLedger {
  private dayKey = utcDayKey()
  private spent = 0
  private recursion = 0
  private callsByAgent = new Map<string, number[]>() // ts in ms
  private panic = false

  private rollDayIfNeeded() {
    const today = utcDayKey()
    if (today !== this.dayKey) {
      this.dayKey = today
      this.spent = 0
      this.callsByAgent.clear()
    }
  }

  private trimAgentWindow(agent: string, now: number) {
    const arr = this.callsByAgent.get(agent) ?? []
    const cutoff = now - 60_000
    while (arr.length && arr[0] < cutoff) arr.shift()
    this.callsByAgent.set(agent, arr)
    return arr
  }

  private cap(): number {
    return envNum('GUARD_DAILY_USD_CAP', 5)
  }

  private minuteCalls(): number {
    return envNum('GUARD_AGENT_MINUTE_CALLS', 60)
  }

  private maxRecursion(): number {
    return envNum('GUARD_MAX_RECURSION', 8)
  }

  private allowlist(): string[] | '*' {
    return envList('GUARD_TOOL_ALLOWLIST', '*')
  }

  panicStop() {
    this.panic = true
  }

  async run<T>(opts: RunOpts<T>): Promise<GuardResult<T>> {
    this.rollDayIfNeeded()
    if (this.panic) return { ok: false, reason: 'panic-stop' }

    if (this.recursion >= this.maxRecursion()) {
      return { ok: false, reason: 'recursion', detail: `depth=${this.recursion}` }
    }

    const allow = this.allowlist()
    if (allow !== '*' && !allow.includes(opts.tool)) {
      return { ok: false, reason: 'tool-blocked', detail: opts.tool }
    }

    const now = Date.now()
    const arr = this.trimAgentWindow(opts.agent, now)
    if (arr.length >= this.minuteCalls()) {
      return { ok: false, reason: 'rate-limit', detail: `${arr.length}/min` }
    }

    if (this.spent + opts.estCostUsd > this.cap()) {
      void this.alert(`Daily cap would breach — spent ${this.spent.toFixed(4)} + est ${opts.estCostUsd.toFixed(4)} > cap ${this.cap()}`)
      return { ok: false, reason: 'daily-cap' }
    }

    arr.push(now)
    this.recursion += 1
    try {
      const value = await opts.fn()
      const actual = opts.actualCostUsd ? opts.actualCostUsd(value) : opts.estCostUsd
      this.spent += actual
      return { ok: true, value, costUsd: actual }
    } finally {
      this.recursion -= 1
    }
  }

  private async alert(message: string) {
    const url = process.env.GUARD_ALERT_WEBHOOK
    if (!url) return
    try {
      await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ source: 'cashclaw-guard', message, day: this.dayKey }),
      })
    } catch {
      // swallow — webhook is best-effort
    }
  }

  limits(): GuardLimits {
    this.rollDayIfNeeded()
    const perAgentCalls: Record<string, number> = {}
    const now = Date.now()
    for (const [agent] of this.callsByAgent) {
      perAgentCalls[agent] = this.trimAgentWindow(agent, now).length
    }
    const dailyCap = this.cap()
    return {
      dailyCapUsd: dailyCap,
      dailySpentUsd: Math.round(this.spent * 10000) / 10000,
      dailyRemainingUsd: Math.max(0, Math.round((dailyCap - this.spent) * 10000) / 10000),
      agentMinuteCalls: this.minuteCalls(),
      maxRecursion: this.maxRecursion(),
      toolAllowlist: this.allowlist(),
      panicStopped: this.panic,
      perAgentCalls,
    }
  }

  reset() {
    this.dayKey = utcDayKey()
    this.spent = 0
    this.recursion = 0
    this.callsByAgent.clear()
    this.panic = false
  }
}

const g = globalThis as unknown as { __studexGuard?: GuardLedger }
if (!g.__studexGuard) g.__studexGuard = new GuardLedger()

export const guard = {
  run: <T>(opts: RunOpts<T>) => g.__studexGuard!.run(opts),
  limits: () => g.__studexGuard!.limits(),
  panicStop: () => g.__studexGuard!.panicStop(),
  reset: () => g.__studexGuard!.reset(),
}
