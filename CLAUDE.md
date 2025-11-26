# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Plantfolio is a personal plant gallery website showcasing 54+ houseplants with historical photos and automated sync from the Planta mobile app API.

**Tech Stack:** Next.js, TypeScript, Tailwind CSS, Supabase (PostgreSQL + Storage)

**Current Status:** EPICs 1-5 complete (Backend, Frontend, Planta API Sync)

## Commands

```bash
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # Build for production
npm run insert-plants    # Insert plants from Planta API JSON (idempotent)
npm run backfill         # Upload historical photos (idempotent)
npm run backfill:test    # Test backfill on 3 sample folders
```

## API Endpoints

### Sync Planta Photos

Manually sync new photos from Planta API (requires authentication):

```bash
# Local
curl -X POST http://localhost:3000/api/sync \
  -H "Authorization: Bearer $SYNC_API_KEY"

# Production (after deployment)
curl -X POST https://your-site.vercel.app/api/sync \
  -H "Authorization: Bearer $SYNC_API_KEY"
```

**Authentication:** The endpoint requires a Bearer token set in the `SYNC_API_KEY` environment variable. This protects against unauthorized access and abuse.

**Response:**
```json
{
  "success": true,
  "plants_synced": 54,
  "photos_added": 3,
  "errors": []
}
```

**How it works:**
- Fetches all plants from Planta API with pagination
- Inserts new plants (if any)
- Never overwrites existing plant data
- Detects new photos via `planta_image_url` comparison
- Downloads and uploads new photos to Supabase Storage
- Automatically refreshes access token if <1 hour remaining
- Returns summary with counts and any errors

## Architecture

**Database:** 3 tables in Supabase - `plants`, `photos`, `sync_tokens`

**Storage:** Public bucket `plant-photos` with folders: `historical/` and `planta/`

**Display name logic:** `custom_name || localized_name` (custom takes priority)

**Photo sorting:** `ORDER BY planta_last_updated DESC NULLS LAST, display_order ASC`

## Commit Message Convention

Follow conventional commits with these prefixes:

- `feat: complete EPIC N - Description` - For EPIC milestones
- `feat: description` - New features
- `refactor: description` - Code restructuring
- `polish: description` - UI/UX improvements
- `docs: description` - Documentation changes
- `fix: description` - Bug fixes

## Reference Documentation

- **Project brief:** `docs/00_project-brief.md`
- **Full architecture:** `docs/01_architecture-spec.md`
- **Task checklist:** `docs/02_implementation-checklist.md`
- **Deployment guide:** `docs/DEPLOYMENT.md` ⚠️ Required reading before deploying to Vercel
