import type { Metadata } from "next"
import { GeistSans } from 'geist/font/sans'
import { Header } from "@/components/Header"
import "./globals.css"

export const metadata: Metadata = {
  title: "Plantfolio - My Plant Collection",
  description: "A personal gallery showcasing my collection of 50+ houseplants with growth timelines",
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
