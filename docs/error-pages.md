# Error Pages & UI States

Quick reference for all error, loading, and empty states in Plantfolio.

## Error Pages

| Page | File | Trigger |
|------|------|---------|
| **Global Error** | `src/app/error.tsx` | Any unhandled error in the app |
| **Plant Error** | `src/app/plants/[id]/error.tsx` | Error loading a specific plant |
| **Global 404** | `src/app/not-found.tsx` | Invalid route (e.g., `/fake-page`) |
| **Plant 404** | `src/app/plants/[id]/not-found.tsx` | Invalid plant ID |
| **Home Error** | `src/app/page.tsx` → `ErrorMessage` | Database fetch failure on homepage |

## Loading States

| Page | File | Trigger |
|------|------|---------|
| **Homepage Loading** | `src/app/loading.tsx` | Initial page load / slow network |
| **Plant Detail Loading** | `src/app/plants/[id]/loading.tsx` | Loading plant detail page |

## Empty States

| State | Location | Trigger |
|-------|----------|---------|
| **No search results** | `PlantGallery.tsx` | Search with no matches |
| **No photos** | `PlantDetailClient.tsx` | Plant with zero photos |
| **No thumbnail** | `PlantCard.tsx` | Plant card without photo |

---

## How to Test

### 404 Pages (Easy)
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
3. Refresh the page

### Error Pages (Requires Code Change)

Temporarily add a throw statement to trigger errors:

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
// src/app/page.tsx - replace the supabase query with:
const error = { message: 'Test DB error' }
const plants = null
```

> **Remember:** Remove test code after testing!

---

## Design Specs

All error pages follow consistent styling:

- **Heading:** `text-4xl sm:text-5xl font-bold tracking-tight text-foreground`
- **Subtitle:** `text-lg text-muted`
- **Primary Button:** `px-6 py-3 bg-foreground text-background rounded-lg`
- **Secondary Button:** `px-6 py-3 bg-surface border border-border rounded-lg`
- **Container:** `max-w-2xl mx-auto text-center`
- **Spacing:** `py-16 sm:py-24` vertical padding
