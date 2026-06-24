---
name: gbrain-query
description: Query the Second Brain — hybrid vector + keyword + graph search across the StudEx vault, returns synthesized prose answers with citations. Use when an agent needs prior context ("what did we decide about X?", "what does the customer profile say?", "find the meeting notes about Y").
license: MIT
source: https://github.com/garrytan/gbrain
---

# GBrain query skill

Wraps the unified `/api/brain/query` endpoint which fans out to Pinecone (current) and gbrain (when configured), reranks, then synthesizes.

## When to use
- ADA needs product knowledge before answering a customer
- Hermes needs prior creative briefs before drafting copy
- OpenClaw needs architectural decisions before reasoning
- Any agent asks itself "have we done this before?"

## API

```ts
POST /api/brain/query
{
  "q": "what wagyu grade did the Sandton restaurant order last quarter?",
  "topK": 6,                     // optional, default 6
  "namespace": "studex-vault",   // optional
  "graph": true                  // include graph edges (gbrain only), default true
}

→
{
  "answer": "Sandton restaurant ordered A5 striploin and ribeye twice in Q1 ...",
  "citations": [
    { "id": "...", "title": "...", "score": 0.81, "snippet": "...", "source": "vault" }
  ],
  "gaps": ["no Q2 orders found — confirm if pipeline still active"],
  "backend": "pinecone" | "gbrain" | "hybrid"
}
```

## Quality contract
- `answer` is at most 4 short paragraphs
- Every factual claim has a `citations[]` entry
- `gaps[]` is non-empty when the brain is uncertain — agents MUST surface this to the user
- `backend` reports which store served the query for telemetry

## Don't
- Don't query the brain in a tight loop — wrap with `guard` (see cashclaw-guard skill)
- Don't trust the answer if `citations.length === 0` — treat as "no result"
- Don't paste the full answer into chat — quote the relevant sentence and the citation
