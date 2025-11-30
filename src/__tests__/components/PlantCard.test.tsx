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

  const defaultProps = {
    plant: mockPlant,
    thumbnailUrl: 'https://example.com/photo.jpg',
    photoCount: 5,
    lastUpdated: '2024-11-26T12:00:00Z',
  }

  it('renders plant name correctly using custom_name', () => {
    render(<PlantCard {...defaultProps} />)

    expect(screen.getByText('My Beautiful Monstera')).toBeInTheDocument()
  })

  it('falls back to localized_name when custom_name is null', () => {
    const plantWithoutCustomName = { ...mockPlant, custom_name: null }

    render(<PlantCard {...defaultProps} plant={plantWithoutCustomName} />)

    expect(screen.getByText('Monstera')).toBeInTheDocument()
  })

  it('renders image when thumbnailUrl is provided', () => {
    render(<PlantCard {...defaultProps} />)

    const image = screen.getByAltText('My Beautiful Monstera')
    expect(image).toBeInTheDocument()
  })

  it('shows "No photo" fallback when thumbnailUrl is null', () => {
    render(<PlantCard {...defaultProps} thumbnailUrl={null} />)

    expect(screen.getByText('No photo')).toBeInTheDocument()
  })

  it('link points to correct plant detail page', () => {
    render(<PlantCard {...defaultProps} />)

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/plants/plant-123')
  })

  it('displays scientific name when present', () => {
    render(<PlantCard {...defaultProps} />)

    expect(screen.getByText('Monstera deliciosa')).toBeInTheDocument()
  })

  it('does not display scientific name when not present', () => {
    const plantWithoutScientific = { ...mockPlant, scientific_name: null }

    render(<PlantCard {...defaultProps} plant={plantWithoutScientific} />)

    expect(screen.queryByText('Monstera deliciosa')).not.toBeInTheDocument()
  })

  it('displays photo count badge', () => {
    render(<PlantCard {...defaultProps} photoCount={12} />)

    expect(screen.getByText('12')).toBeInTheDocument()
  })

  it('displays location when present', () => {
    render(<PlantCard {...defaultProps} />)

    expect(screen.getByText('Living Room')).toBeInTheDocument()
  })
})
