// GStack — Sentinel CTO's pre-flight rubric for agent plans.
// Every multi-step agent loop validates its plan here BEFORE execution.
//
// Cheap, deterministic, no LLM call. Returns a structured verdict so the
// caller (or a UI) can show line-item failures.

import { guard } from './guard'

export type GStackPlan = {
  goal: string
  steps: string[]
  tools: string[]
  acceptance: string
  estCostUsd: number
  killSwitch: string
}

export type GStackLetter = 'G' | 'S' | 'T' | 'A' | 'C' | 'K'

export type GStackVerdict =
  | { pass: true; estCostUsd: number; remainingUsd: number }
  | { pass: false; failed: GStackLetter[]; notes: Partial<Record<GStackLetter, string>> }

const VERBLESS = /[.!?]\s*$/

function checkGoal(goal: string): string | null {
  if (!goal || goal.trim().length < 8) return 'goal must be at least 8 chars'
  if (goal.length > 240) return 'goal must be one sentence (≤240 chars)'
  if (!VERBLESS.test(goal) && goal.split('\n').length > 1) return 'goal must be a single sentence'
  return null
}

function checkSteps(steps: string[]): string | null {
  if (!Array.isArray(steps) || steps.length < 2) return 'need ≥2 ordered steps'
  for (const s of steps) {
    if (!s || s.trim().length === 0) return 'empty step'
    if (s.length > 200) return `step too long (>200 chars): "${s.slice(0, 40)}…"`
    if (/swarm|fan.?out|100 agents/i.test(s)) {
      return 'no hidden swarms inside a step — declare each agent explicitly'
    }
  }
  return null
}

function checkTools(tools: string[]): string | null {
  if (!Array.isArray(tools) || tools.length === 0) return 'list every tool/API the plan touches'
  const limits = guard.limits()
  if (limits.toolAllowlist === '*') return null
  const blocked = tools.filter(t => !(limits.toolAllowlist as string[]).includes(t))
  if (blocked.length) return `tools blocked by guard allowlist: ${blocked.join(', ')}`
  return null
}

function checkAcceptance(acc: string): string | null {
  if (!acc || acc.trim().length < 10) return 'acceptance criterion too vague'
  if (/looks good|seems fine|probably|maybe/i.test(acc)) {
    return 'acceptance must be checkable (test, diff, file exists, URL 200) — not "looks good"'
  }
  return null
}

function checkCost(est: number): { note: string | null; remaining: number } {
  const limits = guard.limits()
  const remaining = limits.dailyRemainingUsd
  if (!Number.isFinite(est) || est < 0) return { note: 'estCostUsd must be a finite, non-negative number', remaining }
  if (est > remaining) {
    return { note: `est ${est.toFixed(4)} exceeds remaining cap ${remaining.toFixed(4)}`, remaining }
  }
  return { note: null, remaining }
}

function checkKill(k: string): string | null {
  if (!k || k.trim().length < 6) return 'kill-switch must name max iterations, time budget, or human checkpoint'
  return null
}

function validate(plan: GStackPlan): GStackVerdict {
  const failed: GStackLetter[] = []
  const notes: Partial<Record<GStackLetter, string>> = {}

  const g = checkGoal(plan.goal); if (g) { failed.push('G'); notes.G = g }
  const s = checkSteps(plan.steps); if (s) { failed.push('S'); notes.S = s }
  const t = checkTools(plan.tools); if (t) { failed.push('T'); notes.T = t }
  const a = checkAcceptance(plan.acceptance); if (a) { failed.push('A'); notes.A = a }
  const c = checkCost(plan.estCostUsd); if (c.note) { failed.push('C'); notes.C = c.note }
  const k = checkKill(plan.killSwitch); if (k) { failed.push('K'); notes.K = k }

  if (failed.length) return { pass: false, failed, notes }
  return { pass: true, estCostUsd: plan.estCostUsd, remainingUsd: c.remaining }
}

export const gstack = { validate }
