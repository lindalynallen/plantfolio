# Error Pages & UI States

Quick reference for all error, loading, and empty states in Plantfolio.

## Error Boundaries

| Page | File | Trigger |
|------|------|---------|
| **Global Error** | `src/app/error.tsx` | Any unhandled error in the app |
| **Plant Error** | `src/app/plants/[id]/error.tsx` | Error loading a specific plant |
| **Home DB Error** | `src/app/page.tsx` → `ErrorMessage` | Supabase fetch failure on homepage |

## 404 Pages

| Page | File | Trigger |
|------|------|---------|
| **Global 404** | `src/app/not-found.tsx` | Invalid route (e.g., `/fake-page`) |
| **Plant 404** | `src/app/plants/[id]/not-found.tsx` | Invalid plant ID |

## Loading States

| Page | File | Trigger |
|------|------|---------|
| **Homepage Loading** | `src/app/loading.tsx` | Route transition to homepage |
| **Plant Detail Loading** | `src/app/plants/[id]/loading.tsx` | Route transition to plant detail |

## Empty States

| State | Location | Trigger |
|-------|----------|---------|
| **No search results** | `PlantGallery.tsx` → `EmptyState` | Filter/search with no matches |
| **No photos (detail)** | `PlantDetailClient.tsx` | Plant with zero photos |

## Image Fallbacks

When images fail to load, components show the `ImagePlaceholderIcon` from `src/components/ui/Icons.tsx`:

| Component | Trigger |
|-----------|---------|
| `PlantCard` | Thumbnail missing or failed to load |
| `PlantListView` | Row thumbnail missing or failed to load |
| `PlantDetailClient` | Any photo in grid failed to load |

---

## How to Test

### 404 Pages
```bash
# Start dev server
npm run dev

# Global 404 - visit any invalid route
open http://localhost:3000/this-page-does-not-exist

# Plant 404 - visit invalid plant ID
open http://localhost:3000/plants/fake-plant-id-12345
```

### Loading States
1. Open Chrome DevTools → Network tab
2. Set throttling to "Slow 3G"
3. Refresh the page or navigate between routes

### Error Pages (Requires Temp Code Change)

**Global Error:**
```tsx
// src/app/page.tsx - add at top of HomePage function
throw new Error('Test error')
```

**Plant Error:**
```tsx
// src/app/plants/[id]/page.tsx - add at top of PlantDetailPage function
throw new Error('Test error')
```

**Home Database Error:**
```tsx
// src/app/page.tsx - replace the supabase query result:
const error = { message: 'Test DB error' }
const plants = null
```

### Image Error Fallback
```tsx
// In any component with <Image>, temporarily change src:
src="https://invalid-url-that-will-fail.com/image.jpg"
```

> **Remember:** Remove test code after testing!

---

## Design Specs

All error/404 pages follow consistent styling:

| Element | Classes |
|---------|---------|
| **Container** | `max-w-2xl mx-auto text-center` |
| **Spacing** | `py-16 sm:py-24` |
| **Heading** | `text-4xl sm:text-5xl font-semibold text-foreground` |
| **Subtitle** | `text-lg text-muted` |
| **Primary Button** | `px-6 py-3 bg-foreground text-background rounded-lg hover:opacity-90` |
| **Secondary Button** | `px-6 py-3 bg-surface text-foreground border border-border rounded-lg` |

Empty states use:
| Element | Classes |
|---------|---------|
| **Icon container** | `w-16 h-16 rounded-full bg-surface-2` |
| **Icon** | `ImagePlaceholderIcon` or contextual SVG |
| **Text** | `text-lg text-muted` |
