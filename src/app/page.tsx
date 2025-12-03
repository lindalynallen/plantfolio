import { supabase } from '@/lib/supabase'
import { Photo } from '@/types'
import { PlantGallery } from '@/components/PlantGallery'
import { getMostRecentPhoto } from '@/lib/utils'
import { logError } from '@/lib/logger'

// Revalidate every hour (ISR - Incremental Static Regeneration)
export const revalidate = 3600 // Next.js requires literal values for route config

export default async function HomePage() {
  // Fetch all active plants with their photos
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

  if (error) {
    logError('Error fetching plants:', error)
    return <ErrorMessage />
  }

  // Calculate gallery statistics
  const stats = calculateStats(plants || [])

  // Get sorted list of unique locations for the filter dropdown
  const uniqueLocations = extractUniqueLocations(plants || [])

  // Pre-compute metadata on server (avoids recalculating on every client render)
  const plantsWithMeta = (plants || []).map((plant) => {
    const photos = plant.photos as Photo[]
    // Get most recent photo date (for sorting and display)
    const lastUpdated = photos
      .filter(p => p.planta_last_updated)
      .sort((a, b) => new Date(b.planta_last_updated!).getTime() - new Date(a.planta_last_updated!).getTime())[0]
      ?.planta_last_updated || null

    return {
      ...plant,
      thumbnailUrl: getMostRecentPhoto(photos),
      photoCount: photos.length,
      lastUpdated,
    }
  })

  return (
    <PlantGallery
      plants={plantsWithMeta}
      stats={stats}
      locations={uniqueLocations}
    />
  )
}

// =============================================================================
// Helper Functions
// =============================================================================

interface PlantWithPhotos {
  photos: Photo[]
  location: string | null
}

/**
 * Calculate total counts for plants, photos, and locations
 */
function calculateStats(plants: PlantWithPhotos[]) {
  const totalPlants = plants.length

  const totalPhotos = plants.reduce(
    (count, plant) => count + plant.photos.length,
    0
  )

  // Count unique non-null locations
  const uniqueLocationCount = new Set(
    plants.map((p) => p.location).filter(Boolean)
  ).size

  return {
    totalPlants,
    totalPhotos,
    totalLocations: uniqueLocationCount,
  }
}

/**
 * Extract and sort unique location names from plants
 * Filters out null/undefined locations
 */
function extractUniqueLocations(plants: PlantWithPhotos[]): string[] {
  const locations = plants
    .map((plant) => plant.location)
    .filter((location): location is string => location !== null)

  // Remove duplicates and sort alphabetically
  const uniqueLocations = [...new Set(locations)]
  return uniqueLocations.sort()
}

// =============================================================================
// UI Components
// =============================================================================

/**
 * Shown when plants fail to load from the database
 */
function ErrorMessage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
          Couldn&apos;t load plants
        </h1>
        <p className="text-lg text-muted mb-8">
          We ran into a problem loading your collection. Please try again.
        </p>
        <a
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-lg hover:opacity-90 transition-opacity font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Refresh page</span>
        </a>
      </div>
    </div>
  )
}

