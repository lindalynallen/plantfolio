import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getPlantDisplayName, sortPhotos } from '@/lib/utils'
import { PlantHeader } from '@/components/PlantHeader'
import { PhotoTimeline } from '@/components/PhotoTimeline'
import { REVALIDATE_INTERVAL } from '@/lib/constants'

// Revalidate every hour
export const revalidate = REVALIDATE_INTERVAL

interface PlantDetailPageProps {
  params: Promise<{
    id: string
  }>
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PlantDetailPageProps): Promise<Metadata> {
  const { id } = await params

  const { data: plant } = await supabase
    .from('plants')
    .select('localized_name, custom_name')
    .eq('id', id)
    .single()

  if (!plant) {
    return {
      title: 'Plant Not Found - Plantfolio',
    }
  }

  const displayName = plant.custom_name || plant.localized_name

  return {
    title: `${displayName} - Plantfolio`,
    description: `View growth timeline and photos of ${displayName}`,
  }
}

export default async function PlantDetailPage({ params }: PlantDetailPageProps) {
  const { id } = await params

  // Fetch plant with all photos
  const { data: plant, error } = await supabase
    .from('plants')
    .select(`
      *,
      photos (
        id,
        photo_url,
        planta_last_updated,
        display_order,
        source,
        taken_at,
        plant_id,
        storage_path,
        planta_image_url,
        created_at
      )
    `)
    .eq('id', id)
    .eq('is_active', true)
    .single()

  // Handle not found
  if (error || !plant) {
    notFound()
  }

  // Sort photos using utility function
  const sortedPhotos = sortPhotos(plant.photos || [])
  const displayName = getPlantDisplayName(plant)

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      <PlantHeader plant={plant} />
      <PhotoTimeline photos={sortedPhotos} plantName={displayName} />
    </main>
  )
}
