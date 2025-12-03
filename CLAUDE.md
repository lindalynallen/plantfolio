# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Plantfolio is a personal plant gallery website showcasing 54+ houseplants with historical photos and automated sync from the Planta mobile app API.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS, Supabase (PostgreSQL + Storage)

**Status:** EPICs 1-6 complete (Backend, Frontend, Planta API Sync, Deployed)

## Quick Reference

### Development

```bash
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # Build for production
npm run lint             # Run ESLint
```

### Testing

```bash
npm test                 # Watch mode
npm run test:run         # Single run (CI mode)
npm run test:coverage    # Coverage report
npm run test:ui          # Visual dashboard
```

### Data Scripts

```bash
npm run insert-plants    # Insert plants from Planta API JSON (idempotent)
npm run backfill         # Upload historical photos (idempotent)
npm run backfill:test    # Test backfill on 3 sample folders
```

### Sync API

```bash
# Trigger photo sync (requires SYNC_API_KEY env var)
curl -X POST http://localhost:3000/api/sync \
  -H "Authorization: Bearer $SYNC_API_KEY"
```

**How sync works:**
- Fetches all plants from Planta API (paginated)
- Detects new photos by comparing `planta_image_url` — only downloads if URL changed
- Uploads new photos to Supabase Storage (`planta/` folder)
- Auto-refreshes access token if <1 hour remaining
- Never overwrites existing plant data

## Architecture

### Database (Supabase)

- **Tables:** `plants`, `photos`, `sync_tokens`
- **Storage:** Public bucket `plant-photos` with `historical/` and `planta/` folders

### Key Logic

- **Display name:** `custom_name || localized_name` (custom takes priority)
- **Photo sorting:** `ORDER BY planta_last_updated DESC NULLS LAST, display_order ASC`
- **Plant sorting:** 5 columns (name, species, location, photos, updated) with asc/desc; nulls always last

## Testing

**Framework:** Vitest 4.0 + React Testing Library

### Current Coverage

| Area | Tests | Notes |
|------|-------|-------|
| Components (`PlantCard`, `PlantDetailClient`) | 32 | User-facing behavior |
| PlantGallery (`sortPlants` function) | 22 | All columns, directions, null handling |
| Utilities (`src/lib/utils.ts`) | 8 | Date formatting, photo sorting |
| API Routes (`/api/sync`) | 5 | Success + error paths |

**Total: 67 tests**

### Not Yet Tested

- Error boundaries and error pages
- Loading states and suspense fallbacks
- Layout components (Header, FilterBar)
- Lightbox navigation and keyboard controls
- Client-side filtering and search

### Test File Locations

```
src/__tests__/
├── api/          # API route tests
├── components/   # Component tests
└── lib/          # Utility function tests
```

### Testing Guidelines

- Utilities: aim for >80% coverage (pure functions)
- API routes: test success + error paths
- Components: test user-facing behavior, not implementation
- Mock Supabase in unit tests

## Commit Convention

```
feat: description      # New features
fix: description       # Bug fixes
refactor: description  # Code restructuring
polish: description    # UI/UX improvements
docs: description      # Documentation
test: description      # Test changes
```

For EPIC milestones: `feat: complete EPIC N - Description`
