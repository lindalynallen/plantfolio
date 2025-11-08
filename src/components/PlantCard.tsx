'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Plant } from '@/types'
import { getPlantDisplayName } from '@/lib/utils'

interface PlantCardProps {
  plant: Plant
  thumbnailUrl: string | null
}

export function PlantCard({ plant, thumbnailUrl }: PlantCardProps) {
  const displayName = getPlantDisplayName(plant)

  return (
    <Link href={`/plants/${plant.id}`} className="group block">
      <article className="overflow-hidden rounded-2xl bg-surface border border-border shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        {/* Image */}
        <div className="relative aspect-square bg-background">
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={displayName}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
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
            <p className="text-sm italic text-muted">
              {plant.scientific_name}
            </p>
          )}
        </div>
      </article>
    </Link>
  )
}
