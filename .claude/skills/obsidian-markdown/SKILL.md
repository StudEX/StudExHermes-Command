---
name: obsidian-markdown
description: Read and write Obsidian Flavored Markdown — wikilinks [[Note]], embeds ![[Image.png]], callouts, frontmatter YAML. Use when capturing notes into the StudEx vault under content/ or marketing_content/, or when the user asks to "add to the brain" / "save to vault" / "make a note".
license: MIT
source: https://github.com/kepano/obsidian-skills
---

# Obsidian Flavored Markdown skill

## When to use
- User asks to capture meeting notes, ideas, transcripts into the vault
- An agent needs to append a finding to the Second Brain
- Creating linked, navigable docs under `content/` or a future `vault/`

## Syntax cheat sheet

| Feature | Syntax |
|---|---|
| Wikilink | `[[Note name]]` or `[[Note name\|alias]]` |
| Header link | `[[Note#Heading]]` |
| Block ref | `[[Note#^blockid]]` |
| Embed | `![[Image.png]]` or `![[Note]]` |
| Tag | `#tag` (alphanumeric, slashes allowed `#area/meat`) |
| Callout | `> [!note] Title\n> body` (types: note, tip, warning, danger, quote, example) |
| Frontmatter | YAML between `---` fences at top of file |

## Standard StudEx frontmatter

```yaml
---
title: "<Note title>"
date: 2026-06-24
business: meat | aas | group
agent: hermes | openclaw | codex | ada | charlie
tags: [sales, lead, meeting]
status: capture | active | archived
---
```

## File-naming convention
- `content/<business>/<YYYY-MM-DD>-<slug>.md`
- Slug: lowercase, dashes, no punctuation
- Always include frontmatter

## Don't
- Don't use raw HTML — breaks mobile vault sync
- Don't put wikilinks inside code fences (they won't resolve)
- Don't create new top-level folders without naming them in `lib/fleet.ts` businesses
