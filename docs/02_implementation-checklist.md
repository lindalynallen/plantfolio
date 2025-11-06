# PLANTFOLIO MVP - IMPLEMENTATION CHECKLIST

**Version:** 1.0
**Date:** 2025-11-03
**Status:** Ready for Development

---

## How to Use This Checklist

- Each EPIC represents a major milestone in the project
- Tasks within EPICs are ordered by dependencies
- Check off `[ ]` boxes as you complete tasks
- Reference the main architecture plan (`01_architecture-spec.md`) for detailed specifications
- Test frequently - don't wait until the end of an EPIC to verify things work

---

## EPIC 1: Foundation Setup

**Goal:** Set up all infrastructure and verify connections work

**Estimated Effort:** 2-4 hours

**Prerequisites:** None

---

### Task 1.1: Initialize Next.js Project
- [ ] Run `npx create-next-app@latest plantfolio --typescript --tailwind --app`
- [ ] Navigate into project: `cd plantfolio`
- [ ] Verify dev server runs: `npm run dev`
- [ ] Open browser to `http://localhost:3000` - should see Next.js welcome page

**Acceptance Criteria:**
- ✅ Project created with TypeScript + Tailwind + App Router
- ✅ Dev server starts without errors
- ✅ Homepage loads in browser

---

### Task 1.2: Install Supabase Client
- [ ] Install Supabase JS client: `npm install @supabase/supabase-js`
- [ ] Verify package appears in `package.json` dependencies

**Acceptance Criteria:**
- ✅ Supabase package installed
- ✅ No installation errors

---

### Task 1.3: Create Supabase Project
- [ ] Go to https://supabase.com and sign up/log in
- [ ] Click "New Project"
- [ ] Choose organization (or create one)
- [ ] Name project: `plantfolio` (or your preferred name)
- [ ] Generate strong database password (save it securely!)
- [ ] Choose region (closest to you)
- [ ] Click "Create new project"
- [ ] Wait for provisioning (~2 minutes)

**Acceptance Criteria:**
- ✅ Supabase project created
- ✅ Can access project dashboard
- ✅ Database password saved securely

---

### Task 1.4: Set Up Environment Variables
- [ ] In Supabase dashboard, go to Settings → API
- [ ] Copy "Project URL" and "anon public" key
- [ ] In your Next.js project, create `.env.local` file
- [ ] Add the following:
  ```env
  NEXT_PUBLIC_SUPABASE_URL=your-project-url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
  SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
  PLANTA_API_BASE_URL=https://api.planta.app/v1
  ```
- [ ] Copy service role key from same page (Settings → API → service_role)
- [ ] Verify `.env.local` is in your `.gitignore` (Next.js adds this by default)
- [ ] Restart dev server

**Acceptance Criteria:**
- ✅ `.env.local` file created with all 4 variables
- ✅ File is gitignored
- ✅ Dev server restarts successfully

---

### Task 1.5: Configure Next.js Image Domains
- [ ] Open or create `next.config.js` in project root
- [ ] Add Supabase domain to image configuration:
  ```javascript
  /** @type {import('next').NextConfig} */
  const nextConfig = {
    images: {
      domains: ['YOUR_PROJECT_REF.supabase.co'], // Replace with your actual project ref
    },
  }

  module.exports = nextConfig
  ```
- [ ] Replace `YOUR_PROJECT_REF` with your actual Supabase project reference (from project URL)
- [ ] Restart dev server

**Acceptance Criteria:**
- ✅ `next.config.js` created
- ✅ Supabase domain added to allowed image domains
- ✅ No errors when restarting server

---

### Task 1.6: Create Database Schema
- [ ] Go to Supabase dashboard → SQL Editor
- [ ] Click "New query"
- [ ] Copy and paste the following schema:

```sql
-- Create plants table
CREATE TABLE plants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  planta_id TEXT UNIQUE NOT NULL,
  localized_name TEXT NOT NULL,
  variety TEXT,
  custom_name TEXT,
  scientific_name TEXT,
  location TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_plants_planta_id ON plants(planta_id);
CREATE INDEX idx_plants_active ON plants(is_active);

-- Create photos table
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plant_id UUID REFERENCES plants(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  photo_url TEXT NOT NULL,
  source TEXT NOT NULL,
  planta_image_url TEXT,
  planta_last_updated TIMESTAMPTZ,
  display_order INTEGER,
  taken_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_photos_plant_id ON photos(plant_id);
CREATE INDEX idx_photos_source ON photos(source);
CREATE INDEX idx_photos_planta_url ON photos(planta_image_url);

-- Create sync_tokens table
CREATE TABLE sync_tokens (
  id INTEGER PRIMARY KEY DEFAULT 1,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);
```

- [ ] Click "Run" to execute the SQL
- [ ] Verify no errors appear
- [ ] Go to Table Editor to confirm all 3 tables exist

**Acceptance Criteria:**
- ✅ All 3 tables created successfully
- ✅ Indexes created
- ✅ Tables visible in Supabase Table Editor

---

### Task 1.7: Create Supabase Storage Bucket
- [ ] In Supabase dashboard, go to Storage
- [ ] Click "New bucket"
- [ ] Name: `plant-photos`
- [ ] Make it **public** (toggle on)
- [ ] Click "Create bucket"
- [ ] Verify bucket appears in storage list

**Acceptance Criteria:**
- ✅ `plant-photos` bucket created
- ✅ Bucket is public
- ✅ Bucket visible in storage section

---

### Task 1.8: Test Supabase Connection
- [ ] Create `lib/supabase.ts` file:
  ```typescript
  import { createClient } from '@supabase/supabase-js'

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  export const supabase = createClient(supabaseUrl, supabaseAnonKey)
  ```
- [ ] Create test API route: `app/api/test-db/route.ts`:
  ```typescript
  import { NextResponse } from 'next/server'
  import { supabase } from '@/lib/supabase'

  export async function GET() {
    const { data, error } = await supabase.from('plants').select('count')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Database connection works!', data })
  }
  ```
- [ ] Visit `http://localhost:3000/api/test-db` in browser
- [ ] Should see: `{"success":true,"message":"Database connection works!","data":[]}`

**Acceptance Criteria:**
- ✅ Supabase client created
- ✅ Test API route works
- ✅ No connection errors

---

