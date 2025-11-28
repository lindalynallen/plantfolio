'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Plant } from '@/types'
import { PlantCard } from '@/components/PlantCard'
import { FilterBar } from '@/components/FilterBar'

interface PlantWithThumbnail extends Plant {
  thumbnailUrl: string | null
}

interface PlantGalleryProps {
  plants: PlantWithThumbnail[]
  stats: {
    totalPlants: number
    totalPhotos: number
    totalLocations: number
  }
  locations: string[]
}

/**
 * Check if a plant matches the search query
 * Searches across: localized name, custom name, scientific name, and variety
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

export function PlantGallery({ plants, stats, locations }: PlantGalleryProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Initialize filter state from URL (enables shareable links)
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('search') || ''
  )
  const [selectedLocation, setSelectedLocation] = useState(
    searchParams.get('location') || ''
  )

  // Keep URL in sync with filter state
  // Note: Updates on every change (not debounced) - acceptable for small dataset
  useEffect(() => {
    const params = new URLSearchParams()
    if (searchQuery) params.set('search', searchQuery)
    if (selectedLocation) params.set('location', selectedLocation)

    const queryString = params.toString()
    const newUrl = queryString ? `?${queryString}` : '/'

    // Use replace to avoid polluting browser history with every keystroke
    router.replace(newUrl, { scroll: false })
  }, [searchQuery, selectedLocation, router])

  // Filter plants based on current search and location
  const filteredPlants = useMemo(() => {
    return plants.filter((plant) => {
      const matchesSearch = plantMatchesSearch(plant, searchQuery)
      const matchesLocation = plantMatchesLocation(plant, selectedLocation)
      return matchesSearch && matchesLocation
    })
  }, [plants, searchQuery, selectedLocation])

  // Are any filters currently active?
  const hasActiveFilters = searchQuery || selectedLocation

  // Build the "Showing X of Y plants in Z" message
  const filterResultsMessage = selectedLocation
    ? `Showing ${filteredPlants.length} of ${stats.totalPlants} plants in ${selectedLocation}`
    : `Showing ${filteredPlants.length} of ${stats.totalPlants} plants`

  // Reset all filters to default state
  const clearFilters = () => {
    setSearchQuery('')
    setSelectedLocation('')
  }

  return (
    <div className="container mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Stats Headline */}
      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-center text-foreground mb-6 sm:mb-8">
        {stats.totalPlants} plants
        <span className="text-muted/40 mx-2">&bull;</span>
        {stats.totalPhotos} photos
        <span className="text-muted/40 mx-2">&bull;</span>
        {stats.totalLocations} locations
      </h1>

      {/* Search and Filter Bar */}
      <div className="mb-6 sm:mb-8">
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedLocation={selectedLocation}
          onLocationChange={setSelectedLocation}
          locations={locations}
        />
      </div>

      {/* Results Count (only shown when filtering) */}
      {hasActiveFilters && (
        <p className="text-center text-muted mb-4 sm:mb-6">
          {filterResultsMessage}
        </p>
      )}

      {/* Plant Grid */}
      {filteredPlants.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {filteredPlants.map((plant, index) => (
            <PlantCard
              key={plant.id}
              plant={plant}
              thumbnailUrl={plant.thumbnailUrl}
              priority={index < 6} // Prioritize first 6 images (above-the-fold)
            />
          ))}
        </div>
      ) : (
        <EmptyState onClearFilters={clearFilters} />
      )}
    </div>
  )
}

/**
 * Shown when no plants match the current filters
 */
function EmptyState({ onClearFilters }: { onClearFilters: () => void }) {
  return (
    <div className="text-center py-12">
      <p className="text-muted text-lg">No plants found matching your search</p>
      <button
        onClick={onClearFilters}
        className="mt-4 text-foreground underline underline-offset-4 hover:text-muted transition-colors"
      >
        Clear filters
      </button>
    </div>
  )
}
