# Voice Sample Drop Zone

Place 1–25 clean audio files of the target ADA voice here. Each clip should be
30 seconds to 3 minutes, mono or stereo, accepted formats: `.mp3`, `.wav`,
`.m4a`, `.flac`, `.ogg`, `.webm`.

## Mint ADA's voice

With `ELEVENLABS_API_KEY` set, hit the clone endpoint:

```bash
curl -X POST http://localhost:3000/api/sales/voice/clone \
  -H 'Content-Type: application/json' \
  -d '{"name":"ADA Concierge","description":"StudEx Meat Sales Concierge"}'
```

Response contains `voice_id`. Paste it into `.env` as `ELEVENLABS_VOICE_ID` and
restart the dev server. ADA will speak in that voice for every reply.

This folder is git-ignored — voice samples never land in the repo.
