---
name: defuddle
description: Extract clean, low-token markdown from a web page or article URL. Use before feeding a page into the brain, before quoting a long article, or when WebFetch returns noisy nav/ads/cookie banners. Strips chrome, keeps body, preserves headings and links.
license: MIT
source: https://github.com/kepano/obsidian-skills
---

# Defuddle skill

## When to use
- Saving a web article to the vault — strip chrome first
- Brain ingest pipeline — reduce token cost
- Citing a source — extract the clean body before quoting

## Recipe

1. Fetch the page (WebFetch or fetch())
2. Drop everything outside `<article>`, `<main>`, or the largest `<div>` by text density
3. Drop `<nav>`, `<aside>`, `<footer>`, `<script>`, `<style>`, `<form>`, `[role=banner]`, `[role=contentinfo]`
4. Drop ads — common classes `*-ad-*`, `*advert*`, `*promo*`, `*newsletter-*`, `*cookie*`
5. Convert remaining DOM to markdown:
   - `h1..h6` → `#..######`
   - `p` → blank-line-separated paragraph
   - `a[href]` → `[text](href)` (resolve relative URLs against page URL)
   - `img[src][alt]` → `![alt](src)` (resolve relative)
   - `code`, `pre` → backtick fences
   - `ul/ol/li` → `-` / `1.` lists
   - `blockquote` → `>` prefix
6. Collapse `\n{3,}` → `\n\n`
7. Prepend frontmatter:
   ```yaml
   ---
   source: <url>
   captured: <ISO date>
   title: <page title>
   ---
   ```

## Quality bar
- Result should be < 30% of original byte size for typical news/blog pages
- All inline links preserved
- No raw HTML left in output (except `<sup>`/`<sub>` if they carry meaning)

## Don't
- Don't summarise — defuddle is extraction, not compression
- Don't translate
- Don't follow links / fetch sub-pages
