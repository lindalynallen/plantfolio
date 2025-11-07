import { Plant } from '@/types'

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