### Task 1.9: Create TypeScript Types
- [ ] Create `types/index.ts` file:
  ```typescript
  export interface Plant {
    id: string
    planta_id: string
    localized_name: string
    variety: string | null
    custom_name: string | null
    scientific_name: string | null
    location: string | null
    is_active: boolean
    created_at: string
    updated_at: string
  }

  export interface Photo {
    id: string
    plant_id: string
    storage_path: string
    photo_url: string
    source: 'planta' | 'historical'
    planta_image_url: string | null
    planta_last_updated: string | null
    display_order: number | null
    taken_at: string | null
    created_at: string
  }

  export interface SyncToken {
    id: number
    access_token: string
    refresh_token: string
    expires_at: string
    updated_at: string
  }

  export interface SyncResponse {
    success: boolean
    plants_synced: number
    photos_added: number
    errors: Array<{ plant_id: string; message: string }>
  }
  ```

**Acceptance Criteria:**
- ✅ Types file created
- ✅ No TypeScript errors

---

### ✅ EPIC 1 COMPLETION CHECKLIST
- [ ] Next.js project running on localhost
- [ ] Supabase project created
- [ ] Environment variables configured
- [ ] Database tables created
- [ ] Storage bucket created
- [ ] Database connection tested and working
- [ ] TypeScript types defined

---

## EPIC 2: Historical Photo Backfill

**Goal:** Upload all 412 historical photos to Supabase with proper organization

**Estimated Effort:** 4-6 hours

**Prerequisites:** EPIC 1 complete

---

### Task 2.1: Create Folder-to-Plant Mapping File
- [ ] In your local `historical-plant-photos/` folder, list all folder names
- [ ] Go to Planta API response (`response_1762222571157.json`) or call Planta API
- [ ] Create `scripts/folder-to-plant-mapping.json`:
  ```json
  {
    "folder-name-1": "planta-id-1",
    "folder-name-2": "planta-id-2"
  }
  ```
- [ ] For each folder, manually find the corresponding plant ID from Planta API
- [ ] Fill in all 53 mappings

**Acceptance Criteria:**
- ✅ Mapping file created with all 53 entries
- ✅ File committed to git
- ✅ Valid JSON format (no syntax errors)

**Note:** This is manual work but only needs to be done once. Take your time!

---

### Task 2.2: Insert Plant Records from Planta API
- [ ] Open Planta API response file or fetch fresh data
- [ ] For each plant in the API response, manually insert into Supabase:
  - Go to Supabase → Table Editor → plants
  - Click "Insert row"
  - Fill in fields:
    - `planta_id`: from API `id` field
    - `localized_name`: from API `names.localizedName`
    - `variety`: from API `names.variety`
    - `custom_name`: from API `names.custom`
    - `scientific_name`: from API `names.scientific`
    - `location`: from API `site.name`
    - `is_active`: true (default)
  - Click "Save"
- [ ] Repeat for all 53 plants

**Alternative (recommended):**
- [ ] Write a quick script to parse the JSON and insert via SQL
- [ ] Run once in Supabase SQL Editor

**Acceptance Criteria:**
- ✅ All 53 plant records in database
- ✅ All fields populated correctly
- ✅ Can query plants table and see all records

**Note:** This prepares the database for the backfill script to reference plant IDs

---

### Task 2.3: Write Backfill Script - Setup
- [ ] Create `scripts/backfill-historical.ts`:
  ```typescript
  import { createClient } from '@supabase/supabase-js'
  import * as fs from 'fs'
  import * as path from 'path'

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  const HISTORICAL_PHOTOS_DIR = '../historical-plant-photos' // Adjust path
  const MAPPING_FILE = './folder-to-plant-mapping.json'

  interface FolderMapping {
    [folderName: string]: string // plantaId
  }

  async function main() {
    console.log('🌿 Starting historical photo backfill...\n')

    // Load mapping file
    const mapping: FolderMapping = JSON.parse(
      fs.readFileSync(MAPPING_FILE, 'utf-8')
    )

    console.log(`📋 Loaded mapping for ${Object.keys(mapping).length} folders\n`)

    // TODO: Implement backfill logic
  }

  main()
  ```
- [ ] Add script to `package.json`:
  ```json
  "scripts": {
    "backfill": "tsx scripts/backfill-historical.ts"
  }
  ```
- [ ] Install tsx: `npm install -D tsx`

**Acceptance Criteria:**
- ✅ Script file created
- ✅ Can run `npm run backfill` without errors
- ✅ Mapping file loads successfully

---

### Task 2.4: Write Backfill Script - Core Logic
- [ ] Implement folder iteration logic
- [ ] For each folder:
  - Get plant ID from mapping
  - List all files in folder (only .jpeg/.jpg)
  - Sort files by name
  - For each file:
    - Check file size (warn if >5MB)
    - Extract display_order from filename (e.g., "01.jpeg" → 1)
    - Upload to Supabase Storage: `historical/{folder-name}/{filename}`
    - Get public URL
    - Insert photo record into database
  - Track warnings and errors
- [ ] Add progress logging (console.log for each folder/file)

**Key Code Snippets:**

```typescript
// Upload file to storage
const fileBuffer = fs.readFileSync(filePath)
const storagePath = `historical/${folderName}/${filename}`

const { data: uploadData, error: uploadError } = await supabase
  .storage
  .from('plant-photos')
  .upload(storagePath, fileBuffer, {
    contentType: 'image/jpeg',
    upsert: false
  })

if (uploadError) {
  console.error(`❌ Failed to upload ${filename}:`, uploadError.message)
  errors.push({ file: filename, error: uploadError.message })
  continue
}

// Get public URL
const { data: urlData } = supabase
  .storage
  .from('plant-photos')
  .getPublicUrl(storagePath)

// Insert photo record
const { error: insertError } = await supabase
  .from('photos')
  .insert({
    plant_id: plantId,
    storage_path: storagePath,
    photo_url: urlData.publicUrl,
    source: 'historical',
    display_order: displayOrder,
    planta_image_url: null,
    planta_last_updated: null,
    taken_at: null
  })
```

**Acceptance Criteria:**
- ✅ Script uploads files to Supabase Storage
- ✅ Script inserts photo records into database
- ✅ Progress logged to console
- ✅ Errors captured and displayed

---

### Task 2.5: Write Backfill Script - File Size Warnings
- [ ] Before uploading each file, check size:
  ```typescript
  const stats = fs.statSync(filePath)
  const fileSizeInMB = stats.size / (1024 * 1024)

  if (fileSizeInMB > 5) {
    console.warn(`⚠️  Large file: ${filename} (${fileSizeInMB.toFixed(2)}MB)`)
    warnings.push(`${filename} is ${fileSizeInMB.toFixed(2)}MB`)
  }
  ```

**Acceptance Criteria:**
- ✅ Large files (>5MB) trigger warnings
- ✅ Warnings tracked in summary

