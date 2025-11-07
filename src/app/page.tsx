import { supabase } from '@/lib/supabase'
import { Plant, Photo } from '@/types'
import { PlantCard } from '@/components/PlantCard'

// Revalidate every hour (ISR - Incremental Static Regeneration)
export const revalidate = 3600

/**
 * Get the most recent photo for a plant
 * Planta photos (with timestamp) sort first, then historical photos by display_order
 */
function getMostRecentPhoto(photos: Photo[]): string | null {
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
    console.error('Error fetching plants:', error)
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-600">
          <p>Oops! We couldn't load your plants right now.</p>
          <p className="text-sm mt-2">Please try refreshing the page.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-2">My Plant Collection</h1>
      <p className="text-gray-600 mb-8">
        {plants?.length || 0} plants
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {plants?.map((plant) => {
          const thumbnailUrl = getMostRecentPhoto(plant.photos as Photo[])
          return (
            <PlantCard
              key={plant.id}
              plant={plant as Plant}
              thumbnailUrl={thumbnailUrl}
            />
          )
        })}
      </div>
    </main>
  )
}
