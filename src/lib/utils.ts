import { Plant, Photo } from '@/types'

/**
 * Get display name for a plant (custom_name takes priority over localized_name)
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

/**
 * Get the most recent photo for a plant
 * Planta photos (with timestamp) sort first, then historical photos by display_order
 */
export function getMostRecentPhoto(photos: Photo[]): string | null {
  if (!photos || photos.length === 0) return null

  // Sort: Planta photos first (by planta_last_updated DESC), then historical (by display_order ASC)
  const sorted = [...photos].sort((a, b) => {
    // If both have Planta timestamps, sort by newest first
    if (a.planta_last_updated && b.planta_last_updated) {
      return new Date(b.planta_last_updated).getTime() - new Date(a.planta_last_updated).getTime()
    }
    // Planta photos always come first
    if (a.planta_last_updated) return -1
    if (b.planta_last_updated) return 1
    // For historical photos, sort by display_order
    return (a.display_order || 999) - (b.display_order || 999)
  })

  return sorted[0]?.photo_url || null
}
