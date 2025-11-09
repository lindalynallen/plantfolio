export default function Loading() {
  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      {/* Back link skeleton */}
      <div className="h-6 w-32 bg-surface border border-border rounded-lg mb-6 animate-pulse" />

      {/* Plant name skeleton */}
      <div className="h-12 sm:h-14 lg:h-16 w-3/4 max-w-2xl bg-surface border border-border rounded-lg mb-4 animate-pulse" />

      {/* Scientific name skeleton */}
      <div className="h-8 w-1/2 max-w-xl bg-surface border border-border rounded-lg mb-6 animate-pulse" />

      {/* Metadata skeleton */}
      <div className="flex gap-6 mb-8 sm:mb-12 lg:mb-16">
        <div className="h-6 w-32 bg-surface border border-border rounded-lg animate-pulse" />
        <div className="h-6 w-40 bg-surface border border-border rounded-lg animate-pulse" />
      </div>

      {/* Timeline header skeleton */}
      <div className="h-8 w-56 bg-surface border border-border rounded-lg mb-6 sm:mb-8 animate-pulse" />

      {/* Photo grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-border bg-surface">
            <div className="aspect-square bg-background animate-pulse" />
            <div className="p-3 sm:p-4">
              <div className="h-4 w-24 bg-background rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
