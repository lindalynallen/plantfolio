'use client'

import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import { Photo } from '@/types'
import { getPhotoLabel } from '@/lib/utils'

interface PhotoLightboxProps {
  photos: Photo[]
  open: boolean
  index: number
  onClose: () => void
  plantName: string
}

export function PhotoLightbox({ photos, open, index, onClose, plantName }: PhotoLightboxProps) {
  // Convert Photo[] to Lightbox slides format
  const slides = photos.map((photo) => ({
    src: photo.photo_url,
    alt: `${plantName} - ${getPhotoLabel(photo)}`,
    title: getPhotoLabel(photo),
  }))

  return (
    <Lightbox
      open={open}
      close={onClose}
      index={index}
      slides={slides}
      carousel={{ finite: true }}
      render={{
        buttonPrev: slides.length <= 1 ? () => null : undefined,
        buttonNext: slides.length <= 1 ? () => null : undefined,
      }}
    />
  )
}
