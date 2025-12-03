'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { PlantWithMeta } from '@/types'
import { SortOption, SortDirection } from '@/components/FilterBar'
import { getPlantDisplayName, getBlurDataURL, formatRelativeDate } from '@/lib/utils'
import { ImagePlaceholderIcon } from '@/components/ui/Icons'

interface PlantListViewProps {
  plants: PlantWithMeta[]
  sortBy: SortOption
  sortDirection: SortDirection
  onSortChange: (sort: SortOption) => void
}

/** Column configuration for the table */
const COLUMNS: { key: SortOption; label: string; align: 'left' | 'right' }[] = [
  { key: 'name', label: 'Name', align: 'left' },
  { key: 'species', label: 'Species', align: 'left' },
  { key: 'location', label: 'Location', align: 'left' },
  { key: 'photos', label: 'Photos', align: 'right' },
  { key: 'updated', label: 'Updated', align: 'right' },
]

/** Sort direction indicator arrow */
function SortArrow({ direction, active }: { direction: SortDirection; active: boolean }) {
  if (!active) return null

  return (
    <svg
      className="w-3.5 h-3.5 ml-1 flex-shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      {direction === 'asc' ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      )}
    </svg>
  )
}

export function PlantListView({ plants, sortBy, sortDirection, onSortChange }: PlantListViewProps) {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {/* Header row - desktop only */}
      <div className="hidden sm:grid sm:grid-cols-[2fr_1.5fr_1fr_0.75fr_0.75fr] gap-4 px-4 py-3 bg-surface-2 text-sm font-medium border-b border-border">
        {COLUMNS.map((column) => {
          const isActive = sortBy === column.key
          const isRight = column.align === 'right'

          return (
            <button
              key={column.key}
              onClick={() => onSortChange(column.key)}
              className={`flex items-center gap-0.5 transition-colors ${
                isRight ? 'justify-end' : ''
              } ${
                isActive
                  ? 'text-foreground'
                  : 'text-muted hover:text-foreground'
              }`}
              aria-label={`Sort by ${column.label}${isActive ? `, currently ${sortDirection === 'asc' ? 'ascending' : 'descending'}` : ''}`}
            >
              {/* Show arrow before text for right-aligned columns */}
              {isRight && <SortArrow direction={sortDirection} active={isActive} />}
              <span>{column.label}</span>
              {/* Show arrow after text for left-aligned columns */}
              {!isRight && <SortArrow direction={sortDirection} active={isActive} />}
            </button>
          )
        })}
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
        {/* Thumbnail */}
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
