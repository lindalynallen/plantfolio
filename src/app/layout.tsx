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
      <body className="min-h-screen">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  )
}