---

### Task 2.6: Write Backfill Script - Summary Report
- [ ] Track counters throughout script:
  - `foldersProcessed`
  - `photosUploaded`
  - `warnings` (array)
  - `errors` (array)
- [ ] At end of script, print summary:
  ```typescript
  console.log('\n✅ Backfill Complete!\n')
  console.log(`📁 Folders processed: ${foldersProcessed}`)
  console.log(`📸 Photos uploaded: ${photosUploaded}`)
  console.log(`⚠️  Warnings: ${warnings.length}`)
  console.log(`❌ Errors: ${errors.length}`)

  if (warnings.length > 0) {
    console.log('\nWarnings:')
    warnings.forEach(w => console.log(`  - ${w}`))
  }

  if (errors.length > 0) {
    console.log('\nErrors:')
    errors.forEach(e => console.log(`  - ${e.file}: ${e.error}`))
  }
  ```

**Acceptance Criteria:**
- ✅ Summary prints at end
- ✅ All stats accurate
- ✅ Warnings and errors listed

---

### Task 2.7: Test Backfill on Sample Folders
- [ ] Choose 2-3 plant folders (small ones, maybe 5-10 photos each)
- [ ] Temporarily modify script to only process these folders
- [ ] Run `npm run backfill`
- [ ] Verify in Supabase:
  - Photos appear in Storage under `historical/{folder-name}/`
  - Photo records in `photos` table
  - `display_order` is correct (matches filename sequence)
  - Public URLs work (click one and see if image loads)
- [ ] Delete test data if successful

**Acceptance Criteria:**
- ✅ Test folders upload successfully
- ✅ Photos visible in Supabase Storage
- ✅ Photo records correct in database
- ✅ No errors in test run

---

### Task 2.8: Run Full Backfill
- [ ] Remove test limitations from script (process all folders)
- [ ] Run `npm run backfill` for full 412 photos
- [ ] Monitor console output for errors
- [ ] Wait for completion (may take 10-30 minutes depending on file sizes)
- [ ] Review summary report
- [ ] Check Supabase:
  - Storage usage (should be ~800MB)
  - Photo count in database (should be 412)

**Acceptance Criteria:**
- ✅ All 412 photos uploaded
- ✅ All photo records in database
- ✅ No critical errors
- ✅ Summary report looks correct

**Troubleshooting:**
- If you hit connection errors: Add delays between uploads
- If files fail: Check file permissions and paths
- If storage fills up: Check for duplicate uploads or very large files

---

### Task 2.9: Manually Insert Planta Tokens
- [ ] Obtain your Planta API access token and refresh token
- [ ] Calculate token expiration timestamp (usually provided by API or check JWT)
- [ ] Go to Supabase → Table Editor → sync_tokens
- [ ] Click "Insert row"
- [ ] Fill in:
  - `id`: 1 (must be 1 due to constraint)
  - `access_token`: your access token
  - `refresh_token`: your refresh token
  - `expires_at`: timestamp when token expires
- [ ] Click "Save"
- [ ] Verify row appears in table

**Acceptance Criteria:**
- ✅ Token row inserted successfully
- ✅ All fields populated
- ✅ Can query tokens table

---

### Task 2.10: Verify Backfill Data
- [ ] In Supabase Table Editor, check plants table:
  - Should have 53 rows
  - All fields populated correctly
- [ ] Check photos table:
  - Should have 412 rows
  - All `source` fields = 'historical'
  - `display_order` values look correct
  - `photo_url` fields populated
- [ ] Check Storage:
  - Browse `plant-photos/historical/` folder
  - Spot-check a few folders to ensure photos uploaded
  - Click on a photo to verify it displays

**Acceptance Criteria:**
- ✅ 53 plants in database
- ✅ 412 photos in database
- ✅ All photos visible in Storage
- ✅ Sample photos load correctly

---

### ✅ EPIC 2 COMPLETION CHECKLIST
- [ ] Mapping file created with all 53 entries
- [ ] Backfill script written and tested
- [ ] All 412 historical photos uploaded to Supabase Storage
- [ ] All 412 photo records in database with correct metadata
- [ ] Planta tokens inserted into database
- [ ] Data verified in Supabase dashboard
- [ ] Summary report shows success

---

## EPIC 3: Frontend - Homepage Gallery

**Goal:** Build a responsive homepage that displays all plants in a grid

**Estimated Effort:** 3-5 hours

**Prerequisites:** EPIC 2 complete (data in database)

---

### Task 3.1: Create Utility Functions
- [ ] Create `lib/utils.ts`:
  ```typescript
  import { Plant } from '@/types'

  /**
   * Get display name for a plant (custom_name takes priority)
   */
  export function getPlantDisplayName(plant: Plant): string {
    return plant.custom_name || plant.localized_name
  }

  /**
   * Format date to readable string
   */
  export function formatDate(dateString: string | null): string {
    if (!dateString) return 'Unknown date'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  ```

**Acceptance Criteria:**
- ✅ Utils file created
- ✅ Helper functions defined
- ✅ No TypeScript errors

---

### Task 3.2: Fetch Plants on Homepage
- [ ] Open `app/page.tsx`
- [ ] Replace contents with:
  ```typescript
  import { supabase } from '@/lib/supabase'
  import { Plant } from '@/types'

  export const revalidate = 3600 // Revalidate every hour

  export default async function HomePage() {
    // Fetch all active plants
    const { data: plants, error } = await supabase
      .from('plants')
      .select('*')
      .eq('is_active', true)
      .order('localized_name', { ascending: true })

    if (error) {
      console.error('Error fetching plants:', error)
      return <div>Error loading plants</div>
    }

    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">My Plant Collection</h1>
        <p className="text-gray-600 mb-8">
          {plants?.length || 0} plants
        </p>
        {/* Grid will go here */}
        <pre>{JSON.stringify(plants, null, 2)}</pre>
      </main>
    )
  }
  ```
- [ ] Visit `http://localhost:3000`
- [ ] Should see JSON dump of all plants

**Acceptance Criteria:**
- ✅ Homepage fetches plants from database
- ✅ Plants data displays (even if just JSON)
- ✅ No errors in console

---

### Task 3.3: Fetch Thumbnail Photo for Each Plant
- [ ] Update homepage query to include most recent photo:
  ```typescript
  const { data: plants, error } = await supabase
    .from('plants')
    .select(`
      *,
      photos (
        id,
        photo_url,
        planta_last_updated,
        display_order
      )
    `)
    .eq('is_active', true)
    .order('localized_name', { ascending: true })
  ```
