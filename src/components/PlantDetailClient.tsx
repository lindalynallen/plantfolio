'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Plant, Photo } from '@/types'
import { getPlantDisplayName, getBlurDataURL, getPhotoLabel } from '@/lib/utils'
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

  return (
    <>
      <main className="min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">

          {/* Compact Header */}
          <header className="mb-6 sm:mb-8">
            {/* Back link */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-4"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to gallery</span>
            </Link>

            {/* Plant info */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
              {displayName}
            </h1>
            <div className="flex flex-wrap items-center gap-x-2 mt-1 text-sm sm:text-base text-muted">
              {plant.scientific_name && (
                <span className="italic">{plant.scientific_name}</span>
              )}
              {plant.scientific_name && (plant.location || photos.length > 0) && (
                <span className="text-muted/50">·</span>
              )}
              {plant.location && (
                <span>{plant.location}</span>
              )}
              {plant.location && photos.length > 0 && (
                <span className="text-muted/50">·</span>
              )}
              {photos.length > 0 && (
                <span>{photos.length} {photos.length === 1 ? 'photo' : 'photos'}</span>
              )}
            </div>
          </header>

          {/* Bento Grid */}
          {photos.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3">

              {/* Featured photo - spans 2x2 */}
              {featuredPhoto && (
                <div
                  onClick={() => openLightbox(0)}
                  className="col-span-2 row-span-2 group cursor-pointer"
                >
                  <div className="relative aspect-square h-full overflow-hidden rounded-xl sm:rounded-2xl bg-surface
                                 ring-1 ring-border/50 transition-all duration-300
                                 group-hover:ring-border group-hover:shadow-xl group-hover:shadow-black/15">
                    <Image
                      src={featuredPhoto.photo_url}
                      alt={`${displayName} - ${getPhotoLabel(featuredPhoto)}`}
                      fill
                      priority
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 40vw"
                      placeholder="blur"
                      blurDataURL={getBlurDataURL()}
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    {/* Date badge */}
                    <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4">
                      <span className="inline-block px-2.5 py-1 text-xs sm:text-sm font-medium
                                     bg-black/60 backdrop-blur-sm text-white rounded-full">
                        {getPhotoLabel(featuredPhoto)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Other photos - regular 1x1 */}
              {otherPhotos.map((photo, index) => {
                const label = getPhotoLabel(photo)
                return (
                  <div
                    key={photo.id}
                    onClick={() => openLightbox(index + 1)}
                    className="group cursor-pointer"
                  >
                    <div className="relative aspect-square overflow-hidden rounded-xl sm:rounded-2xl bg-surface
                                   ring-1 ring-border/50 transition-all duration-300
                                   group-hover:ring-border group-hover:shadow-lg group-hover:shadow-black/10">
                      <Image
                        src={photo.photo_url}
                        alt={`${displayName} - ${label}`}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        placeholder="blur"
                        blurDataURL={getBlurDataURL()}
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* Date badge */}
                      <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3">
                        <span className="inline-block px-2 py-0.5 text-[10px] sm:text-xs font-medium
                                       bg-black/60 backdrop-blur-sm text-white rounded-full">
                          {label}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-16 sm:py-24">
              <p className="text-lg text-muted">No photos yet</p>
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
