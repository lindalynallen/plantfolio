'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Plant } from '@/types'
import { getPlantDisplayName, getBlurDataURL, formatRelativeDate } from '@/lib/utils'
import { ImagePlaceholderIcon } from '@/components/ui/Icons'

interface PlantWithMeta extends Plant {
  thumbnailUrl: string | null
  photoCount: number
  lastUpdated: string | null
}

interface PlantListViewProps {
  plants: PlantWithMeta[]
}

export function PlantListView({ plants }: PlantListViewProps) {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {/* Header row - desktop only */}
      <div className="hidden sm:grid sm:grid-cols-[2fr_1.5fr_1fr_0.75fr_0.75fr] gap-4 px-4 py-3 bg-surface-2 text-sm font-medium text-muted border-b border-border">
        <div>Name</div>
        <div>Species</div>
        <div>Location</div>
        <div className="text-right">Photos</div>
        <div className="text-right">Updated</div>
      </div>

      {/* Plant rows */}
      <div className="divide-y divide-border">
        {plants.map((plant) => (
          <PlantRow key={plant.id} plant={plant} />
        ))}
      </div>
    </div>
  )
}

function PlantRow({ plant }: { plant: PlantWithMeta }) {
  const [imageError, setImageError] = useState(false)
  const displayName = getPlantDisplayName(plant)
  const relativeDate = formatRelativeDate(plant.lastUpdated)

  return (
    <Link
      href={`/plants/${plant.id}`}
      className="group flex items-center gap-4 sm:grid sm:grid-cols-[2fr_1.5fr_1fr_0.75fr_0.75fr] sm:gap-4 px-4 py-3 bg-surface hover:bg-surface-2 transition-colors"
    >
      {/* Name + Thumbnail */}
      <div className="flex items-center gap-3 min-w-0 flex-1 sm:flex-none">
        {/* Thumbnail - larger */}
        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-background flex-shrink-0">
          {plant.thumbnailUrl && !imageError ? (
            <Image
              src={plant.thumbnailUrl}
              alt={displayName}
              fill
              sizes="48px"
              placeholder="blur"
              blurDataURL={getBlurDataURL()}
              onError={() => setImageError(true)}
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted">
              <ImagePlaceholderIcon className="w-5 h-5 opacity-50" />
            </div>
          )}
        </div>

        {/* Name */}
        <span className="font-medium text-base text-foreground truncate">
          {displayName}
        </span>
      </div>

      {/* Species - hidden on mobile */}
      <div className="hidden sm:block text-sm text-muted italic truncate">
        {plant.scientific_name || '—'}
      </div>

      {/* Location - hidden on mobile */}
      <div className="hidden sm:block text-sm text-muted truncate">
        {plant.location || '—'}
      </div>

      {/* Photo count - hidden on mobile */}
      <div className="hidden sm:block text-sm text-muted text-right tabular-nums">
        {plant.photoCount}
      </div>

      {/* Last updated - hidden on mobile */}
      <div className="hidden sm:block text-sm text-muted text-right tabular-nums">
        {relativeDate || '—'}
      </div>

      {/* Mobile: Compact metadata */}
      <div className="flex sm:hidden items-center gap-3 text-sm text-muted ml-auto flex-shrink-0">
        <span className="tabular-nums">{plant.photoCount}</span>
        {relativeDate && (
          <>
            <span className="text-muted/40">·</span>
            <span className="tabular-nums">{relativeDate}</span>
          </>
        )}
        {/* Chevron indicator */}
        <svg className="w-5 h-5 text-muted/50 group-hover:text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  )
}
