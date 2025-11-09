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
      <div className="text-center py-12">
        <p className="text-lg text-muted">No photos yet</p>
      </div>
    )
  }

  return (
    <>
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 sm:mb-6">
          Photo Timeline ({photos.length} {photos.length === 1 ? 'photo' : 'photos'})
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {photos.map((photo, index) => {
            const label = getPhotoLabel(photo)
            return (
              <div
                key={photo.id}
                onClick={() => handlePhotoClick(index)}
                className="overflow-hidden rounded-2xl bg-surface border border-border shadow-card transition-all duration-300 hover:shadow-card-hover cursor-pointer group"
              >
                {/* Image */}
                <div className="relative aspect-square bg-background">
                  <Image
                    src={photo.photo_url}
                    alt={`${plantName} - ${label}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    placeholder="blur"
                    blurDataURL={getBlurDataURL()}
                    className="object-cover transition-all duration-400 group-hover:scale-[1.04]"
                  />
                </div>

                {/* Label */}
                <div className="p-3 sm:p-4">
                  <p className="text-sm text-muted">{label}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

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
