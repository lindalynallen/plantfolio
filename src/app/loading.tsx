export default function Loading() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Stats headline skeleton */}
      <div className="h-8 sm:h-9 bg-surface border border-border rounded-lg w-80 sm:w-96 mx-auto mb-6 sm:mb-8 animate-pulse" />

      {/* Filter bar skeleton */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="h-12 bg-surface border border-border rounded-xl flex-1 animate-pulse" />
        <div className="h-12 bg-surface border border-border rounded-xl sm:w-48 animate-pulse" />
      </div>

      {/* Grid skeleton - matches PlantGallery grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl bg-surface border border-border shadow-card"
          >
            <div className="aspect-square bg-background animate-pulse" />
            <div className="p-2.5 sm:p-4 space-y-2">
              <div className="h-4 sm:h-5 bg-background rounded animate-pulse w-3/4" />
              <div className="h-3 sm:h-4 bg-background rounded animate-pulse w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
