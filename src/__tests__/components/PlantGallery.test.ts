import { describe, it, expect } from 'vitest'
import { sortPlants } from '@/components/PlantGallery'
import { PlantWithMeta } from '@/types'

/**
 * Factory to create test plant data
 */
function createPlant(overrides: Partial<PlantWithMeta> = {}): PlantWithMeta {
  return {
    id: 'test-id',
    planta_id: 'planta-123',
    localized_name: 'Test Plant',
    variety: null,
    custom_name: null,
    scientific_name: null,
    location: null,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    thumbnailUrl: null,
    photoCount: 0,
    lastUpdated: null,
    ...overrides,
  }
}

describe('sortPlants', () => {
  // ==========================================================================
  // Sort by Name
  // ==========================================================================
  describe('sort by name', () => {
    const plants = [
      createPlant({ id: '1', localized_name: 'Zebra Plant' }),
      createPlant({ id: '2', localized_name: 'Aloe Vera' }),
      createPlant({ id: '3', localized_name: 'Monstera' }),
    ]

    it('sorts alphabetically ascending (A→Z)', () => {
      const sorted = sortPlants(plants, 'name', 'asc')
      expect(sorted.map(p => p.localized_name)).toEqual([
        'Aloe Vera',
        'Monstera',
        'Zebra Plant',
      ])
    })

    it('sorts alphabetically descending (Z→A)', () => {
      const sorted = sortPlants(plants, 'name', 'desc')
      expect(sorted.map(p => p.localized_name)).toEqual([
        'Zebra Plant',
        'Monstera',
        'Aloe Vera',
      ])
    })

    it('uses custom_name over localized_name when present', () => {
      const plantsWithCustom = [
        createPlant({ id: '1', localized_name: 'Zebra Plant', custom_name: 'Andy' }),
        createPlant({ id: '2', localized_name: 'Aloe Vera' }),
        createPlant({ id: '3', localized_name: 'Monstera', custom_name: 'Big Leaf' }),
      ]
      const sorted = sortPlants(plantsWithCustom, 'name', 'asc')
      // Aloe Vera, Andy, Big Leaf (custom names used for sorting)
      expect(sorted.map(p => p.id)).toEqual(['2', '1', '3'])
    })
  })

  // ==========================================================================
  // Sort by Species (scientific_name)
  // ==========================================================================
  describe('sort by species', () => {
    const plants = [
      createPlant({ id: '1', scientific_name: 'Zamioculcas zamiifolia' }),
      createPlant({ id: '2', scientific_name: 'Aloe barbadensis' }),
      createPlant({ id: '3', scientific_name: 'Monstera deliciosa' }),
    ]

    it('sorts alphabetically ascending', () => {
      const sorted = sortPlants(plants, 'species', 'asc')
      expect(sorted.map(p => p.scientific_name)).toEqual([
        'Aloe barbadensis',
        'Monstera deliciosa',
        'Zamioculcas zamiifolia',
      ])
    })

    it('sorts alphabetically descending', () => {
      const sorted = sortPlants(plants, 'species', 'desc')
      expect(sorted.map(p => p.scientific_name)).toEqual([
        'Zamioculcas zamiifolia',
        'Monstera deliciosa',
        'Aloe barbadensis',
      ])
    })

    it('places nulls last regardless of direction (ascending)', () => {
      const plantsWithNull = [
        createPlant({ id: '1', scientific_name: 'Zamioculcas' }),
        createPlant({ id: '2', scientific_name: null }),
        createPlant({ id: '3', scientific_name: 'Aloe' }),
      ]
      const sorted = sortPlants(plantsWithNull, 'species', 'asc')
      expect(sorted.map(p => p.id)).toEqual(['3', '1', '2']) // Aloe, Zamioculcas, null
    })

    it('places nulls last regardless of direction (descending)', () => {
      const plantsWithNull = [
        createPlant({ id: '1', scientific_name: 'Zamioculcas' }),
        createPlant({ id: '2', scientific_name: null }),
        createPlant({ id: '3', scientific_name: 'Aloe' }),
      ]
      const sorted = sortPlants(plantsWithNull, 'species', 'desc')
      expect(sorted.map(p => p.id)).toEqual(['1', '3', '2']) // Zamioculcas, Aloe, null
    })
  })

  // ==========================================================================
  // Sort by Location
  // ==========================================================================
  describe('sort by location', () => {
    const plants = [
      createPlant({ id: '1', location: 'Living Room' }),
      createPlant({ id: '2', location: 'Bedroom' }),
      createPlant({ id: '3', location: 'Kitchen' }),
    ]

    it('sorts alphabetically ascending', () => {
      const sorted = sortPlants(plants, 'location', 'asc')
      expect(sorted.map(p => p.location)).toEqual([
        'Bedroom',
        'Kitchen',
        'Living Room',
      ])
    })

    it('sorts alphabetically descending', () => {
      const sorted = sortPlants(plants, 'location', 'desc')
      expect(sorted.map(p => p.location)).toEqual([
        'Living Room',
        'Kitchen',
        'Bedroom',
      ])
    })

    it('places nulls last regardless of direction (ascending)', () => {
      const plantsWithNull = [
        createPlant({ id: '1', location: 'Living Room' }),
        createPlant({ id: '2', location: null }),
        createPlant({ id: '3', location: 'Bedroom' }),
      ]
      const sorted = sortPlants(plantsWithNull, 'location', 'asc')
      expect(sorted.map(p => p.id)).toEqual(['3', '1', '2']) // Bedroom, Living Room, null
    })

    it('places nulls last regardless of direction (descending)', () => {
      const plantsWithNull = [
        createPlant({ id: '1', location: 'Living Room' }),
        createPlant({ id: '2', location: null }),
        createPlant({ id: '3', location: 'Bedroom' }),
      ]
      const sorted = sortPlants(plantsWithNull, 'location', 'desc')
      expect(sorted.map(p => p.id)).toEqual(['1', '3', '2']) // Living Room, Bedroom, null
    })
  })

  // ==========================================================================
  // Sort by Photo Count
  // ==========================================================================
  describe('sort by photos', () => {
    const plants = [
      createPlant({ id: '1', photoCount: 5 }),
      createPlant({ id: '2', photoCount: 15 }),
      createPlant({ id: '3', photoCount: 3 }),
    ]

    it('sorts by count ascending (least first)', () => {
      const sorted = sortPlants(plants, 'photos', 'asc')
      expect(sorted.map(p => p.photoCount)).toEqual([3, 5, 15])
    })

    it('sorts by count descending (most first)', () => {
      const sorted = sortPlants(plants, 'photos', 'desc')
      expect(sorted.map(p => p.photoCount)).toEqual([15, 5, 3])
    })

    it('handles zero photo counts', () => {
      const plantsWithZero = [
        createPlant({ id: '1', photoCount: 5 }),
        createPlant({ id: '2', photoCount: 0 }),
        createPlant({ id: '3', photoCount: 10 }),
      ]
      const sorted = sortPlants(plantsWithZero, 'photos', 'asc')
      expect(sorted.map(p => p.photoCount)).toEqual([0, 5, 10])
    })
  })

  // ==========================================================================
  // Sort by Last Updated
  // ==========================================================================
  describe('sort by updated', () => {
    const plants = [
      createPlant({ id: '1', lastUpdated: '2024-06-15T00:00:00Z' }),
      createPlant({ id: '2', lastUpdated: '2024-01-01T00:00:00Z' }),
      createPlant({ id: '3', lastUpdated: '2024-12-01T00:00:00Z' }),
    ]

    it('sorts by date ascending (oldest first)', () => {
      const sorted = sortPlants(plants, 'updated', 'asc')
      expect(sorted.map(p => p.id)).toEqual(['2', '1', '3']) // Jan, Jun, Dec
    })

    it('sorts by date descending (newest first)', () => {
      const sorted = sortPlants(plants, 'updated', 'desc')
      expect(sorted.map(p => p.id)).toEqual(['3', '1', '2']) // Dec, Jun, Jan
    })

    it('places nulls last regardless of direction (ascending)', () => {
      const plantsWithNull = [
        createPlant({ id: '1', lastUpdated: '2024-06-15T00:00:00Z' }),
        createPlant({ id: '2', lastUpdated: null }),
        createPlant({ id: '3', lastUpdated: '2024-01-01T00:00:00Z' }),
      ]
      const sorted = sortPlants(plantsWithNull, 'updated', 'asc')
      expect(sorted.map(p => p.id)).toEqual(['3', '1', '2']) // Jan, Jun, null
    })

    it('places nulls last regardless of direction (descending)', () => {
      const plantsWithNull = [
        createPlant({ id: '1', lastUpdated: '2024-06-15T00:00:00Z' }),
        createPlant({ id: '2', lastUpdated: null }),
        createPlant({ id: '3', lastUpdated: '2024-01-01T00:00:00Z' }),
      ]
      const sorted = sortPlants(plantsWithNull, 'updated', 'desc')
      expect(sorted.map(p => p.id)).toEqual(['1', '3', '2']) // Jun, Jan, null
    })
  })

  // ==========================================================================
  // Edge Cases
  // ==========================================================================
  describe('edge cases', () => {
    it('returns empty array for empty input', () => {
      const sorted = sortPlants([], 'name', 'asc')
      expect(sorted).toEqual([])
    })

    it('returns single item unchanged', () => {
      const single = [createPlant({ id: '1', localized_name: 'Solo Plant' })]
      const sorted = sortPlants(single, 'name', 'asc')
      expect(sorted).toHaveLength(1)
      expect(sorted[0].id).toBe('1')
    })

    it('does not mutate original array', () => {
      const original = [
        createPlant({ id: '1', localized_name: 'Zebra' }),
        createPlant({ id: '2', localized_name: 'Aloe' }),
      ]
      const originalOrder = original.map(p => p.id)
      sortPlants(original, 'name', 'asc')
      expect(original.map(p => p.id)).toEqual(originalOrder)
    })

    it('handles all nulls gracefully', () => {
      const allNulls = [
        createPlant({ id: '1', scientific_name: null }),
        createPlant({ id: '2', scientific_name: null }),
        createPlant({ id: '3', scientific_name: null }),
      ]
      // Should not throw, order is stable (original order preserved)
      const sorted = sortPlants(allNulls, 'species', 'asc')
      expect(sorted).toHaveLength(3)
    })
  })
})

