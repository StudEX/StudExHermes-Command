---
name: obsidian-canvas
description: Create and edit Obsidian JSON Canvas (.canvas) files — nodes, edges, groups. Use for visualising agent flows, swarm topology, sales pipelines, or any "show me the graph" request. Output is plain JSON conforming to the JSON Canvas 1.0 spec.
license: MIT
source: https://github.com/kepano/obsidian-skills
---

# JSON Canvas skill

## When to use
- User asks for a visual map, flowchart, mind-map, swarm topology
- Showing how agents (Hermes / OpenClaw / Codex / ADA / Charlie) connect
- Drawing a sales funnel or onboarding journey

## Minimal schema

```json
{
  "nodes": [
    { "id": "n1", "type": "text", "text": "Hermes", "x": 0,   "y": 0,   "width": 200, "height": 80, "color": "1" },
    { "id": "n2", "type": "text", "text": "OpenClaw", "x": 260, "y": 0,   "width": 200, "height": 80, "color": "2" },
    { "id": "n3", "type": "file", "file": "content/group/2026-06-24-brief.md", "x": 0, "y": 120, "width": 200, "height": 60 }
  ],
  "edges": [
    { "id": "e1", "fromNode": "n1", "fromSide": "right", "toNode": "n2", "toSide": "left", "label": "delegates" }
  ]
}
```

## Node types
- `text` — inline markdown
- `file` — embed a vault file
- `link` — embed a URL
- `group` — a container box (`x/y/width/height` only, plus `label`)

## Colors
`"1"` red, `"2"` orange, `"3"` yellow, `"4"` green, `"5"` cyan, `"6"` purple. StudEx convention: orange = customer-facing, green = operational, purple = core swarm.

## Layout heuristic
- Keep `x/y` on a 20px grid
- Min `width` 180, min `height` 60
- Space siblings 60px apart
- Group related nodes inside a `group` node first, then draw children inside its bounds
