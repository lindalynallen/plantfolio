export default function Loading() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">

        {/* Header skeleton */}
        <header className="mb-4 sm:mb-6">
          {/* Back link skeleton */}
          <div className="h-4 w-12 bg-surface-2 rounded animate-pulse mb-3" />

          {/* Plant info row */}
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
            <div>
              <div className="h-6 sm:h-7 w-40 sm:w-56 bg-surface-2 rounded animate-pulse mb-1" />
              <div className="h-4 w-32 bg-surface-2 rounded animate-pulse" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-20 bg-surface-2 rounded-md animate-pulse" />
              <div className="h-6 w-20 bg-surface-2 rounded-md animate-pulse" />
            </div>
          </div>
        </header>

        {/* Photo Grid skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1.5 sm:gap-2">
          {/* Featured photo skeleton - 2x2 */}
          <div className="col-span-2 row-span-2">
            <div className="aspect-square h-full bg-surface border border-border rounded-lg animate-pulse" />
          </div>

          {/* Other photos skeleton */}
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="aspect-square bg-surface border border-border rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    </main>
  )
}
