import { supabase } from '@/lib/supabase'
import { Plant, Photo } from '@/types'
import { PlantCard } from '@/components/PlantCard'
import { getMostRecentPhoto } from '@/lib/utils'

// Revalidate every hour (ISR - Incremental Static Regeneration)
export const revalidate = 3600

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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center text-muted">
          <p>Oops! We couldn't load your plants right now.</p>
          <p className="text-sm mt-2">Please try refreshing the page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
      {/* Hero Section */}
      <div className="text-center mb-12 sm:mb-16">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4">
          My Plant Collection
        </h1>
        <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto">
          Welcome to my personal plant gallery featuring over 50 houseplants.
        </p>
      </div>

      {/* Plant Grid - 5 columns on large screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
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
    </div>
  )
}
