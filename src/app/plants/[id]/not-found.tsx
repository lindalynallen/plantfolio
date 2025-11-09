import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
      <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
        Plant Not Found
      </h1>
      <p className="text-lg text-muted mb-8">
        Sorry, we couldn't find that plant in the collection.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-lg text-foreground transition-opacity hover:opacity-80"
      >
        <span>←</span>
        <span>Back to gallery</span>
      </Link>
    </main>
  )
}