- [ ] For each plant, find most recent photo (Planta photos first, then historical):
  ```typescript
  function getMostRecentPhoto(plant: any) {
    if (!plant.photos || plant.photos.length === 0) return null

    // Sort: Planta photos first (by planta_last_updated DESC), then historical (by display_order ASC)
    const sorted = [...plant.photos].sort((a, b) => {
      if (a.planta_last_updated && b.planta_last_updated) {
        return new Date(b.planta_last_updated).getTime() - new Date(a.planta_last_updated).getTime()
      }
      if (a.planta_last_updated) return -1
      if (b.planta_last_updated) return 1
      return (a.display_order || 999) - (b.display_order || 999)
    })

    return sorted[0]?.photo_url || null
  }
  ```

**Acceptance Criteria:**
- ✅ Query includes photos
- ✅ Most recent photo logic works
- ✅ Each plant has a thumbnail URL

---

### Task 3.4: Create PlantCard Component
- [ ] Create `components/PlantCard.tsx`:
  ```typescript
  import Image from 'next/image'
  import Link from 'next/link'
  import { Plant } from '@/types'
  import { getPlantDisplayName } from '@/lib/utils'

  interface PlantCardProps {
    plant: Plant
    thumbnailUrl: string | null
  }

  export function PlantCard({ plant, thumbnailUrl }: PlantCardProps) {
    const displayName = getPlantDisplayName(plant)

    return (
      <Link href={`/plants/${plant.id}`}>
        <div className="group cursor-pointer border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
          {/* Image */}
          <div className="relative aspect-square bg-gray-100">
            {thumbnailUrl ? (
              <Image
                src={thumbnailUrl}
                alt={displayName}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No photo
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-1">{displayName}</h3>
            {plant.location && (
              <p className="text-sm text-gray-600">{plant.location}</p>
            )}
          </div>
        </div>
      </Link>
    )
  }
  ```

**Acceptance Criteria:**
- ✅ Component created
- ✅ Displays plant image and name
- ✅ Links to detail page
- ✅ Handles missing photos gracefully

---

### Task 3.5: Build Plant Grid Layout
- [ ] Update `app/page.tsx` to use PlantCard:
  ```typescript
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {plants?.map((plant) => {
      const thumbnailUrl = getMostRecentPhoto(plant)
      return (
        <PlantCard
          key={plant.id}
          plant={plant}
          thumbnailUrl={thumbnailUrl}
        />
      )
    })}
  </div>
  ```

**Acceptance Criteria:**
- ✅ Plants display in grid
- ✅ Grid is responsive (1 col mobile, 2-4 cols desktop)
- ✅ All 53 plants visible

---

### Task 3.6: Add Loading State
- [ ] Create `app/loading.tsx`:
  ```typescript
  export default function Loading() {
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">My Plant Collection</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="border rounded-lg overflow-hidden">
              <div className="aspect-square bg-gray-200 animate-pulse" />
              <div className="p-4">
                <div className="h-6 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </main>
    )
  }
  ```

**Acceptance Criteria:**
- ✅ Loading skeleton displays while data fetches
- ✅ Skeleton matches card layout

---

### Task 3.7: Add Error Boundary
- [ ] Create `app/error.tsx`:
  ```typescript
  'use client'

  export default function Error({
    error,
    reset,
  }: {
    error: Error & { digest?: string }
    reset: () => void
  }) {
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4">Something went wrong!</h1>
        <p className="text-gray-600 mb-4">{error.message}</p>
        <button
          onClick={reset}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Try again
        </button>
      </main>
    )
  }
  ```

**Acceptance Criteria:**
- ✅ Error boundary catches errors
- ✅ User-friendly error message
- ✅ Retry button works

---

### Task 3.8: Test Homepage Responsiveness
- [ ] Open browser dev tools
- [ ] Test at different breakpoints:
  - Mobile (375px): 1 column
  - Tablet (768px): 2-3 columns
  - Desktop (1024px+): 4 columns
- [ ] Verify images load and scale properly
- [ ] Check text doesn't overflow

**Acceptance Criteria:**
- ✅ Layout works on all screen sizes
- ✅ Images display correctly
- ✅ No horizontal scroll

---

### Task 3.9: Add Basic Styling and Polish
- [ ] Update layout.tsx with better styling:
  ```typescript
  export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <html lang="en">
        <body className="bg-gray-50 min-h-screen">
          <header className="bg-white border-b">
            <div className="container mx-auto px-4 py-6">
              <h1 className="text-2xl font-bold text-green-700">
                🌿 Plantfolio
              </h1>
            </div>
          </header>
          {children}
        </body>
      </html>
    )
  }
  ```
- [ ] Adjust colors and spacing to your preference

**Acceptance Criteria:**
- ✅ Site has consistent header
- ✅ Colors and typography look good
- ✅ Overall design is clean

---

### ✅ EPIC 3 COMPLETION CHECKLIST
- [ ] Homepage displays all 53 plants in grid
- [ ] Each plant card shows thumbnail and name
- [ ] Custom names take priority over localized names
- [ ] Grid is responsive on mobile/tablet/desktop
- [ ] Loading state works
- [ ] Error boundary works
- [ ] Overall design looks polished

---

## EPIC 4: Frontend - Plant Detail Page

**Goal:** Build individual plant pages with full photo timelines

**Estimated Effort:** 3-5 hours

**Prerequisites:** EPIC 3 complete

---

### Task 4.1: Create Plant Detail Page Route
- [ ] Create `app/plants/[id]/page.tsx`:
  ```typescript
  import { supabase } from '@/lib/supabase'
  import { notFound } from 'next/navigation'

  export const revalidate = 3600

  export default async function PlantDetailPage({
    params,
  }: {
    params: { id: string }
  }) {
    // Fetch plant
    const { data: plant, error: plantError } = await supabase
      .from('plants')
      .select('*')
      .eq('id', params.id)
      .eq('is_active', true)
      .single()

    if (plantError || !plant) {
      notFound()
    }

    // Fetch all photos for this plant
    const { data: photos, error: photosError } = await supabase
      .from('photos')
      .select('*')
      .eq('plant_id', params.id)
      .order('planta_last_updated', { ascending: false, nullsFirst: false })
      .order('display_order', { ascending: true })

    if (photosError) {
      console.error('Error fetching photos:', photosError)
    }

    return (
      <main className="container mx-auto px-4 py-8">
        <pre>{JSON.stringify({ plant, photos }, null, 2)}</pre>
      </main>
    )
  }
  ```
