'use client'

interface FilterBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedLocation: string
  onLocationChange: (location: string) => void
  locations: string[]
}

export function FilterBar({
  searchQuery,
  onSearchChange,
  selectedLocation,
  onLocationChange,
  locations,
}: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
      {/* Search Input */}
      <div className="relative flex-1">
        {/* Search icon */}
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
          placeholder="Search plants..."
          aria-label="Search plants"
          className="w-full pl-10 pr-10 py-3 bg-surface border border-border rounded-xl text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-transparent transition-shadow"
        />

        {/* Clear button (only visible when there's text) */}
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Location Dropdown */}
      <div className="relative sm:w-48">
        <select
          value={selectedLocation}
          onChange={(e) => onLocationChange(e.target.value)}
          aria-label="Filter by location"
          className="w-full appearance-none px-4 py-3 bg-surface border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-transparent transition-shadow cursor-pointer"
        >
          <option value="">All locations</option>
          {locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>

        {/* Chevron icon */}
        <svg
          className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  )
}
