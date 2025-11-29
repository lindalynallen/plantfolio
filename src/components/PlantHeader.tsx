import Image from 'next/image'
import { Plant, Photo } from '@/types'
import { getPlantDisplayName, getBlurDataURL, getPhotoLabel } from '@/lib/utils'

interface PlantHeaderProps {
  plant: Plant
  featuredPhoto?: Photo
  photoCount?: number
}

export function PlantHeader({ plant, featuredPhoto, photoCount = 0 }: PlantHeaderProps) {
  const displayName = getPlantDisplayName(plant)

  return (
    <section className="mb-12 sm:mb-16 lg:mb-20">
      {/* Hero layout: split on desktop, stacked on mobile */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:gap-12 xl:gap-20">

        {/* Featured Photo */}
        {featuredPhoto && (
          <div className="relative w-full lg:w-1/2 mb-8 lg:mb-0">
            <div className="relative aspect-square max-h-[65vh] overflow-hidden rounded-2xl sm:rounded-3xl bg-background">
              <Image
                src={featuredPhoto.photo_url}
                alt={displayName}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                placeholder="blur"
                blurDataURL={getBlurDataURL()}
                className="object-cover"
              />
            </div>
            {/* Photo date label */}
            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6">
              <span className="inline-block px-3 py-1.5 text-xs sm:text-sm font-medium
                             bg-black/60 backdrop-blur-sm text-white rounded-full">
                {getPhotoLabel(featuredPhoto)}
              </span>
            </div>
          </div>
        )}

        {/* Plant Info */}
        <div className={`flex flex-col ${featuredPhoto ? 'lg:w-1/2' : 'w-full'}`}>
          {/* Plant name - large display typography */}
          <h1 className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-foreground mb-3 sm:mb-4">
            {displayName}
          </h1>

          {/* Scientific name */}
          {plant.scientific_name && (
            <p className="text-lg sm:text-xl lg:text-2xl italic text-muted mb-6 sm:mb-8">
              {plant.scientific_name}
            </p>
          )}

          {/* Divider */}
          <div className="w-12 h-px bg-border mb-6 sm:mb-8" />

          {/* Metadata section */}
          <div className="space-y-3 text-sm sm:text-base">
            {plant.location && (
              <div className="flex items-center gap-3">
                <span className="text-muted">Location</span>
                <span className="text-foreground">{plant.location}</span>
              </div>
            )}
            {plant.variety && (
              <div className="flex items-center gap-3">
                <span className="text-muted">Variety</span>
                <span className="text-foreground">{plant.variety}</span>
              </div>
            )}
            {photoCount > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-muted">Photos</span>
                <span className="text-foreground">{photoCount}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
