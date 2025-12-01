'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Plant } from '@/types'
import { PlantCard } from '@/components/PlantCard'
import { PlantListView } from '@/components/PlantListView'
import { FilterBar, SortOption, ViewMode } from '@/components/FilterBar'
import { getPlantDisplayName } from '@/lib/utils'

interface PlantWithMeta extends Plant {
  thumbnailUrl: string | null
  photoCount: number
  lastUpdated: string | null
}

interface PlantGalleryProps {
  plants: PlantWithMeta[]
  stats: {
    totalPlants: number
    totalPhotos: number
    totalLocations: number
  }
  locations: string[]
}

/**
 * Check if a plant matches the search query
 */
function plantMatchesSearch(plant: Plant, query: string): boolean {
  if (!query) return true
  const searchLower = query.toLowerCase()
  return (
    plant.localized_name.toLowerCase().includes(searchLower) ||
    plant.custom_name?.toLowerCase().includes(searchLower) ||
    plant.scientific_name?.toLowerCase().includes(searchLower) ||
    plant.variety?.toLowerCase().includes(searchLower) ||
    false
  )
}

/**
 * Check if a plant matches the selected location filter
 */
function plantMatchesLocation(plant: Plant, location: string): boolean {
  if (!location) return true
  return plant.location === location
}

/**
 * Sort plants based on sort option
 */
function sortPlants(plants: PlantWithMeta[], sortBy: SortOption): PlantWithMeta[] {
  return [...plants].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return getPlantDisplayName(a).localeCompare(getPlantDisplayName(b))
      case 'updated':
        // Most recently updated first, nulls last
        if (!a.lastUpdated && !b.lastUpdated) return 0
        if (!a.lastUpdated) return 1
        if (!b.lastUpdated) return -1
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      case 'photos':
        // Most photos first
        return b.photoCount - a.photoCount
      default:
        return 0
    }
  })
}

export function PlantGallery({ plants, stats, locations }: PlantGalleryProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Initialize state from URL
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('location') || '')
  const [sortBy, setSortBy] = useState<SortOption>((searchParams.get('sort') as SortOption) || 'name')
  const [viewMode, setViewMode] = useState<ViewMode>((searchParams.get('view') as ViewMode) || 'grid')

  // Keep URL in sync with state
  useEffect(() => {
    const params = new URLSearchParams()
    if (searchQuery) params.set('search', searchQuery)
    if (selectedLocation) params.set('location', selectedLocation)
    if (sortBy !== 'name') params.set('sort', sortBy)
    if (viewMode !== 'grid') params.set('view', viewMode)

    const queryString = params.toString()
    const newUrl = queryString ? `?${queryString}` : '/'
    router.replace(newUrl, { scroll: false })
  }, [searchQuery, selectedLocation, sortBy, viewMode, router])

  // Filter and sort plants
  const processedPlants = useMemo(() => {
    const filtered = plants.filter((plant) => {
      return plantMatchesSearch(plant, searchQuery) && plantMatchesLocation(plant, selectedLocation)
    })
    return sortPlants(filtered, sortBy)
  }, [plants, searchQuery, selectedLocation, sortBy])

  const hasActiveFilters = searchQuery || selectedLocation
  const clearFilters = () => {
    setSearchQuery('')
    setSelectedLocation('')
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
      {/* Stats Bar */}
      <div className="flex items-center justify-between mb-5 sm:mb-6 min-h-[36px]">
        <div className="flex items-baseline gap-2 sm:gap-3 text-muted">
          <span>
            <span className="text-xl font-semibold text-foreground tabular-nums">{stats.totalPlants}</span>
            {' '}plants
          </span>
          <span className="text-muted/40">|</span>
          <span>
            <span className="text-xl font-semibold text-foreground tabular-nums">{stats.totalPhotos}</span>
            {' '}photos
          </span>
          <span className="hidden sm:inline text-muted/40">|</span>
          <span className="hidden sm:inline">
            <span className="text-xl font-semibold text-foreground tabular-nums">{stats.totalLocations}</span>
            {' '}locations
          </span>
        </div>

        {/* Active filter indicator */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted hover:text-foreground bg-surface-2 hover:bg-surface border border-border rounded-lg transition-colors"
          >
            <span className="tabular-nums">{processedPlants.length} results</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="mb-5 sm:mb-6">
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedLocation={selectedLocation}
          onLocationChange={setSelectedLocation}
          locations={locations}
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      </div>

      {/* Plant View */}
      {processedPlants.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {processedPlants.map((plant, index) => (
              <PlantCard
                key={plant.id}
                plant={plant}
                thumbnailUrl={plant.thumbnailUrl}
                photoCount={plant.photoCount}
                lastUpdated={plant.lastUpdated}
                priority={index < 12}
              />
            ))}
          </div>
        ) : (
          <PlantListView plants={processedPlants} />
        )
      ) : (
        <EmptyState onClearFilters={clearFilters} />
      )}
    </div>
  )
}

function EmptyState({ onClearFilters }: { onClearFilters: () => void }) {
  return (
    <div className="text-center py-20">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-2 mb-5">
        <svg className="w-8 h-8 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <p className="text-lg text-muted mb-4">No plants found</p>
      <button
        onClick={onClearFilters}
        className="px-4 py-2 text-sm font-medium text-foreground bg-surface hover:bg-surface-2 border border-border rounded-lg transition-colors"
      >
        Clear filters
      </button>
    </div>
  )
}
