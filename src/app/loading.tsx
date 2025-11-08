export default function Loading() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
      {/* Hero Skeleton */}
      <div className="text-center mb-12 sm:mb-16">
        <div className="h-12 sm:h-14 lg:h-16 bg-surface border border-border rounded-lg w-96 max-w-full mx-auto mb-4 animate-pulse" />
        <div className="h-6 sm:h-7 bg-surface border border-border rounded-lg w-80 max-w-full mx-auto animate-pulse" />
      </div>

      {/* Plant Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-2xl bg-surface border border-border shadow-sm"
          >
            <div className="aspect-square bg-background animate-pulse" />
            <div className="p-4 space-y-2">
              <div className="h-5 bg-background rounded animate-pulse w-3/4" />
              <div className="h-4 bg-background rounded animate-pulse w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
