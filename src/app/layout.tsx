import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Plantfolio - My Plant Collection",
  description: "A personal gallery showcasing my collection of 50+ houseplants with growth timelines",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen antialiased">
        <header className="bg-white border-b">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold text-green-700">
              🌿 Plantfolio
            </h1>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
