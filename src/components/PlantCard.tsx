'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Plant } from '@/types'
import { getPlantDisplayName, getBlurDataURL, formatRelativeDate } from '@/lib/utils'

interface PlantCardProps {
  plant: Plant
  thumbnailUrl: string | null
  photoCount: number
  lastUpdated: string | null
  priority?: boolean
}

export function PlantCard({
  plant,
  thumbnailUrl,
  photoCount,
  lastUpdated,
  priority = false
}: PlantCardProps) {
  const displayName = getPlantDisplayName(plant)
  const relativeDate = formatRelativeDate(lastUpdated)

  return (
    <Link href={`/plants/${plant.id}`} className="group block">
      <article className="overflow-hidden rounded-lg bg-surface border border-border transition-colors duration-150 hover:border-border-hover hover:bg-surface-2">
        {/* Image */}
        <div className="relative aspect-[4/3] bg-background overflow-hidden">
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={displayName}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
              placeholder="blur"
              blurDataURL={getBlurDataURL()}
              priority={priority}
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted text-xs">
              No photo
            </div>
          )}

          {/* Photo count badge */}
          {photoCount > 0 && (
            <div className="absolute bottom-1.5 right-1.5 flex items-center gap-1 px-1.5 py-0.5 bg-black/60 backdrop-blur-sm rounded text-[10px] text-white/90 tabular-nums">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {photoCount}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-2 sm:p-2.5">
          {/* Name row */}
          <h3 className="font-medium text-xs sm:text-sm text-foreground truncate leading-snug">
            {displayName}
          </h3>

          {/* Species */}
          {plant.scientific_name && (
            <p className="text-[10px] sm:text-xs text-muted/70 italic truncate mt-0.5">
              {plant.scientific_name}
            </p>
          )}

          {/* Metadata row */}
          <div className="flex items-center gap-2 mt-1.5 text-[10px] sm:text-xs text-muted">
            {/* Location */}
            {plant.location && (
              <span className="inline-flex items-center gap-1 truncate">
                <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="truncate">{plant.location}</span>
              </span>
            )}

            {/* Separator */}
            {plant.location && relativeDate && (
              <span className="text-muted/40">·</span>
            )}

            {/* Last updated */}
            {relativeDate && (
              <span className="flex-shrink-0 tabular-nums">{relativeDate}</span>
            )}
          </div>
        </div>
      </article>
    </Link>
  )
}
