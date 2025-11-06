# PLANTFOLIO MVP ARCHITECTURE & IMPLEMENTATION PLAN

**Version:** 8.0 (Final - Reviewed)
**Date:** 2025-11-03
**Status:** Ready for Implementation

---

## PROJECT OVERVIEW

Plantfolio is a personal plant gallery website showcasing 50+ houseplants. It serves as both a family/friend sharing platform and a portfolio demonstrating software engineering skills, API integration, and AI-assisted development.

### Technical Challenge
The Planta mobile app API is read-only with limitations:
- Only exposes single most recent image per plant
- No public web access
- No historical timeline data
- Cursor-based pagination for plant data

### Solution Architecture
Build a self-maintaining historical dataset through:
1. **Manual Backfill**: Upload archived photos to Supabase storage
2. **Automated Sync**: `/api/sync` route polls Planta API, detects new photos via URL/timestamp comparison, inserts new data without overwriting existing

### Tech Stack
- **Frontend:** Next.js, TypeScript, Tailwind CSS
- **Backend:** Supabase (database + storage)
- **Deployment:** Vercel
- **API:** Planta integration with token + refresh token auth

### Current Data Inventory
- **Plants:** 53 total
- **Historical Photos:** 412 total (~8 photos per plant average, some plants have 20+)
- **Organization:** Local folders by plant name with sequential filenames
- **Infrastructure:** Supabase free tier, expected traffic ~5-10 visits/month

---

## 1. DATABASE SCHEMA

### Table: `plants`
```sql
CREATE TABLE plants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  planta_id TEXT UNIQUE NOT NULL,           -- Planta API plant ID
  localized_name TEXT NOT NULL,             -- From names.localizedName
  variety TEXT,                             -- From names.variety
  custom_name TEXT,                         -- From names.custom (display priority)
  scientific_name TEXT,                     -- From names.scientific
  location TEXT,                            -- From site.name
  is_active BOOLEAN DEFAULT true,           -- Manual management only
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_plants_planta_id ON plants(planta_id);
CREATE INDEX idx_plants_active ON plants(is_active);
```

**Display Name Logic:**
- Homepage + Detail page: Show `custom_name` if exists, else `localized_name`
- Detail page metadata: Also show location, variety, scientific_name

**Photo Sorting:**
```sql
-- Newest → Oldest: API photos first, then historical photos
ORDER BY planta_last_updated DESC NULLS LAST, display_order ASC
```

### Table: `photos`
```sql
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plant_id UUID REFERENCES plants(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,               -- Supabase Storage path
  photo_url TEXT NOT NULL,                  -- Public URL
  source TEXT NOT NULL,                     -- 'planta' or 'historical'
  planta_image_url TEXT,                    -- Original Planta URL (for deduplication)
  planta_last_updated TIMESTAMPTZ,          -- From image.lastUpdated
  display_order INTEGER,                    -- For historical photos (based on filename)
  taken_at TIMESTAMPTZ,                     -- Photo date (NULL in MVP, manual later)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_photos_plant_id ON photos(plant_id);
CREATE INDEX idx_photos_source ON photos(source);
CREATE INDEX idx_photos_planta_url ON photos(planta_image_url);
```

### Table: `sync_tokens`
```sql
CREATE TABLE sync_tokens (
  id INTEGER PRIMARY KEY DEFAULT 1,         -- Only one row
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);
```

### Schema Design Rationale
- **Simple 2-table core** (plants + photos) with clear one-to-many relationship
- **Multiple name fields** preserve all Planta data while allowing custom names priority
- **`source` field** distinguishes historical vs. Planta photos
- **`planta_image_url`** enables deduplication of Planta syncs (not cross-checked with historical)
- **`is_active` flag** manually managed (no auto-detection in MVP)
- **`display_order`** preserves sequential filename ordering for historical photos
- **No `sync_logs` table** - sync results returned in API response instead

---

## 2. SUPABASE STORAGE STRUCTURE

### Bucket: `plant-photos` (Public bucket)
```
plant-photos/
├── historical/
│   ├── monstera-mini-02/
│   │   ├── 01.jpeg
│   │   ├── 02.jpeg
│   │   └── ...
│   └── banana-plant/
│       ├── 01.jpeg
│       └── ...
└── planta/
    ├── <plant-id>-<timestamp>.webp
    └── ...
```

**Example Planta photo:**
`planta/AGgNjeR6DBP-2025-06-29T00-22-14-333Z.webp` (colons sanitized)

**File Format Strategy:**
- Historical photos: `.jpeg` (keep originals)
- Planta photos: `.webp` (no conversion, more efficient)
- Next.js `<Image>` component handles both seamlessly

