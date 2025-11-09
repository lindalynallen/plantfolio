'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Plant } from '@/types'
import { getPlantDisplayName, getBlurDataURL } from '@/lib/utils'

interface PlantCardProps {
  plant: Plant
  thumbnailUrl: string | null
  priority?: boolean
}

export function PlantCard({ plant, thumbnailUrl, priority = false }: PlantCardProps) {
  const displayName = getPlantDisplayName(plant)

  return (
    <Link href={`/plants/${plant.id}`} className="group block">
      <article className="overflow-hidden rounded-2xl bg-surface border border-border shadow-card transition-all duration-300 ease-out hover:shadow-card-hover hover:scale-[1.02]">
        {/* Image */}
        <div className="relative aspect-square bg-background overflow-hidden">
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={displayName}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
              placeholder="blur"
              blurDataURL={getBlurDataURL()}
              priority={priority}
              className="object-cover transition-all duration-400 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted">
              No photo
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-semibold text-base text-foreground mb-1">
            {displayName}
          </h3>
          {plant.scientific_name && (
            <p className="text-sm italic text-muted/70">
              {plant.scientific_name}
            </p>
          )}
        </div>
      </article>
    </Link>
  )
}
