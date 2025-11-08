import Link from 'next/link'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold text-foreground transition-opacity hover:opacity-80"
          >
            <span className="text-xl">🌿</span>
            <span>Plantfolio</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