### Storage Settings
- Make bucket public (no auth required for reads)
- Set up automatic image transformation (Supabase CDN)

---

## 3. PROJECT STRUCTURE

```
plantfolio/
├── app/
│   ├── layout.tsx                   # Root layout
│   ├── page.tsx                     # Homepage (gallery grid)
│   ├── plants/
│   │   └── [id]/
│   │       └── page.tsx             # Individual plant detail page
│   └── api/
│       ├── sync/
│       │   └── route.ts             # Manual sync endpoint (call via Postman/curl)
│       └── refresh-token/
│           └── route.ts             # Token refresh logic
├── components/
│   ├── PlantCard.tsx                # Gallery card component
│   ├── PlantGallery.tsx             # Grid layout wrapper
│   └── PhotoTimeline.tsx            # Photo timeline on detail page
├── lib/
│   ├── supabase.ts                  # Supabase client setup
│   ├── planta-api.ts                # Planta API client
│   └── utils.ts                     # Helper functions
├── scripts/
│   ├── backfill-historical.ts       # One-time upload script
│   └── folder-to-plant-mapping.json # Manual mapping file (committed to git)
├── types/
│   └── index.ts                     # TypeScript types (single file for MVP)
├── next.config.js                    # Next.js config (image domains, etc.)
├── .env.local                        # Environment variables
└── package.json
```

---

## 4. API ARCHITECTURE & DATA FLOW

### A. Initial Data Backfill (One-time)
```
Historical Photos → Run Script → Supabase Storage → Update photos table → Summary Report
```

**Process:**
1. Script reads local folders (`historical-plant-photos/`)
2. Script reads manual mapping file (`folder-to-plant-mapping.json`)
3. For each folder:
   - Look up plant ID in mapping file
   - Check file sizes, warn if any photo >5MB
   - Upload photos to `plant-photos/historical/{folder-name}/`
   - Insert records into `photos` table with `source='historical'` and `display_order`
4. Print summary report: plants processed, photos uploaded, warnings, errors

**Mapping File Format:**
```json
{
  "monstera-mini-02": "AGgNjeR6DBPulEj10k8qDWnjB9f1:mJIowlpRRvKk6KO2RJhkpA",
  "banana-plant": "AGgNjeR6DBPulEj10k8qDWnjB9f1:SHsQGioEToywjhhNjQ6nUg"
}
```

### B. Planta API Sync Flow
```
Manual API Call → /api/sync → Fetch Planta API → Compare & Insert → Update DB → Return Results
```