- [ ] Click on a plant card from homepage
- [ ] Should navigate to `/plants/[id]` and see JSON data

**Acceptance Criteria:**
- ✅ Detail page route works
- ✅ Plant data fetches
- ✅ All photos fetch
- ✅ 404 page shows for invalid plant IDs

---

### Task 4.2: Create Plant Header Component
- [ ] Create `components/PlantHeader.tsx`:
  ```typescript
  import Link from 'next/link'
  import { Plant } from '@/types'
  import { getPlantDisplayName } from '@/lib/utils'

  interface PlantHeaderProps {
    plant: Plant
  }

  export function PlantHeader({ plant }: PlantHeaderProps) {
    const displayName = getPlantDisplayName(plant)

    return (
      <div className="mb-8">
        {/* Back button */}
        <Link href="/" className="text-green-600 hover:underline mb-4 inline-block">
          ← Back to gallery
        </Link>

        {/* Plant info */}
        <h1 className="text-4xl font-bold mb-4">{displayName}</h1>

        <div className="space-y-2 text-gray-600">
          {plant.scientific_name && (
            <p className="italic">{plant.scientific_name}</p>
          )}
          {plant.variety && (
            <p>Variety: {plant.variety}</p>
          )}
          {plant.location && (
            <p>Location: {plant.location}</p>
          )}
        </div>
      </div>
    )
  }
  ```

**Acceptance Criteria:**
- ✅ Header displays plant name and metadata
- ✅ Back button navigates to homepage
- ✅ Handles missing fields gracefully

---

### Task 4.3: Create Photo Timeline Component
- [ ] Create `components/PhotoTimeline.tsx`:
  ```typescript
  import Image from 'next/image'
  import { Photo } from '@/types'
  import { formatDate } from '@/lib/utils'

  interface PhotoTimelineProps {
    photos: Photo[]
  }

  export function PhotoTimeline({ photos }: PhotoTimelineProps) {
    if (photos.length === 0) {
      return (
        <div className="text-center text-gray-500 py-12">
          No photos yet
        </div>
      )
    }

    return (
      <div>
        <h2 className="text-2xl font-bold mb-6">
          Photo Timeline ({photos.length} photos)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo) => (
            <div key={photo.id} className="border rounded-lg overflow-hidden">
              {/* Image */}
              <div className="relative aspect-square bg-gray-100">
                <Image
                  src={photo.photo_url}
                  alt={`Photo ${photo.id}`}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Metadata */}
              <div className="p-3 text-sm text-gray-600">
                {photo.planta_last_updated && (
                  <p>{formatDate(photo.planta_last_updated)}</p>
                )}
                <p className="text-xs">
                  Source: {photo.source === 'planta' ? '📱 Planta' : '📁 Historical'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  ```

**Acceptance Criteria:**
- ✅ Timeline displays all photos in grid
- ✅ Photos show date (if available)
- ✅ Source labeled (Planta vs Historical)
- ✅ Grid is responsive

---

### Task 4.4: Integrate Components in Detail Page
- [ ] Update `app/plants/[id]/page.tsx`:
  ```typescript
  import { PlantHeader } from '@/components/PlantHeader'
  import { PhotoTimeline } from '@/components/PhotoTimeline'

  // ... (keep existing fetch logic)

  return (
    <main className="container mx-auto px-4 py-8">
      <PlantHeader plant={plant} />
      <PhotoTimeline photos={photos || []} />
    </main>
  )
  ```

**Acceptance Criteria:**
- ✅ Page shows plant header and timeline
- ✅ All components render correctly
- ✅ Data flows properly

---

### Task 4.5: Add Loading State for Detail Page
- [ ] Create `app/plants/[id]/loading.tsx`:
  ```typescript
  export default function Loading() {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="h-6 bg-gray-200 rounded w-24 mb-4 animate-pulse" />
        <div className="h-10 bg-gray-200 rounded w-64 mb-4 animate-pulse" />
        <div className="space-y-2 mb-8">
          <div className="h-4 bg-gray-200 rounded w-48 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
        </div>

        <div className="h-8 bg-gray-200 rounded w-48 mb-6 animate-pulse" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border rounded-lg overflow-hidden">
              <div className="aspect-square bg-gray-200 animate-pulse" />
              <div className="p-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </main>
    )
  }
  ```

**Acceptance Criteria:**
- ✅ Loading skeleton shows while fetching
- ✅ Skeleton matches page layout

---

### Task 4.6: Add 404 Not Found Page
- [ ] Create `app/plants/[id]/not-found.tsx`:
  ```typescript
  import Link from 'next/link'

  export default function NotFound() {
    return (
      <main className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Plant Not Found</h1>
        <p className="text-gray-600 mb-8">
          This plant doesn't exist or has been removed.
        </p>
        <Link
          href="/"
          className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
        >
          Back to Gallery
        </Link>
      </main>
    )
  }
  ```

**Acceptance Criteria:**
- ✅ 404 page shows for invalid plant IDs
- ✅ Back button works

---

### Task 4.7: Test Detail Page with Various Plants
- [ ] Test plant with many photos (20+)
- [ ] Test plant with few photos (2-3)
- [ ] Test plant with only historical photos
- [ ] Test plant with only Planta photos
- [ ] Test plant with mixed photos
- [ ] Verify sorting is correct (newest first)

**Acceptance Criteria:**
- ✅ All test cases work correctly
- ✅ Photos sort properly (API photos before historical)
- ✅ Page performs well even with 20+ photos

---

### Task 4.8: Add Basic Accessibility
- [ ] Add alt text to all images (use plant name + "photo")
- [ ] Ensure all links have proper href attributes
- [ ] Test keyboard navigation (Tab through cards/links)
- [ ] Check color contrast (text on backgrounds)

**Acceptance Criteria:**
- ✅ All images have alt text
- ✅ Can navigate with keyboard
- ✅ Color contrast is sufficient

---

### ✅ EPIC 4 COMPLETION CHECKLIST
- [ ] Plant detail pages work for all plants
- [ ] Page shows plant name, location, variety, scientific name
- [ ] Photo timeline displays all photos in correct order
- [ ] Photos labeled with source and date (if available)
- [ ] Loading and 404 states work
- [ ] Page is responsive on all devices
- [ ] Basic accessibility implemented

---

## EPIC 5: Planta API Integration

**Goal:** Enable manual syncing of new photos from Planta API

**Estimated Effort:** 4-6 hours

**Prerequisites:** EPICs 1-4 complete

---

