# Obsidian Vault Drop Zone

Place (or symlink) your StudEx Obsidian vault contents here as `.md` files. The
ingest script walks recursively, chunks by heading, embeds, and upserts to
Pinecone under namespace `PINECONE_NAMESPACE` (default `studex-vault`).

## Usage

```bash
# Default — read ./vault
bun run scripts/ingest_vault.ts

# Or point at any directory
bun run scripts/ingest_vault.ts ~/Obsidian/StudEx
```

Required env vars (see `.env.example`):
- `PINECONE_API_KEY`
- `PINECONE_INDEX_HOST`
- `EMBEDDING_API_KEY`

This folder is git-ignored — your business knowledge never lands in the repo.
