---
name: cashclaw-guard
description: Runtime safety wrapper around any agent LLM/tool call — enforces hard cost cap (USD), per-minute rate limit, recursion depth limit, and tool firewall. Use before ADA, Hermes, OpenClaw, Codex, or Charlie call out to a paid API. Blocks runaway loops and surprise bills.
license: MIT
source: https://github.com/ertugrulakben/cashclaw
---

# CashClaw Guard skill

Inspired by CashClaw Guard v1.7. Wraps each outbound paid call so a single buggy loop can't drain the wallet.

## When to use
- Wrapping `chatLLM()` in `lib/llm.ts`
- Wrapping ElevenLabs TTS, Twilio send, Pinecone upsert, any billable call
- Any new agent loop the swarm adds — Guard FIRST, then loop

## API (TypeScript)

```ts
import { guard } from '@/lib/guard'

const result = await guard.run({
  agent: 'ada',
  tool: 'llm.chat',
  estCostUsd: 0.002,            // estimate, refined post-call
  fn: () => chatLLM({ messages }),
})
```

## Limits (env-driven, sane defaults)

| Env var | Default | Meaning |
|---|---|---|
| `GUARD_DAILY_USD_CAP` | `5.00` | Hard ceiling per UTC day across whole fleet |
| `GUARD_AGENT_MINUTE_CALLS` | `60` | Per-agent calls per rolling 60s |
| `GUARD_MAX_RECURSION` | `8` | Deepest nested guard.run() before refuse |
| `GUARD_TOOL_ALLOWLIST` | `*` | CSV of allowed tools, `*` = all |
| `GUARD_ALERT_WEBHOOK` | empty | POST when cap hit (Telegram/Slack URL) |

## Failure modes (returned, not thrown — agents must check)

```ts
type GuardResult<T> =
  | { ok: true; value: T; costUsd: number }
  | { ok: false; reason: 'daily-cap' | 'rate-limit' | 'recursion' | 'tool-blocked' | 'panic-stop' }
```

## Don't
- Don't catch+ignore a `{ ok: false }` — surface it to the user or the orchestrator
- Don't disable Guard for "just one call" — that's how bills happen
- Don't read `process.env` directly for caps — call `guard.limits()` so the dashboard stays consistent