**Process:**
1. Manual trigger via Postman/curl to `/api/sync` endpoint
2. Check token expiration → refresh if <1 hour remaining
3. Paginate through `/v1/addedPlants` endpoint (no rate limiting delays)
4. For each plant:
   - **If plant doesn't exist:** Insert new plant record
   - **If plant exists:** Skip (don't overwrite existing metadata)
   - Check if `image.url` already exists in `photos` table
   - If new photo: Download → Upload to Supabase Storage → Insert photo record
5. Return JSON response: `{ success: true, plants_synced: 48, photos_added: 3, errors: [] }`

**Note:** No inactive plant detection in MVP (manual management via Supabase dashboard)

### C. Frontend Data Flow
```
User visits homepage → Fetch plants (WHERE is_active = true) → Display gallery
User clicks plant → Fetch plant + photos → Display timeline
```

**Homepage:** Load most recent photo overall (from either source)
**Detail Page:** Load all photos at once (no lazy loading, even for 20+ photos)

---

## 5. KEY TECHNICAL DECISIONS

### Q1: Database Schema
✅ **Decided:** 3 tables: `plants`, `photos`, `sync_tokens`

### Q2: API Rate Limiting
**MVP Strategy:**
- No throttling delays - sync runs as fast as possible
- Only retry on 429 errors (exponential backoff: 1s, 2s, 4s)
- Rationale: Manual syncing is infrequent, unlikely to hit rate limits

### Q3: Image Optimization
**MVP Strategy:**
- Store original images (no compression)
- Warn during backfill if any photo >5MB
- Serve via Next.js `<Image>` component (automatic optimization)
- Rely on Supabase CDN for caching

### Q4: Sync Strategy
- **MVP:** Manual API call to `/api/sync` (via Postman/curl, no UI button)
- **V2:** Vercel cron job (daily at 2am)

**Failure Handling:**
- Return errors in JSON response
- Continue processing all plants (no circuit breaker)
- Natural "resume" via deduplication (skip already-synced plants/photos)

### Q5: Token Security
- **Storage:** Supabase `sync_tokens` table (not exposed to client)
- **Access:** Only server-side API routes can read tokens
- **Refresh:** Check `expires_at` before each sync → refresh if <1 hour remaining

### Q6: Data Migration (Backfill Process)
**Approach:** Node.js script that runs once locally

**Steps:**
1. Read local folders: `fs.readdirSync('historical-plant-photos')`
2. Read mapping file: `folder-to-plant-mapping.json`
3. For each folder:
   - Look up `planta_id` from mapping file
   - Check file sizes (warn if >5MB)
   - Upload photos to Supabase Storage
   - Insert photo records with `display_order` based on filename

**Note:** Folder names don't need to match Planta names - handled by mapping file

### Q7: Error Handling
**API Failures:**
- Catch and return errors in sync response
- Continue processing all plants (no circuit breaker)

**Network Issues:**
- Retry with exponential backoff (3 attempts)
- If all retries fail, mark sync as partial and continue

**Data Inconsistencies:**
- Missing `image.url`? → Skip photo, add to errors array
- Duplicate `planta_id`? → Skip plant update (preserve existing data)

### Q8: Performance Concerns
**Loading strategy:**
- **Homepage:** ~53 images (1 per plant)
- **Detail page:** ~8 images average, some plants 20+
- **No lazy loading in MVP** - acceptable with low traffic

**Optimization:**
- Next.js `<Image>` handles lazy loading automatically
- Supabase CDN caches images
- Free tier bandwidth: 50GB/month (will use <1GB with 10 visits/month)

### Q9: Plant Metadata Management
**MVP Strategy:**
- Never overwrite existing plants (preserve local edits)
- Only insert new plants from Planta API
- Manual updates via Supabase dashboard if Planta data changes

### Q10: Inactive Plant Detection
**MVP Strategy:**
- Skip auto-detection entirely (manual management only)
- Gallery filters by `WHERE is_active = true`
- V2 can add smart detection with `last_seen_at` tracking

---

## 6. IMPLEMENTATION ROADMAP

**Note:** Milestone-based (not time-based). Complete each phase fully before moving to next.

### Phase 1: Foundation Setup

**Goal:** Set up all infrastructure and verify connections

**Tasks:**
1. Initialize Next.js project with TypeScript + Tailwind
2. Set up Supabase project
3. Create database schema (run SQL migrations)
4. Configure Supabase Storage bucket (`plant-photos`, public)
5. Set up environment variables
6. Configure Next.js image domains (`next.config.js`)

**Done Criteria:**
- ✅ Next.js dev server runs without errors
- ✅ Can connect to Supabase from Next.js
- ✅ All three tables exist in Supabase
- ✅ Storage bucket created and public

**Testing:** Run `npm run dev`, verify homepage loads, test Supabase connection

---

### Phase 2: Data Backfill

**Goal:** Upload all 412 historical photos to Supabase

**Tasks:**
1. Create manual mapping file (`folder-to-plant-mapping.json`)
2. Write backfill script with file size warnings and summary report
3. **TEST ON 2-3 FOLDERS FIRST**
4. Run full backfill (53 plants, 412 photos)
5. Manually insert Planta tokens into `sync_tokens` table
6. Verify data in Supabase dashboard

**Done Criteria:**
- ✅ All 412 photos uploaded to Supabase Storage
- ✅ All photo records in `photos` table with correct `display_order`
- ✅ No errors in backfill summary
- ✅ Tokens inserted

**Testing:** Verify photos in Supabase Storage UI, check photo records in database

---

### Phase 3: Frontend Development

**Goal:** Build gallery and detail pages with real data

**Tasks:**
1. Set up TypeScript types (`types/index.ts`)
2. Create Supabase client helper (`lib/supabase.ts`)
3. Build homepage gallery (`app/page.tsx`)
   - Fetch plants (WHERE is_active = true)
   - Display name (custom_name > localized_name) + most recent photo
4. Build `PlantCard` and `PhotoTimeline` components
5. Build plant detail page (`app/plants/[id]/page.tsx`)
   - Fetch plant + all photos
   - Display timeline (newest → oldest)
   - Show metadata (name, location, variety, scientific_name)
6. Make responsive (mobile-first)

**Done Criteria:**
- ✅ Homepage displays all 53 plants with thumbnails
- ✅ Plant names display correctly
- ✅ Detail page shows all photos for plant
- ✅ Photos sort correctly (API photos first, then historical)
- ✅ Responsive on mobile/tablet/desktop

**Testing:** Test with 5 plants first, verify sorting, test on mobile, test plant with 20+ photos

---

### Phase 4: Planta API Integration

**Goal:** Enable manual syncing of new photos from Planta

**Tasks:**
1. Create Planta API client (`lib/planta-api.ts`)
   - Token refresh logic (refresh if <1 hour remaining)
   - Paginated plant fetching
   - Photo download helper
   - Retry logic for 429 errors
2. Build `/api/sync` endpoint
   - Fetch all plants from Planta API
   - Insert new plants only (don't overwrite)
   - Detect new photos via URL comparison
   - Upload new photos with timestamped filenames
   - Return JSON response with results
3. Build `/api/refresh-token` endpoint
4. Test sync manually via Postman/curl

**Done Criteria:**
- ✅ Can call `/api/sync` successfully
- ✅ New plants inserted (if any)
- ✅ Existing plants not overwritten
- ✅ New photos detected and uploaded
- ✅ Duplicate photos skipped
- ✅ Token refresh works

**Testing:** Test token refresh separately, test sync with 1-2 plants, run sync twice to verify deduplication

---

### Phase 5: Polish & Deploy

**Goal:** Prepare for production and share

**Tasks:**
1. Add error boundaries and loading states
2. Add basic accessibility (alt text, keyboard nav)
3. Test on multiple browsers and mobile devices
4. Deploy to Vercel
5. Set up production environment variables in Vercel
6. Test sync in production
7. Verify all images load correctly
8. Share with friends/family!

**Done Criteria:**
- ✅ Site deployed to Vercel
- ✅ All images load in production
- ✅ Sync works in production
- ✅ No console errors
- ✅ Accessible (basic WCAG compliance)
- ✅ At least 3 people viewed site

**Testing:** Test on multiple devices, run Lighthouse audit (aim for >80), test sync in production

---

## 7. POTENTIAL PITFALLS & MITIGATION

**Ranked by severity/likelihood:** 🔴 HIGH | 🟡 MEDIUM | 🟢 LOW

### 🔴 HIGH Priority

#### Pitfall 1: Next.js Image Domain Configuration
- **Risk:** Supabase images won't load without whitelisting domain
- **Likelihood:** Very high (will definitely occur)
- **Mitigation:** Add to `next.config.js`:
  ```javascript
  module.exports = {
    images: {
      domains: ['your-project.supabase.co'],
    },
  }
  ```

#### Pitfall 2: Environment Variables in Production
- **Risk:** Site breaks in production if env vars not set in Vercel
- **Likelihood:** High (common deployment issue)
- **Mitigation:** Double-check all env vars in Vercel dashboard before deploying

#### Pitfall 3: Historical Photo → Plant Matching
- **Risk:** Folder names don't match Planta plant names
- **Likelihood:** High (already identified)
- **Mitigation:** Create manual mapping file (`folder-to-plant-mapping.json`)

#### Pitfall 4: Token Expiration Mid-Sync
- **Risk:** Token expires during sync (50+ plants)
- **Likelihood:** High if not refreshed
- **Mitigation:** Refresh if <1 hour remaining before sync starts

### 🟡 MEDIUM Priority

#### Pitfall 5: Photo Filename Variations
- **Risk:** Inconsistent naming (01.jpeg vs 1.jpeg vs IMG_001.jpeg)
- **Likelihood:** Medium
- **Mitigation:** Flexible parsing for `display_order` (extract first number found)

#### Pitfall 6: Folder Names with Special Characters
- **Risk:** Spaces, colons, etc. cause storage path issues
- **Likelihood:** Medium
- **Mitigation:** Sanitize folder names or use URL encoding

#### Pitfall 7: Database Connection Pooling
- **Risk:** Uploading 412 photos rapidly exhausts Supabase connections
- **Likelihood:** Medium
- **Mitigation:** Batch uploads (10 at a time with small delay)

#### Pitfall 8: Filename Timestamp Parsing
- **Risk:** Planta timestamps contain colons (invalid in some filesystems)
- **Likelihood:** Medium
- **Mitigation:** Replace colons: `2025-06-29T00:22:14.333Z` → `2025-06-29T00-22-14-333Z`

#### Pitfall 9: Supabase Storage Limits
- **Risk:** Exceed 1GB free tier storage
- **Likelihood:** Medium
- **Current:** 412 photos × ~2MB = ~800MB (safe for now)
- **Mitigation:** Backfill warns if photos >5MB

#### Pitfall 10: Duplicate Photo Detection
- **Risk:** Same Planta photo synced multiple times
- **Likelihood:** Medium (if deduplication has bugs)
- **Mitigation:** Check `planta_image_url` before inserting

### 🟢 LOW Priority

#### Pitfall 11: Pagination Cursor Expiration
- **Risk:** Planta API cursor expires during sync
- **Likelihood:** Low (sync is fast with no delays)

#### Pitfall 12: Missing Photos in Planta API
- **Risk:** Plant exists but `image.url` is null
- **Likelihood:** Low
- **Mitigation:** Skip photo, add to errors array

#### Pitfall 13: Vercel Function Timeout
- **Risk:** `/api/sync` takes >10s (Vercel hobby tier limit)
- **Likelihood:** Low (with no rate limiting)
- **Mitigation:** Process in batches if needed

#### Pitfall 14: Plant Metadata Conflicts
- **Risk:** Planta updates data but we don't see it
- **Likelihood:** Low (Planta rarely changes metadata)
- **Mitigation:** Manually update in Supabase dashboard

#### Pitfall 15: Large Photo Collections
- **Risk:** Plants with 20+ photos slow down detail page
- **Likelihood:** Low (Next.js handles optimization)
- **Mitigation:** Acceptable for MVP, add lazy loading in V2 if needed

#### Pitfall 16: Planta API Structure Changes
- **Risk:** Planta changes field names or nesting
- **Likelihood:** Low
- **Mitigation:** Robust error handling for missing/unexpected fields

---

## 8. ENVIRONMENT VARIABLES

```env
# .env.local (development)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
PLANTA_API_BASE_URL=https://api.planta.app/v1
```

**Production (Vercel):**
- Set same variables in Vercel dashboard (Settings → Environment Variables)
- Mark `NEXT_PUBLIC_*` as "Production", "Preview", and "Development"
- Mark `SUPABASE_SERVICE_ROLE_KEY` as "Production" only (sensitive)

---

## 9. MVP FEATURE CHECKLIST

### Must-Have Features
- [ ] Homepage plant gallery
- [ ] Plant detail page with photo timeline
- [ ] Planta API sync (manual trigger via API call)
- [ ] Historical photo upload with summary report and file size warnings
- [ ] Responsive design
- [ ] Basic accessibility

### Nice-to-Have (Not in MVP)
- [ ] Search/filter
- [ ] Sorting options
- [ ] Photo comments/notes
- [ ] Stats dashboard
- [ ] Automated cron sync
- [ ] Image optimization
- [ ] User authentication
- [ ] Admin UI with sync button
- [ ] Inactive plant auto-detection
- [ ] Smart plant metadata merging
- [ ] Lazy loading for photos

---

## 10. QUICK START COMMANDS

```bash
# 1. Initialize project
npx create-next-app@latest plantfolio --typescript --tailwind --app
cd plantfolio

# 2. Install dependencies
npm install @supabase/supabase-js

# 3. Create Supabase project at supabase.com
# 4. Run SQL migrations in Supabase SQL Editor
# 5. Upload tokens manually to sync_tokens table
# 6. Create folder-to-plant-mapping.json
# 7. Run backfill script
npm run backfill

# 8. Start dev server
npm run dev

# 9. Test sync manually
curl -X POST http://localhost:3000/api/sync

# 10. Deploy to Vercel
vercel deploy
```

---

## 11. KEY DECISIONS SUMMARY

### Architecture Review (2025-11-03)

**Database:**
- 3 tables (removed sync_logs)
- Multiple name fields (custom_name gets priority)
- Manual inactive plant management

**Storage:**
- Keep original folder structure for historical photos
- Mixed formats (.jpeg + .webp)
- Timestamped filenames for Planta photos

**Data Flow:**
- Manual mapping file for backfill (no auto-matching)
- Never overwrite existing plants (preserve local edits)
- No inactive plant auto-detection

**Sync:**
- No rate limiting delays (only retry on 429)
- No circuit breaker (process all plants)
- No UI button (manual API calls)
- Return JSON response (no sync_logs table)

**Frontend:**
- Load all photos at once (no lazy loading)
- Most recent photo overall for homepage thumbnails
- Milestone-based roadmap (not time-based)

---

## 12. REVISION HISTORY

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-11-02 | Initial architecture plan | Claude Code |
| 8.0 | 2025-11-03 | Final reviewed version with all decisions incorporated | Claude Code |

---

## NEXT STEPS

**You're ready to start implementing!** Begin with Phase 1: Foundation Setup.

Recommended first actions:
1. Create new Next.js project
2. Set up Supabase account and project
3. Run database migrations
4. Test connection between Next.js and Supabase

Good luck! 🌿
