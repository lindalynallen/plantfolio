import { describe, it, expect } from 'vitest'
import { getPlantDisplayName, getMostRecentPhoto, sortPhotos, getPhotoLabel } from '@/lib/utils'
import type { Plant, Photo } from '@/types'

describe('getPlantDisplayName', () => {
  it('returns custom_name when present', () => {
    const plant: Plant = {
      id: '1',
      planta_id: 'test-1',
      localized_name: 'Monstera',
      custom_name: 'My Monstera',
      variety: null,
      scientific_name: null,
      location: null,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    expect(getPlantDisplayName(plant)).toBe('My Monstera')
  })

  it('falls back to localized_name when custom_name is null', () => {
    const plant: Plant = {
      id: '1',
      planta_id: 'test-1',
      localized_name: 'Monstera',
      custom_name: null,
      variety: null,
      scientific_name: null,
      location: null,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    expect(getPlantDisplayName(plant)).toBe('Monstera')
  })
})

describe('getMostRecentPhoto', () => {
  it('returns null when photos array is empty', () => {
    expect(getMostRecentPhoto([])).toBeNull()
  })

  it('returns Planta photo when both Planta and historical exist', () => {
    const photos: Photo[] = [
      {
        id: '1',
        plant_id: 'plant-1',
        photo_url: 'https://example.com/historical.jpg',
        storage_path: 'historical/plant/01.jpg',
        source: 'historical',
        planta_image_url: null,
        planta_last_updated: null,
        display_order: 1,
        taken_at: null,
        created_at: new Date().toISOString(),
      },
      {
        id: '2',
        plant_id: 'plant-1',
        photo_url: 'https://example.com/planta.webp',
        storage_path: 'planta/plant-1-2024-11-26.webp',
        source: 'planta',
        planta_image_url: 'https://planta.com/photo.webp',
        planta_last_updated: new Date('2024-11-26').toISOString(),
        display_order: null,
        taken_at: null,
        created_at: new Date().toISOString(),
      },
    ]

    expect(getMostRecentPhoto(photos)).toBe('https://example.com/planta.webp')
  })
})

describe('sortPhotos', () => {
  it('returns empty array when input is empty', () => {
    expect(sortPhotos([])).toEqual([])
  })

  it('sorts Planta photos before historical photos', () => {
    const photos: Photo[] = [
      {
        id: '1',
        plant_id: 'plant-1',
        photo_url: 'https://example.com/historical.jpg',
        storage_path: 'historical/plant/01.jpg',
        source: 'historical',
        planta_image_url: null,
        planta_last_updated: null,
        display_order: 1,
        taken_at: null,
        created_at: new Date().toISOString(),
      },
      {
        id: '2',
        plant_id: 'plant-1',
        photo_url: 'https://example.com/planta.webp',
        storage_path: 'planta/plant-1-2024-11-26.webp',
        source: 'planta',
        planta_image_url: 'https://planta.com/photo.webp',
        planta_last_updated: new Date('2024-11-26').toISOString(),
        display_order: null,
        taken_at: null,
        created_at: new Date().toISOString(),
      },
    ]

    const sorted = sortPhotos(photos)
    expect(sorted[0].source).toBe('planta')
    expect(sorted[1].source).toBe('historical')
  })
})

describe('getPhotoLabel', () => {
  it('returns formatted date for Planta photos', () => {
    const photo: Photo = {
      id: '1',
      plant_id: 'plant-1',
      photo_url: 'https://example.com/planta.webp',
      storage_path: 'planta/plant-1-2024-11-26.webp',
      source: 'planta',
      planta_image_url: 'https://planta.com/photo.webp',
      planta_last_updated: new Date('2024-11-26').toISOString(),
      display_order: null,
      taken_at: null,
      created_at: new Date().toISOString(),
    }

    const label = getPhotoLabel(photo)
    expect(label).toMatch(/Nov/)
  })

  it('returns "Photo X" for historical photos', () => {
    const photo: Photo = {
      id: '1',
      plant_id: 'plant-1',
      photo_url: 'https://example.com/historical.jpg',
      storage_path: 'historical/plant/01.jpg',
      source: 'historical',
      planta_image_url: null,
      planta_last_updated: null,
      display_order: 5,
      taken_at: null,
      created_at: new Date().toISOString(),
    }

    expect(getPhotoLabel(photo)).toBe('Photo 5')
  })
})
