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

/**
 * Sort photos by recency
 * Planta photos (with timestamp) sort first (newest first), then historical photos by display_order
 */
export function sortPhotos(photos: Photo[]): Photo[] {
  return [...photos].sort((a, b) => {
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
}

/**
 * Get a display label for a photo
 * Returns formatted date for Planta photos, "Photo N" for historical photos
 */
export function getPhotoLabel(photo: Photo): string {
  if (photo.planta_last_updated) {
    return formatDate(photo.planta_last_updated)
  }
  return photo.display_order ? `Photo ${photo.display_order}` : 'Photo'
}

/**
 * Generate a blur placeholder for images
 * This creates a tiny base64-encoded SVG for smooth image loading
 */
export function getBlurDataURL(): string {
  const svg = `
    <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" fill="#f0f0f0"/>
      <rect width="40" height="40" fill="url(#gradient)" opacity="0.3"/>
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#e0e0e0;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#d0d0d0;stop-opacity:1" />
        </linearGradient>
      </defs>
    </svg>
  `.trim()

  const base64 = Buffer.from(svg).toString('base64')
  return `data:image/svg+xml;base64,${base64}`
}
