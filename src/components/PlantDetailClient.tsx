'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Plant, Photo } from '@/types'
import { getPlantDisplayName, getBlurDataURL, formatShortDate, formatRelativeDate } from '@/lib/utils'
import { PhotoLightbox } from './PhotoLightbox'

interface PlantDetailClientProps {
  plant: Plant
  photos: Photo[]
}

export function PlantDetailClient({ plant, photos }: PlantDetailClientProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const displayName = getPlantDisplayName(plant)

  const openLightbox = (index: number) => {
    setCurrentIndex(index)
    setLightboxOpen(true)
  }

  // Split photos: first one is featured (larger), rest are regular
  const [featuredPhoto, ...otherPhotos] = photos

  // Get the date range for photos
  const photosDates = photos
    .filter(p => p.planta_last_updated)
    .map(p => new Date(p.planta_last_updated!).getTime())
  const oldestDate = photosDates.length > 0 ? new Date(Math.min(...photosDates)) : null
  const newestDate = photosDates.length > 0 ? new Date(Math.max(...photosDates)) : null

  return (
    <>
      <main className="min-h-screen">
        <div className="container mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">

          {/* Header */}
          <header className="mb-4 sm:mb-6">
            {/* Back link */}
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition-colors mb-3"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back</span>
            </Link>

            {/* Plant info row */}
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-foreground">
                  {displayName}
                </h1>
                {plant.scientific_name && (
                  <p className="text-sm text-muted italic mt-0.5">{plant.scientific_name}</p>
                )}
              </div>

              {/* Metadata badges */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                {plant.location && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-surface-2 rounded-md">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {plant.location}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-surface-2 rounded-md tabular-nums">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {photos.length} {photos.length === 1 ? 'photo' : 'photos'}
                </span>
                {newestDate && (
                  <span className="text-muted/70 tabular-nums">
                    Updated {formatRelativeDate(newestDate.toISOString())}
                  </span>
                )}
              </div>
            </div>
          </header>

          {/* Photo Grid */}
          {photos.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1.5 sm:gap-2">

              {/* Featured photo - spans 2x2 */}
              {featuredPhoto && (
                <div
                  onClick={() => openLightbox(0)}
                  className="col-span-2 row-span-2 group cursor-pointer"
                >
                  <div className="relative aspect-square h-full overflow-hidden rounded-lg bg-surface border border-border transition-colors hover:border-border-hover">
                    <Image
                      src={featuredPhoto.photo_url}
                      alt={`${displayName}`}
                      fill
                      priority
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 40vw"
                      placeholder="blur"
                      blurDataURL={getBlurDataURL()}
                      className="object-cover"
                    />
                    {/* Date label */}
                    {featuredPhoto.planta_last_updated && (
                      <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3">
                        <span className="inline-block px-2 py-0.5 text-[10px] sm:text-xs font-medium bg-black/70 backdrop-blur-sm text-white/90 rounded">
                          {formatShortDate(featuredPhoto.planta_last_updated)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Other photos */}
              {otherPhotos.map((photo, index) => (
                <div
                  key={photo.id}
                  onClick={() => openLightbox(index + 1)}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-surface border border-border transition-colors hover:border-border-hover">
                    <Image
                      src={photo.photo_url}
                      alt={`${displayName}`}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      placeholder="blur"
                      blurDataURL={getBlurDataURL()}
                      className="object-cover"
                    />
                    {/* Date label */}
                    {photo.planta_last_updated && (
                      <div className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2">
                        <span className="inline-block px-1.5 py-0.5 text-[9px] sm:text-[10px] font-medium bg-black/70 backdrop-blur-sm text-white/90 rounded">
                          {formatShortDate(photo.planta_last_updated)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-surface-2 mb-4">
                <svg className="w-6 h-6 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-muted text-sm">No photos yet</p>
            </div>
          )}
        </div>
      </main>

      {/* Lightbox */}
      <PhotoLightbox
        photos={photos}
        open={lightboxOpen}
        index={currentIndex}
        onClose={() => setLightboxOpen(false)}
        plantName={displayName}
      />
    </>
  )
}
