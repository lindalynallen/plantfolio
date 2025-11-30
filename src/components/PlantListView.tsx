'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Plant } from '@/types'
import { getPlantDisplayName, getBlurDataURL, formatRelativeDate } from '@/lib/utils'

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
    <div className="border border-border rounded-lg overflow-hidden divide-y divide-border">
      {/* Header row */}
      <div className="hidden sm:grid sm:grid-cols-[2fr_1.5fr_1fr_0.75fr_0.75fr] gap-4 px-3 py-2 bg-surface-2 text-xs font-medium text-muted uppercase tracking-wider">
        <div>Name</div>
        <div>Species</div>
        <div>Location</div>
        <div className="text-right">Photos</div>
        <div className="text-right">Updated</div>
      </div>

      {/* Plant rows */}
      {plants.map((plant) => (
        <PlantRow key={plant.id} plant={plant} />
      ))}
    </div>
  )
}

function PlantRow({ plant }: { plant: PlantWithMeta }) {
  const displayName = getPlantDisplayName(plant)
  const relativeDate = formatRelativeDate(plant.lastUpdated)

  return (
    <Link
      href={`/plants/${plant.id}`}
      className="group flex items-center gap-3 sm:grid sm:grid-cols-[2fr_1.5fr_1fr_0.75fr_0.75fr] sm:gap-4 px-3 py-2.5 bg-surface hover:bg-surface-2 transition-colors"
    >
      {/* Name + Thumbnail */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Thumbnail */}
        <div className="relative w-10 h-10 rounded overflow-hidden bg-background flex-shrink-0">
          {plant.thumbnailUrl ? (
            <Image
              src={plant.thumbnailUrl}
              alt={displayName}
              fill
              sizes="40px"
              placeholder="blur"
              blurDataURL={getBlurDataURL()}
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted text-[10px]">
              —
            </div>
          )}
        </div>

        {/* Name */}
        <span className="font-medium text-sm text-foreground truncate">
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

      {/* Photo count */}
      <div className="hidden sm:block text-sm text-muted text-right tabular-nums">
        {plant.photoCount}
      </div>

      {/* Last updated */}
      <div className="hidden sm:block text-sm text-muted text-right tabular-nums">
        {relativeDate || '—'}
      </div>

      {/* Mobile: Compact metadata */}
      <div className="flex sm:hidden items-center gap-2 text-xs text-muted ml-auto">
        <span className="tabular-nums">{plant.photoCount} photos</span>
        {relativeDate && (
          <>
            <span className="text-muted/40">·</span>
            <span className="tabular-nums">{relativeDate}</span>
          </>
        )}
      </div>

      {/* Chevron indicator */}
      <div className="sm:hidden text-muted/50 group-hover:text-muted">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  )
}
