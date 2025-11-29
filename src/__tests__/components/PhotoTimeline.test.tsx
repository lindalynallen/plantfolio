import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PhotoTimeline } from '@/components/PhotoTimeline'
import type { Photo } from '@/types'

describe('PhotoTimeline', () => {
  const mockPhotos: Photo[] = [
    {
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
    },
    {
      id: '2',
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
  ]

  it('renders photo grid when photos exist', () => {
    render(<PhotoTimeline photos={mockPhotos} plantName="Monstera" />)

    const images = screen.getAllByRole('img')
    expect(images).toHaveLength(2)
  })

  it('shows "No photos yet" when photos array is empty', () => {
    render(<PhotoTimeline photos={[]} plantName="Monstera" />)

    expect(screen.getByText('No photos yet')).toBeInTheDocument()
  })

  it('displays correct photo count in heading', () => {
    render(<PhotoTimeline photos={mockPhotos} plantName="Monstera" />)

    expect(screen.getByText('Timeline')).toBeInTheDocument()
    expect(screen.getByText('2 photos')).toBeInTheDocument()
  })

  it('shows singular "photo" when count is 1', () => {
    render(<PhotoTimeline photos={[mockPhotos[0]]} plantName="Monstera" />)

    expect(screen.getByText('Timeline')).toBeInTheDocument()
    expect(screen.getByText('1 photo')).toBeInTheDocument()
  })

  it('shows formatted date for Planta photos', () => {
    render(<PhotoTimeline photos={mockPhotos} plantName="Monstera" />)

    // Should show date label (Nov 26, 2024)
    expect(screen.getByText(/Nov/)).toBeInTheDocument()
  })

  it('shows "Photo X" label for historical photos', () => {
    render(<PhotoTimeline photos={mockPhotos} plantName="Monstera" />)

    expect(screen.getByText('Photo 1')).toBeInTheDocument()
  })

  it('renders images with correct alt text', () => {
    render(<PhotoTimeline photos={mockPhotos} plantName="Monstera" />)

    // Check that alt text includes plant name and label
    const plantaImage = screen.getByAltText(/Monstera - Nov/)
    expect(plantaImage).toBeInTheDocument()

    const historicalImage = screen.getByAltText('Monstera - Photo 1')
    expect(historicalImage).toBeInTheDocument()
  })
})
