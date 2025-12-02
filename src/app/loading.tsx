export default function Loading() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
      {/* Stats bar skeleton */}
      <div className="flex items-center gap-3 mb-5 sm:mb-6">
        <div className="h-5 w-24 bg-surface-2 rounded animate-pulse" />
        <div className="h-5 w-24 bg-surface-2 rounded animate-pulse" />
        <div className="hidden sm:block h-5 w-24 bg-surface-2 rounded animate-pulse" />
      </div>

      {/* Filter bar skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 sm:mb-6">
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <div className="h-11 sm:h-10 bg-surface border border-border rounded-lg flex-1 max-w-md animate-pulse" />
          <div className="h-11 sm:h-10 w-32 bg-surface border border-border rounded-lg animate-pulse hidden sm:block" />
          <div className="h-11 sm:h-10 w-36 bg-surface border border-border rounded-lg animate-pulse hidden sm:block" />
        </div>
        <div className="h-10 w-20 bg-surface-2 border border-border rounded-lg animate-pulse hidden sm:block" />
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
        {Array.from({ length: 18 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-lg bg-surface border border-border"
          >
            <div className="aspect-square bg-surface-2 animate-pulse" />
            <div className="p-3 sm:p-4 space-y-2">
              <div className="h-4 bg-surface-2 rounded animate-pulse w-3/4" />
              <div className="h-3 bg-surface-2 rounded animate-pulse w-1/2" />
              <div className="h-3 bg-surface-2 rounded animate-pulse w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
