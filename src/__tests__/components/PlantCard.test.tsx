import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PlantCard } from '@/components/PlantCard'
import type { Plant } from '@/types'

describe('PlantCard', () => {
  const mockPlant: Plant = {
    id: 'plant-123',
    planta_id: 'AGgNjeR6DBP',
    localized_name: 'Monstera',
    custom_name: 'My Beautiful Monstera',
    variety: 'Deliciosa',
    scientific_name: 'Monstera deliciosa',
    location: 'Living Room',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  it('renders plant name correctly using custom_name', () => {
    render(<PlantCard plant={mockPlant} thumbnailUrl="https://example.com/photo.jpg" />)

    expect(screen.getByText('My Beautiful Monstera')).toBeInTheDocument()
  })

  it('falls back to localized_name when custom_name is null', () => {
    const plantWithoutCustomName = { ...mockPlant, custom_name: null }

    render(<PlantCard plant={plantWithoutCustomName} thumbnailUrl="https://example.com/photo.jpg" />)

    expect(screen.getByText('Monstera')).toBeInTheDocument()
  })

  it('renders image when thumbnailUrl is provided', () => {
    render(<PlantCard plant={mockPlant} thumbnailUrl="https://example.com/photo.jpg" />)

    const image = screen.getByAltText('My Beautiful Monstera')
    expect(image).toBeInTheDocument()
  })

  it('shows "No photo" fallback when thumbnailUrl is null', () => {
    render(<PlantCard plant={mockPlant} thumbnailUrl={null} />)

    expect(screen.getByText('No photo')).toBeInTheDocument()
  })

  it('link points to correct plant detail page', () => {
    render(<PlantCard plant={mockPlant} thumbnailUrl="https://example.com/photo.jpg" />)

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/plants/plant-123')
  })

  it('displays scientific name when present', () => {
    render(<PlantCard plant={mockPlant} thumbnailUrl="https://example.com/photo.jpg" />)

    expect(screen.getByText('Monstera deliciosa')).toBeInTheDocument()
  })

  it('does not display scientific name when not present', () => {
    const plantWithoutScientific = { ...mockPlant, scientific_name: null }

    render(<PlantCard plant={plantWithoutScientific} thumbnailUrl="https://example.com/photo.jpg" />)

    expect(screen.queryByText('Monstera deliciosa')).not.toBeInTheDocument()
  })
})
