export default function Loading() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8"> 

        {/* Header skeleton */}
        <header className="mb-6 sm:mb-8">
          {/* Back link skeleton */}
          <div className="h-4 w-12 bg-surface-2 rounded animate-pulse mb-3" />

          {/* Plant info row */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="h-6 sm:h-7 w-40 sm:w-56 bg-surface-2 rounded animate-pulse mb-1" />
              <div className="h-4 w-32 bg-surface-2 rounded animate-pulse" />
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="h-6 w-20 bg-surface-2 rounded-md animate-pulse" />
              <div className="h-6 w-20 bg-surface-2 rounded-md animate-pulse" />
            </div>
          </div>
        </header>

        {/* Photo Grid skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3">
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
