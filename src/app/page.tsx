import { Suspense } from 'react'
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

  // Pre-compute thumbnail URLs on server (avoids recalculating on every client render)
  const plantsWithThumbnails = (plants || []).map((plant) => ({
    ...plant,
    thumbnailUrl: getMostRecentPhoto(plant.photos as Photo[]),
  }))

  return (
    <Suspense fallback={<GalleryFallback />}>
      <PlantGallery
        plants={plantsWithThumbnails}
        stats={stats}
        locations={uniqueLocations}
      />
    </Suspense>
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
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
          Couldn't load plants
        </h1>
        <p className="text-lg text-muted mb-8">
          We ran into a problem loading your collection. Please try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-lg hover:opacity-90 transition-opacity font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Refresh page</span>
        </button>
      </div>
    </div>
  )
}

/**
 * Loading skeleton shown while PlantGallery is suspended
 * Matches the layout of the actual gallery for smooth transition
 */
function GalleryFallback() {
  return (
    <div className="container mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Stats headline skeleton */}
      <div className="h-8 sm:h-9 bg-surface rounded-lg w-80 sm:w-96 mx-auto mb-6 sm:mb-8 animate-pulse" />

      {/* Filter bar skeleton */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="h-12 bg-surface rounded-xl flex-1 animate-pulse" />
        <div className="h-12 bg-surface rounded-xl sm:w-48 animate-pulse" />
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <div
            key={index}
            className="aspect-square bg-surface rounded-2xl animate-pulse"
          />
        ))}
      </div>
    </div>
  )
}
