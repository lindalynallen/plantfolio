# PLANTFOLIO UX PLAN - EPICs 3 & 4

**Version:** 1.0 (Final)
**Date:** 2025-11-06
**Status:** Ready for Implementation

---

## 1. INFORMATION ARCHITECTURE

### Site Structure
```
Homepage (/)
├── Header (Site Title)
├── Plant Gallery (53 cards)
│   └── Each card links to →
│
Plant Detail Page (/plants/[id])
├── Back to Gallery link
├── Plant Header (Name + Metadata)
└── Photo Timeline (All photos, newest first)
    └── Click photo → Lightbox/Modal (fullscreen view)
```

### Content Hierarchy
- **Primary:** Plant photos (visual-first design)
- **Secondary:** Plant names (custom > localized)
- **Tertiary:** Metadata (location, variety, scientific name)

---

## 2. NAVIGATION FLOWS

### Flow 1: Browse Plants
```
User lands on homepage → Sees grid of 53 plants → Scrolls to explore
```

### Flow 2: View Plant Details
```
Homepage → Click plant card → Detail page loads → View all photos
```

### Flow 3: View Photo Fullscreen
```
Detail page → Click any photo → Lightbox opens (fullscreen) → Arrow keys/swipe to navigate → Click outside/ESC to close → Return to detail page
```

### Flow 4: Mobile Navigation
```
Same as desktop flows, optimized for touch (larger tap targets, single column, swipe gestures in lightbox)
```

### Key Navigation Principles
- **No search/filter in MVP** - scroll to browse (53 plants is manageable)
- **Single level depth** - only 2 pages (homepage + detail)
- **Back navigation** - prominent "← Back to gallery" link on detail pages
- **No breadcrumbs needed** - flat structure
- **Keyboard accessible** - Tab navigation, ESC to close modals, arrow keys in lightbox

---

## 3. LAYOUT HIERARCHY & DESIGN PRINCIPLES

### Design Philosophy
1. **Visual-First:** Photos are the hero - large, high-quality display
2. **Mobile-First:** Design for smallest screens first, scale up
3. **Minimal UI:** Let plants shine, reduce chrome
4. **Fast Loading:** Leverage Next.js Image optimization with built-in lazy loading

### Responsive Grid System
- **Mobile (< 640px):** 1 column (100% width)
- **Tablet (640-1024px):** 2-3 columns
- **Desktop (> 1024px):** 4 columns

