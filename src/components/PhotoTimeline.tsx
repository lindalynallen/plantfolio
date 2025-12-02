'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Photo } from '@/types'
import { getPhotoLabel, getBlurDataURL } from '@/lib/utils'
import { PhotoLightbox } from './PhotoLightbox'

interface PhotoTimelineProps {
  photos: Photo[]
  plantName: string
}

export function PhotoTimeline({ photos, plantName }: PhotoTimelineProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const handlePhotoClick = (index: number) => {
    setCurrentIndex(index)
    setLightboxOpen(true)
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-16 sm:py-24">
        <p className="text-lg text-muted">No photos yet</p>
      </div>
    )
  }

  return (
    <>
      <section>
        {/* Minimal section header */}
        <div className="flex items-baseline justify-between mb-6 sm:mb-8">
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted">
            Timeline
          </h2>
          <span className="text-sm text-muted/70">
            {photos.length} {photos.length === 1 ? 'photo' : 'photos'}
          </span>
        </div>

        {/* Clean photo grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {photos.map((photo, index) => {
            const label = getPhotoLabel(photo)
            return (
              <div
                key={photo.id}
                onClick={() => handlePhotoClick(index)}
                className="group cursor-pointer"
              >
                {/* Image container */}
                <div className="relative aspect-square overflow-hidden rounded-xl bg-surface
                               ring-1 ring-border/50 transition-all duration-150
                               group-hover:ring-border group-hover:shadow-lg group-hover:shadow-black/10">
                  <Image
                    src={photo.photo_url}
                    alt={`${plantName} - ${label}`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    placeholder="blur"
                    blurDataURL={getBlurDataURL()}
                    className="object-cover transition-transform duration-300
                               group-hover:scale-105"
                  />
                </div>

                {/* Label below image */}
                <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-muted truncate">
                  {label}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Lightbox */}
      <PhotoLightbox
        photos={photos}
        open={lightboxOpen}
        index={currentIndex}
        onClose={() => setLightboxOpen(false)}
        plantName={plantName}
      />
    </>
  )
}
