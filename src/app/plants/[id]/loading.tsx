export default function Loading() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">

        {/* Compact Header skeleton */}
        <header className="mb-6 sm:mb-8">
          {/* Back link skeleton */}
          <div className="h-5 w-32 bg-surface border border-border rounded animate-pulse mb-4" />

          {/* Plant name skeleton */}
          <div className="h-8 sm:h-9 lg:h-10 w-48 sm:w-64 bg-surface border border-border rounded-lg animate-pulse mb-2" />

          {/* Metadata skeleton */}
          <div className="flex items-center gap-2">
            <div className="h-4 sm:h-5 w-32 bg-surface border border-border rounded animate-pulse" />
            <div className="h-4 sm:h-5 w-2 bg-surface border border-border rounded-full animate-pulse" />
            <div className="h-4 sm:h-5 w-20 bg-surface border border-border rounded animate-pulse" />
            <div className="h-4 sm:h-5 w-2 bg-surface border border-border rounded-full animate-pulse" />
            <div className="h-4 sm:h-5 w-16 bg-surface border border-border rounded animate-pulse" />
          </div>
        </header>

        {/* Bento Grid skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3">
          {/* Featured photo skeleton - 2x2 */}
          <div className="col-span-2 row-span-2">
            <div className="aspect-square h-full bg-surface border border-border shadow-card rounded-xl sm:rounded-2xl animate-pulse" />
          </div>

          {/* Other photos skeleton */}
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i}>
              <div className="aspect-square bg-surface border border-border shadow-card rounded-xl sm:rounded-2xl animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