### Color Palette (Configurable)
**Current Theme: "Plant Green"**
- **Primary:** `green-600` (#16a34a) - interactive elements, branding
- **Primary Hover:** `green-700` (#15803d) - hover states
- **Neutral:** Gray scale for text, backgrounds
- **Surface:** White cards on `gray-50` background
- **Text Primary:** `gray-900` (headings)
- **Text Secondary:** `gray-600` (metadata)

**Implementation Note:** Use Tailwind CSS color utilities to allow easy theme switching. Avoid hardcoded hex values in components.

---

## 4. HOMEPAGE WIREFRAME & ZONE MAP

```
┌─────────────────────────────────────────────────────┐
│ [ZONE A: HEADER]                                    │
│ ┌─────────────────────────────────────────────────┐ │
│ │  🌿 Plantfolio                                  │ │
│ └─────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────┤
│ [ZONE B: PAGE TITLE]                                │
│ ┌─────────────────────────────────────────────────┐ │
│ │  My Plant Collection                            │ │
│ │  53 plants                                      │ │
│ └─────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────┤
│ [ZONE C: PLANT GRID]                                │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│ │ ┌─────┐ │ │ ┌─────┐ │ │ ┌─────┐ │ │ ┌─────┐ │   │
│ │ │ IMG │ │ │ │ IMG │ │ │ │ IMG │ │ │ │ IMG │ │   │
│ │ └─────┘ │ │ └─────┘ │ │ └─────┘ │ │ └─────┘ │   │
│ │ Monstera│ │ Pothos  │ │ Snake   │ │ Fiddle  │   │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘   │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│ │ ┌─────┐ │ │ ┌─────┐ │ │ ┌─────┐ │ │ ┌─────┐ │   │
│ │ │ IMG │ │ │ │ IMG │ │ │ │ IMG │ │ │ │ IMG │ │   │
│ │ └─────┘ │ │ └─────┘ │ │ └─────┘ │ │ └─────┘ │   │
│ │ Banana  │ │ Rubber  │ │ Peace   │ │ ZZ Plant│   │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘   │
│ ... (continues for all 53 plants)                   │
└─────────────────────────────────────────────────────┘
```

### Zone Details

#### ZONE A - Header (Fixed, Site-Wide)
- **Content:** Site logo/title "🌿 Plantfolio"
- **Purpose:** Brand identity, navigation anchor
- **Height:** ~80px
- **Styling:** White background, subtle border-bottom

#### ZONE B - Page Title
- **Content:** "My Plant Collection" heading + plant count
- **Purpose:** Orientation, shows total collection size
- **Styling:** Large heading (text-4xl), gray subtitle

#### ZONE C - Plant Grid
- **Content:** 53 plant cards in responsive grid
- **Card Structure:**
  - **Image:** Square aspect ratio (1:1), most recent photo
  - **Name:** Custom name OR localized name (bold, 18px)
  - **No location shown** (simplified for MVP)
- **Interactions:**
  - **Hover:** Card shadow increases, image scales slightly (105%)
  - **Click:** Navigate to plant detail page
- **Responsive:**
  - **Mobile:** 1 column, full width
  - **Tablet:** 2-3 columns, gap-6
  - **Desktop:** 4 columns, gap-6

---

## 5. PLANT DETAIL PAGE WIREFRAME & ZONE MAP

```
┌─────────────────────────────────────────────────────┐
│ [ZONE A: HEADER]                                    │
│ ┌─────────────────────────────────────────────────┐ │
│ │  🌿 Plantfolio                                  │ │
│ └─────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────┤
│ [ZONE D: PLANT HEADER]                              │
│ ┌─────────────────────────────────────────────────┐ │
│ │  ← Back to gallery                              │ │
│ │                                                 │ │
│ │  Monstera Deliciosa Mini                        │ │
│ │  Monstera deliciosa 'Mini'     [Scientific]     │ │
│ │  Variety: Mini                                  │ │
│ │  Location: Living Room                          │ │
│ └─────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────┤
│ [ZONE E: PHOTO TIMELINE]                            │
│ ┌─────────────────────────────────────────────────┐ │
│ │  Photo Timeline (23 photos)                     │ │
│ └─────────────────────────────────────────────────┘ │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐               │
│ │ ┌─────┐ │ │ ┌─────┐ │ │ ┌─────┐ │               │
│ │ │ IMG │ │ │ │ IMG │ │ │ │ IMG │ │               │
│ │ │  1  │ │ │ │  2  │ │ │ │  3  │ │               │
│ │ └─────┘ │ │ └─────┘ │ │ └─────┘ │               │
│ │ Nov 2024│ │ Photo 8 │ │ Aug 2024│               │
│ │ (Planta)│ │(Historic)│ │ (Planta)│               │
│ └─────────┘ └─────────┘ └─────────┘               │
│ ... (continues for all photos)                      │
└─────────────────────────────────────────────────────┘

[LIGHTBOX MODAL - Triggered by clicking any photo]
┌─────────────────────────────────────────────────────┐
│ [X]                                         [Close] │
│                                                     │
│              ┌───────────────────┐                  │
│              │                   │                  │
│         [←]  │   FULL SIZE IMG   │  [→]             │
│              │                   │                  │
│              └───────────────────┘                  │
│                                                     │
│              Photo 5 of 23                          │
│              November 15, 2024 (if timestamp)       │
└─────────────────────────────────────────────────────┘
```

### Zone Details

#### ZONE A - Header (Same as Homepage)
- Provides consistent navigation anchor across all pages

#### ZONE D - Plant Header
- **Back Link:** "← Back to gallery" (green, hover underline)
- **Plant Name:** Large heading (text-4xl), custom > localized
- **Metadata Grid:**
  - Scientific name (italic, gray) - if exists
  - Variety - if exists
  - Location - if exists
- **Styling:** Clean, minimal, focuses on plant identity

#### ZONE E - Photo Timeline
- **Section Title:** "Photo Timeline (X photos)" - shows total count
- **Grid Layout:** 3 columns desktop, 2 tablet, 1 mobile
- **Photo Cards:**
  - **Image:** Square aspect ratio (1:1)
  - **Metadata Display:**
    - **Planta photos:** Show formatted date (e.g., "November 15, 2024") from `planta_last_updated`
    - **Historical photos:** Show progression label (e.g., "Photo 1", "Photo 2") from `display_order`
    - **Rationale:** Gives all photos context while keeping design clean
  - **No source badge** (simplified for MVP)
- **Sorting:** Newest → Oldest (Planta photos first by timestamp DESC, then historical by display_order ASC)
- **Click Behavior:** Opens lightbox modal with fullscreen photo view
- **Empty State:** If plant has zero photos, display centered message "No photos yet" in gray text (`text-center text-gray-500 py-12`)

#### ZONE F - Lightbox/Modal (Photo Viewer)
- **Trigger:** Click any photo in timeline
- **Layout:**
  - **Full viewport overlay** with semi-transparent dark background
  - **Centered photo** (max-width/height to fit viewport)
  - **Navigation arrows:** Previous/Next (← →)
  - **Close button:** Top-right [X] or click outside photo
  - **Photo counter:** "Photo X of Y"
  - **Date caption:** Below photo (only if timestamp exists)
- **Keyboard Navigation:**
  - `ESC` - Close lightbox
  - `←` - Previous photo
  - `→` - Next photo
- **Touch Gestures (Mobile):**
  - Swipe left/right - Navigate photos
  - Tap outside - Close lightbox
- **Accessibility:**
  - Focus trap (Tab stays within modal)
  - Focus returns to clicked photo when closed

---

## 6. INTERACTION STATES

### Homepage Plant Card
- **Default:** Border, rounded corners, subtle shadow
- **Hover:** Shadow increases, image scales to 105%
- **Active/Click:** Navigate to detail page

### Detail Page
- **Photos:** Click to open lightbox modal
- **Back Link:** Hover shows underline
- **Lightbox Navigation:** Arrows change opacity on hover

### Loading States
- **Homepage:** Skeleton cards with pulsing gray backgrounds (12 cards)
- **Detail Page:** Skeleton matching layout structure
- **Lightbox:** Loading spinner while large image loads

### Error States
- **Homepage:** User-friendly message displayed (e.g., "Oops! We couldn't load your plants right now. Please try refreshing the page.")
- **Detail Page:** 404 "Plant Not Found" page with friendly message and back link
- **No retry buttons** - simple, clean error messages

### Empty States
- **Plant with no photos:** Display centered message "No photos yet" in gray text
  - Styling: `text-center text-gray-500 py-12`
  - Not an error state - calm, neutral tone
  - No icon needed (keeps it minimal)

---

## 7. TYPOGRAPHY SCALE

```
Hero (h1):        text-4xl (36px) - Plant names on detail page
Section (h2):     text-2xl (24px) - "Photo Timeline"
Subsection (h3):  text-xl (20px) - Not used in MVP
Card Title:       text-lg (18px) - Plant names on cards
Body:             text-base (16px) - Metadata
Small:            text-sm (14px) - Dates, captions
Tiny:             text-xs (12px) - Photo counter in lightbox
```

**Font Family:** Default Next.js system font stack (optimized for performance)

---

## 8. SPACING SYSTEM

```
Container:   max-width: 1280px, px-4 (16px horizontal padding)
Section:     py-8 (32px vertical padding)
Grid Gap:    gap-6 (24px between cards)
Card:        p-4 (16px internal padding)
Modal:       p-6 (24px padding around lightbox controls)
```

---

## 9. IMAGE LOADING STRATEGY

### Decision: Use Next.js Image Built-In Lazy Loading

**Why:**
- **Next.js `<Image>` component has intelligent lazy loading by default** - images load as they enter the viewport
- **No custom implementation needed** - reduces code complexity
- **Performance benefits:**
  - Homepage: Only loads visible images initially (~4-8 images), then lazy-loads as user scrolls
  - Detail page: Loads images as user scrolls through timeline (not all 20+ at once)
  - Automatic image optimization (WebP, size variants)
  - Blur placeholder support for better perceived performance
- **Lighthouse-friendly** - Built-in lazy loading scores well on performance audits

**Implementation:**
```tsx
<Image
  src={photo.photo_url}
  alt={plant.name}
  fill
  className="object-cover"
  // loading="lazy" is default - no need to specify
  // Can optionally add:
  // placeholder="blur"
  // blurDataURL={...}
/>
```

**What We're NOT Implementing:**
- ❌ Custom infinite scroll
- ❌ "Load More" pagination
- ❌ Manual intersection observers
- ❌ Custom lazy loading logic

**What We ARE Using:**
- ✅ Next.js Image component (automatic lazy loading)
- ✅ All photos rendered in DOM at once (simple, works for 20+ photos)
- ✅ Browser handles lazy loading as user scrolls

---

## 10. COMPONENT ARCHITECTURE

### Component Hierarchy
```
app/
├── layout.tsx                    # Root layout with header
├── page.tsx                      # Homepage (server component)
└── plants/[id]/
    └── page.tsx                  # Detail page (server component)

components/
├── PlantCard.tsx                 # Gallery card (client component)
├── PlantGallery.tsx              # Grid wrapper (server component)
├── PlantHeader.tsx               # Detail page header (server component)
├── PhotoTimeline.tsx             # Photo grid (client component)
└── PhotoLightbox.tsx             # Modal viewer (client component) ← NEW
```

### New Component: PhotoLightbox
- **Type:** Client component (`'use client'`)
- **Library:** `yet-another-react-lightbox` - Popular, accessible lightbox library
- **Why this library:**
  - ✅ Feature-rich (keyboard nav, swipe, thumbnails, captions)
  - ✅ Accessible (ARIA, focus management, screen reader support)
  - ✅ Small bundle (~20KB gzipped)
  - ✅ Well-maintained and widely used
  - ✅ Saves development time vs. custom implementation
- **Integration:**
  - PhotoTimeline component triggers lightbox on photo click
  - Pass photos array and initial index
  - Lightbox handles all navigation, keyboard events, and touch gestures
- **Features:**
  - Fullscreen overlay
  - Keyboard navigation (ESC, arrows)
  - Touch swipe support (mobile)
  - Focus trap
  - Accessible (ARIA labels, focus management)

---

## 11. ACCESSIBILITY REQUIREMENTS

### Keyboard Navigation
- **Tab:** Navigate through interactive elements
- **Enter/Space:** Activate buttons and links
- **ESC:** Close lightbox modal
- **Arrow Keys:** Navigate photos in lightbox

### Screen Reader Support
- **Alt text:** All images have descriptive alt text (`{plantName} photo`)
- **ARIA labels:** Modal has `role="dialog"`, `aria-modal="true"`
- **Focus management:** Focus moves to modal when opened, returns to trigger when closed
- **Live regions:** Photo counter announced when navigating

### Visual Accessibility
- **Color contrast:** Text meets WCAG AA standards (4.5:1 for body text)
- **Focus indicators:** Visible focus rings on all interactive elements
- **Touch targets:** Minimum 44x44px for mobile tap targets

---

## 12. PERFORMANCE TARGETS

### Lighthouse Scores (Target: >80 on all metrics)
- **Performance:** >85 (lazy loading, Next.js optimization)
- **Accessibility:** >90 (semantic HTML, ARIA, keyboard nav)
- **Best Practices:** >90 (HTTPS, no console errors)
- **SEO:** >90 (meta tags, semantic structure)

### Loading Metrics
- **Homepage:** Initial load <2s (53 thumbnails)
- **Detail Page:** Initial load <2s (first 3-6 photos visible)
- **Lightbox:** Fullscreen image loads <1s

---

## 13. MOBILE OPTIMIZATION

### Touch Interactions
- **Tap targets:** Minimum 44x44px (cards, buttons, nav arrows)
- **Swipe gestures:** Lightbox supports left/right swipes
- **No hover states on mobile:** Use `:active` pseudo-class instead

### Responsive Images
- **Next.js Image generates multiple sizes** automatically
- **Mobile:** Serves smaller image files (e.g., 640px width)
- **Desktop:** Serves larger files (e.g., 1280px width)

### Mobile-First CSS
- **Default styles:** Design for mobile (320px+)
- **Breakpoints:** Use `sm:`, `md:`, `lg:` modifiers to enhance for larger screens

---

## 14. BROWSER SUPPORT

### Target Browsers
- **Chrome/Edge:** Last 2 versions
- **Firefox:** Last 2 versions
- **Safari:** Last 2 versions (iOS + macOS)
- **Mobile:** iOS Safari 14+, Chrome Android 90+

### Fallbacks
- **WebP images:** Next.js automatically falls back to JPEG/PNG if not supported
- **CSS Grid:** No fallback needed (supported in all target browsers)

---

## 15. IMPLEMENTATION NOTES

### Styling Approach
- **Tailwind CSS utility-first** - keep styles in JSX for co-location
- **No custom CSS files** unless absolutely necessary
- **Theme configuration in `tailwind.config.js`** - allows easy color palette changes

### Key Dependencies
- **`yet-another-react-lightbox`** - Photo lightbox/modal viewer
  - Install: `npm install yet-another-react-lightbox`
  - Docs: https://yet-another-react-lightbox.com/
  - Used in: PhotoTimeline component

### State Management
- **Server Components by default** - minimize client-side JavaScript
- **Client Components only when needed:**
  - PlantCard (hover effects)
  - PhotoTimeline (lightbox trigger)
  - PhotoLightbox (modal state, keyboard events)
- **No global state library needed** - props and URL state sufficient for MVP

### Data Fetching
- **Server-side only** - fetch in Server Components
- **Revalidation:** `revalidate = 3600` (1 hour) for ISR
- **No client-side fetching** - simplifies error handling

---

## 16. FUTURE ENHANCEMENTS (Not in MVP)

### V2 Features to Consider
- 🔍 **Search/Filter:** Filter by location, date range, name
- 🏷️ **Tags/Categories:** Organize plants by type, care level
- 📊 **Stats Dashboard:** Photo count, growth charts, care reminders
- 💬 **Photo Notes:** Add captions/notes to individual photos
- 🌙 **Dark Mode:** Toggle between light/dark themes
- 📥 **Download Photos:** Bulk download plant photos
- 🔗 **Share Links:** Share specific plant or photo with friends

---

## SUMMARY

### Key Design Decisions
✅ **Visual-first design** - Photos are the hero content
✅ **Minimal UI** - Clean, uncluttered interface
✅ **Responsive grid** - 1/2/3/4 columns based on screen size
✅ **Square images (1:1)** - Consistent, organized look
✅ **Lightbox modal** - Fullscreen photo viewing
✅ **Built-in lazy loading** - Next.js Image handles performance
✅ **Themeable colors** - Tailwind utilities for easy changes
✅ **Accessible** - Keyboard nav, screen reader support

### What Makes This UX Plan Great
- **Simple & focused:** Two pages, clear navigation
- **Performance-optimized:** Lazy loading, Next.js optimization
- **Accessible:** Keyboard nav, ARIA, focus management
- **Maintainable:** Component-based, Tailwind CSS
- **Scalable:** Easy to add features in V2

---

## NEXT STEPS

1. **Review this UX plan** - Confirm all details align with vision
2. **Start EPIC 3 implementation** - Build homepage gallery
3. **Iterate on design** - Adjust colors, spacing as needed during development
4. **Test frequently** - Verify responsive layout, interactions
5. **Launch & gather feedback** - Share with friends/family

---

**Ready to build! 🚀**