### Task 5.1: Create Planta API Client - Token Management
- [ ] Create `lib/planta-api.ts`:
  ```typescript
  import { supabase } from './supabase'

  const PLANTA_API_BASE_URL = process.env.PLANTA_API_BASE_URL || 'https://api.planta.app/v1'

  /**
   * Get access token, refresh if needed
   */
  export async function getAccessToken(): Promise<string> {
    const { data, error } = await supabase
      .from('sync_tokens')
      .select('*')
      .eq('id', 1)
      .single()

    if (error || !data) {
      throw new Error('Failed to fetch sync tokens')
    }

    // Check if token expires in less than 1 hour
    const expiresAt = new Date(data.expires_at)
    const oneHourFromNow = new Date(Date.now() + 3600000)

    if (expiresAt < oneHourFromNow) {
      console.log('Token expires soon, refreshing...')
      return await refreshAccessToken(data.refresh_token)
    }

    return data.access_token
  }

  /**
   * Refresh access token
   */
  async function refreshAccessToken(refreshToken: string): Promise<string> {
    // TODO: Implement token refresh logic based on Planta API docs
    // This will vary based on how Planta handles token refresh
    throw new Error('Token refresh not implemented yet')
  }
  ```

**Acceptance Criteria:**
- ✅ Token fetching logic works
- ✅ Token expiration check works
- ✅ Placeholder for refresh logic added

**Note:** You'll need to implement the actual refresh logic based on Planta's API documentation

---

### Task 5.2: Create Planta API Client - Fetch Plants
- [ ] Add fetch plants function to `lib/planta-api.ts`:
  ```typescript
  interface PlantaPlant {
    id: string
    names: {
      localizedName: string
      variety: string | null
      custom: string | null
      scientific: string
    }
    site: {
      name: string
    }
    image: {
      url: string
      lastUpdated: string
    }
  }

  /**
   * Fetch all plants from Planta API with pagination
   */
  export async function fetchAllPlants(): Promise<PlantaPlant[]> {
    const accessToken = await getAccessToken()
    const plants: PlantaPlant[] = []
    let cursor: string | null = null
    let hasMore = true

    while (hasMore) {
      const url = cursor
        ? `${PLANTA_API_BASE_URL}/addedPlants?cursor=${cursor}`
        : `${PLANTA_API_BASE_URL}/addedPlants`

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        if (response.status === 429) {
          // Rate limited - wait and retry
          console.warn('Rate limited, waiting 2 seconds...')
          await new Promise(resolve => setTimeout(resolve, 2000))
          continue
        }
        throw new Error(`Planta API error: ${response.status}`)
      }

      const data = await response.json()
      plants.push(...(data.data || []))

      cursor = data.cursor
      hasMore = !!cursor
    }

    return plants
  }
  ```

**Acceptance Criteria:**
- ✅ Can fetch plants with pagination
- ✅ Handles rate limiting (429 errors)
- ✅ Returns all plants from API

---

