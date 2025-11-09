import Link from 'next/link'
import { Plant } from '@/types'
import { getPlantDisplayName } from '@/lib/utils'

interface PlantHeaderProps {
  plant: Plant
}

export function PlantHeader({ plant }: PlantHeaderProps) {
  const displayName = getPlantDisplayName(plant)

  return (
    <div className="mb-6 sm:mb-8">
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-lg text-foreground transition-opacity hover:opacity-80 mb-4"
      >
        <span>←</span>
        <span>Back to gallery</span>
      </Link>

      {/* Plant name */}
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-3">
        {displayName}
      </h1>

      {/* Scientific name */}
      {plant.scientific_name && (
        <p className="text-xl sm:text-2xl italic text-muted mb-4">
          {plant.scientific_name}
        </p>
      )}

      {/* Metadata grid */}
      {(plant.variety || plant.location) && (
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-lg text-muted">
          {plant.location && (
            <p>
              <span className="font-medium">Location:</span> {plant.location}
            </p>
          )}
          {plant.variety && (
            <p>
              <span className="font-medium">Variety:</span> {plant.variety}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
