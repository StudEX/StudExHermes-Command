# StudBot / StudEx Hermes Command

Local integration preview for the StudEx Factory workspace. This branch connects the visual design, draft desk, brand story and an explicitly bounded readiness adapter. It does **not** claim live Hermes, Orgo, Shopify, phone, Google Cloud or Base44 execution.

## Run locally

Use Node 22 (`.nvmrc`).

```sh
npm ci
npm test
npm run build
npm run start -- --hostname 127.0.0.1 --port 4320
```

Bind to loopback. There is no production identity/tenant boundary yet. The legacy demo password endpoint now returns 503 and grants no cookie. Older routes are labelled archived samples.

## Implemented

- Responsive founder workspace: Overview, Agents, Content, Connections, Memory.
- Explicit-save local browser draft and explicit-load action. No draft is sent to an agent.
- Optional user-triggered browser read-aloud; this is not live conversational voice. Microphone pairing remains disabled.
- GET `/api/integrations`: honest readiness metadata, no credentials/URLs returned.
- Optional Linux process health read via server-only `STUDBOT_LINUX_HEALTH_URL`. Only numeric loopback HTTP `/api/health`, no parameters, no redirect; 1.5-second/8KB limit. A response does not prove healthy agents/VMs.
- Node tests for failure modes, hostile targets and bounded reads.

## Integration records

- [Brand narrative](docs/brand/SOUL.md)
- [Architecture and migration](docs/integration/ARCHITECTURE.md)
- [On-demand compute and cost policy](docs/integration/COMPUTE-POLICY.md)
- [Validation](docs/integration/VALIDATION.md)

Provider flags `STUDBOT_<ID>_CONFIGURED=true` only declare configuration, never verified access. Supported IDs: HERMES, PORTABLE, SHOPIFY, BASE44, ORGO, QODER, FACTORY, TWILIO, DRIVE. No flags or credentials are set by this branch. Real connectors require scoped authentication and evidence before activation.

No auto-push, VM start/stop, phone pairing, network join, customer message or deployment runs at startup. Preserve the canonical Notion Projects queue; do not infer authority from an agent-generated plan.
