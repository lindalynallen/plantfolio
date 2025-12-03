'use client'

export type SortOption = 'name' | 'species' | 'location' | 'photos' | 'updated'
export type SortDirection = 'asc' | 'desc'
export type ViewMode = 'grid' | 'list'

/** Default sort direction for each column (what makes sense on first click) */
export const DEFAULT_SORT_DIRECTIONS: Record<SortOption, SortDirection> = {
  name: 'asc',      // A→Z
  species: 'asc',   // A→Z
  location: 'asc',  // A→Z
  photos: 'desc',   // Most photos first
  updated: 'desc',  // Newest first
}

interface FilterBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedLocation: string
  onLocationChange: (location: string) => void
  locations: string[]
  sortBy: SortOption
  onSortChange: (sort: SortOption, direction?: SortDirection) => void
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'name', label: 'Name' },
  { value: 'species', label: 'Species' },
  { value: 'location', label: 'Location' },
  { value: 'updated', label: 'Recently updated' },
  { value: 'photos', label: 'Photo count' },
]

export function FilterBar({
  searchQuery,
  onSearchChange,
  selectedLocation,
  onLocationChange,
  locations,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
}: FilterBarProps) {
  // When dropdown changes, use default direction for that sort type
  const handleSortDropdownChange = (newSort: SortOption) => {
    onSortChange(newSort, DEFAULT_SORT_DIRECTIONS[newSort])
  }
  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Row 1: Search only on mobile, Search + all filters on desktop */}
      <div className="flex items-center gap-2">
        {/* Search Input - grows to fill available space */}
        <div className="relative flex-1 sm:max-w-md">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search..."
            aria-label="Search plants"
            className="w-full h-11 sm:h-10 pl-10 pr-10 text-base bg-surface border border-border rounded-lg text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
          />

          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-md text-muted hover:text-foreground hover:bg-surface-2 transition-colors"
              aria-label="Clear search"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Desktop: Location Filter */}
        <div className="hidden sm:block relative">
          <select
            value={selectedLocation}
            onChange={(e) => onLocationChange(e.target.value)}
            aria-label="Filter by location"
            className="h-11 sm:h-10 appearance-none pl-3 pr-8 text-base bg-surface border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors cursor-pointer"
          >
            <option value="">All locations</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
          <svg
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Desktop: Sort Dropdown */}
        <div className="hidden sm:block relative">
          <select
            value={sortBy}
            onChange={(e) => handleSortDropdownChange(e.target.value as SortOption)}
            aria-label="Sort by"
            className="h-11 sm:h-10 appearance-none pl-3 pr-8 text-base bg-surface border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors cursor-pointer"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <svg
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Desktop: View Toggle */}
        <div className="hidden sm:flex items-center gap-1 p-1 bg-surface-2 rounded-lg border border-border ml-auto">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-surface text-foreground shadow-xs'
                  : 'text-muted hover:text-foreground'
              }`}
              aria-label="Grid view"
              aria-pressed={viewMode === 'grid'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-surface text-foreground shadow-xs'
                  : 'text-muted hover:text-foreground'
              }`}
              aria-label="List view"
              aria-pressed={viewMode === 'list'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
        </div>
      </div>

      {/* Row 2: Mobile only - Filters + View Toggle */}
      <div className="flex sm:hidden items-center gap-2">
        {/* Location Filter */}
        <div className="relative flex-1 min-w-0">
          <select
            value={selectedLocation}
            onChange={(e) => onLocationChange(e.target.value)}
            aria-label="Filter by location"
            className="w-full h-11 appearance-none pl-3 pr-8 text-base bg-surface border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors cursor-pointer"
          >
            <option value="">All locations</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
          <svg
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Sort Dropdown */}
        <div className="relative flex-1 min-w-0">
          <select
            value={sortBy}
            onChange={(e) => handleSortDropdownChange(e.target.value as SortOption)}
            aria-label="Sort by"
            className="w-full h-11 appearance-none pl-3 pr-8 text-base bg-surface border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors cursor-pointer"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <svg
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 p-1 bg-surface-2 rounded-lg border border-border flex-shrink-0">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'grid'
                ? 'bg-surface text-foreground shadow-xs'
                : 'text-muted hover:text-foreground'
            }`}
            aria-label="Grid view"
            aria-pressed={viewMode === 'grid'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'list'
                ? 'bg-surface text-foreground shadow-xs'
                : 'text-muted hover:text-foreground'
            }`}
            aria-label="List view"
            aria-pressed={viewMode === 'list'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
