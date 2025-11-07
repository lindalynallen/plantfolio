'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Plant } from '@/types'
import { getPlantDisplayName } from '@/lib/utils'

interface PlantCardProps {
  plant: Plant
  thumbnailUrl: string | null
}

export function PlantCard({ plant, thumbnailUrl }: PlantCardProps) {
  const displayName = getPlantDisplayName(plant)

  return (
    <Link href={`/plants/${plant.id}`}>
      <div className="group cursor-pointer border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
        {/* Image */}
        <div className="relative aspect-square bg-gray-100">
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={displayName}
              fill
              className="object-cover group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No photo
            </div>
          )}
        </div>

        {/* Info - name only (no location on homepage) */}
        <div className="p-4">
          <h3 className="font-semibold text-lg">{displayName}</h3>
        </div>
      </div>
    </Link>
  )
}
