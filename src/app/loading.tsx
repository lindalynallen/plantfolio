export default function Loading() {
  return (
    <div className="container mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
      {/* Stats bar skeleton */}
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <div className="flex items-center gap-3">
          <div className="h-5 w-20 bg-surface-2 rounded animate-pulse" />
          <div className="h-5 w-1 bg-surface-2 rounded animate-pulse" />
          <div className="h-5 w-20 bg-surface-2 rounded animate-pulse" />
          <div className="hidden sm:block h-5 w-1 bg-surface-2 rounded animate-pulse" />
          <div className="hidden sm:block h-5 w-24 bg-surface-2 rounded animate-pulse" />
        </div>
      </div>

      {/* Filter bar skeleton */}
      <div className="flex flex-col gap-2 mb-4 sm:mb-5">
        {/* Row 1: Search + desktop filters */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 sm:flex-initial">
            {/* Search */}
            <div className="h-8 bg-surface border border-border rounded-md flex-1 sm:w-[448px] sm:flex-initial animate-pulse" />
            {/* Desktop: Location + Sort */}
            <div className="hidden sm:block h-8 w-32 bg-surface border border-border rounded-md animate-pulse" />
            <div className="hidden sm:block h-8 w-36 bg-surface border border-border rounded-md animate-pulse" />
          </div>
          {/* Desktop: View toggle */}
          <div className="hidden sm:block h-8 w-[72px] bg-surface-2 border border-border rounded-md animate-pulse" />
        </div>

        {/* Row 2: Mobile only - filters + view toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <div className="h-8 bg-surface border border-border rounded-md flex-1 animate-pulse" />
          <div className="h-8 bg-surface border border-border rounded-md flex-1 animate-pulse" />
          <div className="h-8 w-[72px] bg-surface-2 border border-border rounded-md flex-shrink-0 animate-pulse" />
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3">
        {Array.from({ length: 18 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-lg bg-surface border border-border"
          >
            <div className="aspect-[4/3] bg-surface-2 animate-pulse" />
            <div className="p-2 sm:p-2.5 space-y-1.5">
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
