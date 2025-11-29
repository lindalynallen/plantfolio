import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { sortPhotos } from '@/lib/utils'
import { PlantDetailClient } from '@/components/PlantDetailClient'

// Revalidate every hour
export const revalidate = 3600 // Next.js requires literal values for route config

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

  return <PlantDetailClient plant={plant} photos={sortedPhotos} />
}
