import type { Metadata, Viewport } from "next"
import { GeistSans } from 'geist/font/sans'
import { Header } from "@/components/Header"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://plantfolio-app.vercel.app"),
  title: "Plantfolio - My Plant Collection",
  description: "A personal gallery showcasing my collection of 50+ houseplants with growth timelines",
  openGraph: {
    title: "Plantfolio",
    description: "A personal plant collection",
    // images auto-generated from opengraph-image.png by Next.js file convention
  },
  twitter: {
    card: "summary_large_image",
    title: "Plantfolio",
    description: "A personal plant collection",
    // images auto-generated from opengraph-image.png by Next.js file convention
  },
}

export const viewport: Viewport = {
  colorScheme: "light dark",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={GeistSans.className}>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="py-6 text-center text-sm text-muted border-t border-border">
          <p>Plantfolio &copy; {new Date().getFullYear()}</p>
        </footer>
      </body>
    </html>
  )
}
