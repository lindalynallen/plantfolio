import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
      <h1 className="text-4xl sm:text-5xl font-semibold text-foreground mb-4">
        Plant Not Found
      </h1>
      <p className="text-lg text-muted mb-8">
        Sorry, we couldn't find that plant in the collection.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-lg hover:opacity-90 transition-opacity font-medium"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back to gallery</span>
      </Link>
    </main>
  )
}
