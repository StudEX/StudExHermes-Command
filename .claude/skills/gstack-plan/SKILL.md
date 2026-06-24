---
name: gstack-plan
description: Validate an agent's plan against the GStack rubric BEFORE execution — Goal clear, Steps ordered, Tools allowed, Acceptance checkable, Cost bounded, Kill-switch defined. Returns pass/fail with line-item feedback. Every agent calls this once at the top of every non-trivial loop.
license: Internal — StudEx Sentinel
---

# GStack plan validation skill

The Sentinel CTO's pre-flight check. No plan reaches execution without passing GStack.

## When to use
- Top of every multi-step agent loop
- Before spinning up sub-agents or swarms
- When the user asks "are you sure?" — re-run GStack and show the rubric

## The rubric

| Letter | Question | Pass criterion |
|---|---|---|
| **G** — Goal | What outcome does this plan produce? | One sentence, ends in a noun (the artifact) |
| **S** — Steps | Ordered list of actions? | ≥2 steps, each ≤1 verb, no nested swarms hidden inside a step |
| **T** — Tools | Which tools / APIs are touched? | Every tool listed; all on `GUARD_TOOL_ALLOWLIST` |
| **A** — Acceptance | How will we know it's done? | A test, a diff, a file existing, a URL returning 200 — not "looks good" |
| **C** — Cost | USD estimate? | Total < remaining `guard.limits().dailyRemainingUsd` |
| **K** — Kill-switch | What stops a runaway? | Named: max iterations, time budget, or human checkpoint |

## API

```ts
import { gstack } from '@/lib/gstack'

const verdict = gstack.validate({
  goal: 'Updated lib/fleet.ts with new agent entry',
  steps: ['Read fleet.ts', 'Append agent', 'Run tsc'],
  tools: ['Read', 'Edit', 'Bash'],
  acceptance: 'tsc exits 0 and grep finds the new id',
  estCostUsd: 0.01,
  killSwitch: 'max 3 retries on tsc fail',
})

// verdict: { pass: true } | { pass: false, failed: ['A','K'], notes: { A: '...', K: '...' } }
```

## Don't
- Don't soften the rubric — "we'll figure out acceptance later" = FAIL on A
- Don't pass `estCostUsd: 0` to bypass — pass the real estimate, even rough
- Don't run a plan that failed GStack twice in a row — escalate to the user
