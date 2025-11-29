'use client'

import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
          Something went wrong
        </h1>

        <p className="text-lg text-muted mb-6">
          We ran into an unexpected problem.
        </p>

        {error.message && (
          <div className="bg-surface border border-border rounded-lg p-4 mb-8 text-left">
            <p className="text-sm text-muted font-mono break-words">
              {error.message}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-foreground text-background rounded-lg hover:opacity-90 transition-opacity font-medium"
          >
            Try again
          </button>

          <Link
            href="/"
            className="px-6 py-3 bg-surface text-foreground border border-border rounded-lg hover:bg-background transition-colors font-medium"
          >
            Back to gallery
          </Link>
        </div>
      </div>
    </main>
  )
}
