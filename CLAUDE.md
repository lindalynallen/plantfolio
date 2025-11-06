# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Plantfolio is a personal plant gallery website showcasing 54+ houseplants with historical photos and automated sync from the Planta mobile app API.

**Tech Stack:** Next.js 16, TypeScript, Tailwind CSS, Supabase (PostgreSQL + Storage)

**Current Status:** Backend complete (EPICs 1-2), Frontend in progress (EPIC 3+)

## Commands

```bash
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # Build for production
npm run insert-plants    # Insert plants from Planta API JSON (idempotent)
npm run backfill         # Upload historical photos (idempotent)
npm run backfill:test    # Test backfill on 3 sample folders
```

## Architecture

**Database:** 3 tables in Supabase - `plants`, `photos`, `sync_tokens`

**Storage:** Public bucket `plant-photos` with folders: `historical/` and `planta/`

**Display name logic:** `custom_name || localized_name` (custom takes priority)

**Photo sorting:** `ORDER BY planta_last_updated DESC NULLS LAST, display_order ASC`

## Reference Documentation

- **Project brief:** `docs/00_project-brief.md`
- **Full architecture:** `docs/01_architecture-spec.md`
- **Task checklist:** `docs/02_implementation-checklist.md`
