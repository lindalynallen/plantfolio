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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center text-muted">
        <p>Oops! We couldn't load your plants right now.</p>
        <p className="text-sm mt-2">Please try refreshing the page.</p>
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