### Task 5.3: Create Planta API Client - Download Photo Helper
- [ ] Add photo download function to `lib/planta-api.ts`:
  ```typescript
  /**
   * Download photo from Planta URL
   */
  export async function downloadPhoto(url: string): Promise<Buffer> {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Failed to download photo: ${response.status}`)
    }

    const arrayBuffer = await response.arrayBuffer()
    return Buffer.from(arrayBuffer)
  }
  ```

**Acceptance Criteria:**
- ✅ Can download photos from URLs
- ✅ Returns buffer for upload to Supabase

---

### Task 5.4: Create Sync Endpoint - Setup
- [ ] Create `app/api/sync/route.ts`:
  ```typescript
  import { NextResponse } from 'next/server'
  import { supabase } from '@/lib/supabase'
  import { fetchAllPlants, downloadPhoto } from '@/lib/planta-api'

  export async function POST() {
    try {
      console.log('🔄 Starting sync...')

      let plantsSynced = 0
      let photosAdded = 0
      const errors: Array<{ plant_id: string; message: string }> = []

      // Fetch plants from Planta API
      const plantaPlants = await fetchAllPlants()
      console.log(`📥 Fetched ${plantaPlants.length} plants from Planta API`)

      // Process each plant
      for (const plantaPlant of plantaPlants) {
        try {
          // TODO: Implement plant sync logic
          plantsSynced++
        } catch (err: any) {
          console.error(`Error syncing plant ${plantaPlant.id}:`, err.message)
          errors.push({
            plant_id: plantaPlant.id,
            message: err.message
          })
        }
      }

      console.log('✅ Sync complete!')
      console.log(`  Plants synced: ${plantsSynced}`)
      console.log(`  Photos added: ${photosAdded}`)
      console.log(`  Errors: ${errors.length}`)

      return NextResponse.json({
        success: true,
        plants_synced: plantsSynced,
        photos_added: photosAdded,
        errors
      })
    } catch (error: any) {
      console.error('Sync failed:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }
  }
  ```

**Acceptance Criteria:**
- ✅ Sync endpoint exists
- ✅ Can fetch plants from Planta
- ✅ Returns proper response format

---

### Task 5.5: Create Sync Endpoint - Plant Upsert Logic
- [ ] Add plant processing logic to sync endpoint:
  ```typescript
  // Check if plant exists
  const { data: existingPlant } = await supabase
    .from('plants')
    .select('id')
    .eq('planta_id', plantaPlant.id)
    .maybeSingle()

  let plantId: string

  if (!existingPlant) {
    // New plant - insert it
    const { data: newPlant, error: insertError } = await supabase
      .from('plants')
      .insert({
        planta_id: plantaPlant.id,
        localized_name: plantaPlant.names.localizedName,
        variety: plantaPlant.names.variety,
        custom_name: plantaPlant.names.custom,
        scientific_name: plantaPlant.names.scientific,
        location: plantaPlant.site.name,
        is_active: true
      })
      .select('id')
      .single()

    if (insertError) throw insertError
    plantId = newPlant.id
    console.log(`  ✨ New plant: ${plantaPlant.names.localizedName}`)
  } else {
    // Plant exists - don't overwrite, just get ID
    plantId = existingPlant.id
  }
  ```

**Acceptance Criteria:**
- ✅ New plants get inserted
- ✅ Existing plants are skipped (not overwritten)
- ✅ Plant ID is captured for photo processing

---

### Task 5.6: Create Sync Endpoint - Photo Deduplication Logic
- [ ] Add photo checking logic:
  ```typescript
  // Check if we already have this photo
  if (!plantaPlant.image?.url) {
    console.log(`  ⚠️  No image for plant ${plantaPlant.id}`)
    continue // Skip to next plant
  }

  const { data: existingPhoto } = await supabase
    .from('photos')
    .select('id')
    .eq('planta_image_url', plantaPlant.image.url)
    .maybeSingle()

  if (existingPhoto) {
    console.log(`  ⏭️  Photo already exists, skipping`)
    continue // Already have this photo
  }
  ```

**Acceptance Criteria:**
- ✅ Checks for existing photos by URL
- ✅ Skips photos we already have
- ✅ Handles plants with no images

---

### Task 5.7: Create Sync Endpoint - Photo Upload Logic
- [ ] Add photo download and upload logic:
  ```typescript
  // New photo - download and upload
  console.log(`  📸 Downloading new photo...`)
  const photoBuffer = await downloadPhoto(plantaPlant.image.url)

  // Generate filename with sanitized timestamp
  const timestamp = plantaPlant.image.lastUpdated.replace(/:/g, '-')
  const filename = `${plantaPlant.id}-${timestamp}.webp`
  const storagePath = `planta/${filename}`

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase
    .storage
    .from('plant-photos')
    .upload(storagePath, photoBuffer, {
      contentType: 'image/webp',
      upsert: false
    })

  if (uploadError) throw uploadError

  // Get public URL
  const { data: urlData } = supabase
    .storage
    .from('plant-photos')
    .getPublicUrl(storagePath)

  // Insert photo record
  const { error: insertError } = await supabase
    .from('photos')
    .insert({
      plant_id: plantId,
      storage_path: storagePath,
      photo_url: urlData.publicUrl,
      source: 'planta',
      planta_image_url: plantaPlant.image.url,
      planta_last_updated: plantaPlant.image.lastUpdated,
      display_order: null,
      taken_at: null
    })

  if (insertError) throw insertError

  photosAdded++
  console.log(`  ✅ Photo added!`)
  ```

**Acceptance Criteria:**
- ✅ Downloads photos from Planta
- ✅ Uploads to Supabase Storage
- ✅ Inserts photo record in database
- ✅ Timestamps sanitized (colons removed)
- ✅ Photo counter increments

---

### Task 5.8: Test Sync Endpoint Locally
- [ ] Start dev server: `npm run dev`
- [ ] Use Postman or curl to test:
  ```bash
  curl -X POST http://localhost:3000/api/sync
  ```
- [ ] Watch console output for progress
- [ ] Verify response JSON includes:
  - `plants_synced`
  - `photos_added`
  - `errors` array
- [ ] Check Supabase:
  - New photos in Storage under `planta/` folder
  - New photo records in `photos` table
  - No duplicate photos created

**Acceptance Criteria:**
- ✅ Sync completes successfully
- ✅ New photos detected and uploaded
- ✅ Duplicate photos skipped
- ✅ Response includes accurate counts

**Troubleshooting:**
- If token refresh fails: Implement the refresh logic properly
- If photos don't upload: Check storage permissions and file paths
- If deduplication fails: Verify URL comparison logic

---

### Task 5.9: Test Sync Endpoint - Run Twice (Deduplication Test)
- [ ] Run sync endpoint again immediately:
  ```bash
  curl -X POST http://localhost:3000/api/sync
  ```
- [ ] Verify in response:
  - `photos_added: 0` (should be zero since all photos already exist)
  - No errors
- [ ] Check database - photo count should not increase

**Acceptance Criteria:**
- ✅ Second sync adds zero photos
- ✅ No duplicate photos created
- ✅ Deduplication works correctly

---

### Task 5.10: Implement Token Refresh Logic
- [ ] Research Planta API token refresh endpoint (check docs or API response)
- [ ] Implement `refreshAccessToken` function in `lib/planta-api.ts`
- [ ] Test by manually expiring token in database
- [ ] Run sync - should auto-refresh token

**Note:** Implementation depends on Planta's specific refresh flow. Common pattern:
```typescript
async function refreshAccessToken(refreshToken: string): Promise<string> {
  const response = await fetch(`${PLANTA_API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken })
  })

  if (!response.ok) {
    throw new Error('Failed to refresh token')
  }

  const data = await response.json()

  // Update tokens in database
  await supabase
    .from('sync_tokens')
    .update({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: data.expires_at,
      updated_at: new Date().toISOString()
    })
    .eq('id', 1)

  return data.access_token
}
```

**Acceptance Criteria:**
- ✅ Token refresh implementation complete
- ✅ Tokens update in database after refresh
- ✅ Sync works with refreshed token

---

### ✅ EPIC 5 COMPLETION CHECKLIST
- [ ] Planta API client created with token management
- [ ] Can fetch all plants from Planta API with pagination
- [ ] Sync endpoint exists and works
- [ ] New plants are inserted
- [ ] Existing plants are not overwritten
- [ ] New photos are detected and uploaded
- [ ] Duplicate photos are skipped (deduplication works)
- [ ] Token refresh logic implemented and tested
- [ ] Can sync via API call (Postman/curl)
- [ ] Sync response includes accurate stats

---

## EPIC 6: Polish & Deployment

**Goal:** Prepare for production, deploy, and share

**Estimated Effort:** 2-4 hours

**Prerequisites:** EPICs 1-5 complete

---

### Task 6.1: Add Accessibility Features
- [ ] Ensure all images have descriptive alt text
- [ ] Add proper heading hierarchy (h1 → h2 → h3)
- [ ] Test keyboard navigation (Tab through all interactive elements)
- [ ] Add focus styles to links and buttons
- [ ] Check color contrast ratios (use browser dev tools or axe DevTools)

**Acceptance Criteria:**
- ✅ All images have alt text
- ✅ Proper heading hierarchy
- ✅ Can navigate entire site with keyboard
- ✅ Focus states visible
- ✅ Color contrast meets WCAG AA standards

---

### Task 6.2: Test on Multiple Browsers
- [ ] Test on Chrome/Edge
- [ ] Test on Firefox
- [ ] Test on Safari (if on Mac)
- [ ] Verify all features work consistently
- [ ] Check for console errors

**Acceptance Criteria:**
- ✅ Site works on all major browsers
- ✅ No browser-specific bugs
- ✅ No console errors

---

### Task 6.3: Test on Mobile Devices
- [ ] Test on iOS device (if available)
- [ ] Test on Android device (if available)
- [ ] Alternatively, use browser responsive mode
- [ ] Test both portrait and landscape orientations
- [ ] Verify images load and scale properly
- [ ] Check touch interactions work

**Acceptance Criteria:**
- ✅ Site works on mobile devices
- ✅ Layout adapts correctly
- ✅ Images load and display properly
- ✅ Touch interactions work

---

### Task 6.4: Run Lighthouse Audit
- [ ] Open Chrome DevTools → Lighthouse
- [ ] Run audit on homepage
- [ ] Run audit on plant detail page
- [ ] Review scores:
  - Performance
  - Accessibility
  - Best Practices
  - SEO
- [ ] Fix any critical issues (aim for >80 on all metrics)

**Acceptance Criteria:**
- ✅ Lighthouse scores >80 on all metrics
- ✅ Critical issues fixed

---

### Task 6.5: Add Metadata for SEO
- [ ] Update `app/layout.tsx` with metadata:
  ```typescript
  import type { Metadata } from 'next'

  export const metadata: Metadata = {
    title: 'Plantfolio - My Plant Collection',
    description: 'A personal gallery showcasing my collection of 50+ houseplants with growth timelines',
  }
  ```
- [ ] Add dynamic metadata to plant detail pages:
  ```typescript
  export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const { data: plant } = await supabase
      .from('plants')
      .select('localized_name, custom_name')
      .eq('id', params.id)
      .single()

    const displayName = plant?.custom_name || plant?.localized_name || 'Plant'

    return {
      title: `${displayName} - Plantfolio`,
      description: `View growth timeline and photos of ${displayName}`,
    }
  }
  ```

**Acceptance Criteria:**
- ✅ Homepage has proper title and description
- ✅ Plant pages have dynamic titles
- ✅ Meta tags appear in page source

---

### Task 6.6: Create Vercel Project
- [ ] Go to https://vercel.com and sign up/log in
- [ ] Click "Add New Project"
- [ ] Import your Git repository (GitHub, GitLab, or Bitbucket)
- [ ] Configure project:
  - Framework preset: Next.js
  - Build command: `next build` (default)
  - Output directory: `.next` (default)
- [ ] Don't deploy yet - just create the project

**Acceptance Criteria:**
- ✅ Vercel project created
- ✅ Linked to Git repository

---

### Task 6.7: Set Up Environment Variables in Vercel
- [ ] In Vercel project settings, go to Environment Variables
- [ ] Add all variables from `.env.local`:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `PLANTA_API_BASE_URL`
- [ ] For `NEXT_PUBLIC_*` variables:
  - Check: Production, Preview, Development
- [ ] For `SUPABASE_SERVICE_ROLE_KEY`:
  - Check: Production only (sensitive)
- [ ] Save variables

**Acceptance Criteria:**
- ✅ All 4 environment variables added
- ✅ Correct environments selected for each

---

### Task 6.8: Deploy to Production
- [ ] In Vercel dashboard, click "Deploy"
- [ ] Wait for build to complete (~2-5 minutes)
- [ ] Check deployment logs for any errors
- [ ] Once deployed, click on deployment URL
- [ ] Verify site loads in production

**Acceptance Criteria:**
- ✅ Deployment succeeds
- ✅ Site loads on Vercel URL
- ✅ No build errors

---

### Task 6.9: Test Production Site
- [ ] Visit production URL
- [ ] Test homepage:
  - All 53 plants display
  - Images load
  - Links work
- [ ] Test several plant detail pages:
  - Plant info displays
  - All photos load
  - Back button works
- [ ] Check browser console for errors
- [ ] Test on mobile device

**Acceptance Criteria:**
- ✅ Homepage works in production
- ✅ Detail pages work in production
- ✅ All images load correctly
- ✅ No console errors

---

### Task 6.10: Test Sync in Production
- [ ] Use Postman or curl to test production sync:
  ```bash
  curl -X POST https://your-site.vercel.app/api/sync
  ```
- [ ] Verify sync completes successfully
- [ ] Check response includes proper stats
- [ ] Verify new photos appear in production site

**Acceptance Criteria:**
- ✅ Sync endpoint works in production
- ✅ Photos sync correctly
- ✅ No production-specific errors

---

### Task 6.11: Set Up Custom Domain (Optional)
- [ ] Purchase domain (if desired)
- [ ] In Vercel project settings → Domains
- [ ] Add custom domain
- [ ] Follow DNS configuration instructions
- [ ] Wait for DNS propagation (~24 hours)
- [ ] Verify site loads on custom domain

**Acceptance Criteria:**
- ✅ Custom domain configured (if desired)
- ✅ Site loads on custom domain

---

### Task 6.12: Share with Others
- [ ] Share production URL with at least 3 friends/family
- [ ] Ask for feedback:
  - Does it load quickly?
  - Is it easy to navigate?
  - Any bugs or issues?
- [ ] Celebrate! 🎉

**Acceptance Criteria:**
- ✅ At least 3 people have viewed the site
- ✅ Feedback collected
- ✅ Project complete!

---

### ✅ EPIC 6 COMPLETION CHECKLIST
- [ ] Accessibility features implemented
- [ ] Site tested on multiple browsers
- [ ] Site tested on mobile devices
- [ ] Lighthouse audit passes (>80 on all metrics)
- [ ] SEO metadata added
- [ ] Deployed to Vercel
- [ ] Environment variables configured in production
- [ ] Production site tested and working
- [ ] Sync endpoint works in production
- [ ] Shared with at least 3 people
- [ ] 🎉 MVP COMPLETE! 🎉

---

## Appendix: Quick Reference

### Common Commands
```bash
# Development
npm run dev                  # Start dev server
npm run build               # Build for production
npm run start               # Start production server

# Scripts
npm run backfill            # Run historical photo backfill

# Testing
curl -X POST http://localhost:3000/api/sync              # Test sync locally
curl -X POST https://your-site.vercel.app/api/sync       # Test sync in production
```

### Key Files
- `01_architecture-spec.md` - Full architecture document
- `.env.local` - Environment variables (never commit!)
- `lib/supabase.ts` - Supabase client
- `lib/planta-api.ts` - Planta API client
- `scripts/backfill-historical.ts` - Backfill script
- `scripts/folder-to-plant-mapping.json` - Folder mapping

### Useful Links
- Supabase Dashboard: https://supabase.com/dashboard
- Vercel Dashboard: https://vercel.com/dashboard
- Next.js Docs: https://nextjs.org/docs
- Tailwind CSS Docs: https://tailwindcss.com/docs

---

## Notes

- **Take breaks!** This is a lot of work. Celebrate small wins.
- **Ask for help** if you get stuck. The plan is detailed, but you may encounter edge cases.
- **Test frequently** - don't wait until the end to verify things work.
- **Document learnings** - keep notes on what you learned and what surprised you.
- **Have fun!** You're building something cool. 🌿

---

**Good luck with your implementation! You've got this! 🚀**
