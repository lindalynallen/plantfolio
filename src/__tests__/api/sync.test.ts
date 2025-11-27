import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '@/app/api/sync/route'

// Mock the Planta API functions
vi.mock('@/lib/planta-api', () => ({
  fetchAllPlants: vi.fn().mockResolvedValue([]),
  downloadPhoto: vi.fn().mockResolvedValue(Buffer.from('fake-image-data')),
}))

// Mock Supabase admin client
vi.mock('@/lib/supabase', () => ({
  supabaseAdmin: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: vi.fn(() => ({ data: null, error: null })),
          single: vi.fn(() => ({ data: { id: 'plant-123' }, error: null })),
        })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => ({ data: { id: 'plant-123' }, error: null })),
        })),
      })),
    })),
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn(() => ({ error: null })),
        getPublicUrl: vi.fn(() => ({ data: { publicUrl: 'https://example.com/photo.webp' } })),
      })),
    },
  },
}))

// Mock logger functions
vi.mock('@/lib/logger', () => ({
  logInfo: vi.fn(),
  logWarn: vi.fn(),
  logError: vi.fn(),
}))

describe('POST /api/sync', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks()
  })

  it('returns 401 without Authorization header', async () => {
    const request = new Request('http://localhost/api/sync', {
      method: 'POST',
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.success).toBe(false)
    expect(data.error).toMatch(/Unauthorized/)
  })

  it('returns 401 with incorrect API key', async () => {
    const request = new Request('http://localhost/api/sync', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer wrong-key-123',
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.success).toBe(false)
    expect(data.error).toMatch(/Unauthorized/)
  })

  it('returns 200 with correct API key', async () => {
    const request = new Request('http://localhost/api/sync', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SYNC_API_KEY}`,
      },
    })

    const response = await POST(request)

    expect(response.status).toBe(200)
  })

  it('returns proper response structure', async () => {
    const request = new Request('http://localhost/api/sync', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SYNC_API_KEY}`,
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(data).toMatchObject({
      success: expect.any(Boolean),
      plants_synced: expect.any(Number),
      photos_added: expect.any(Number),
      errors: expect.any(Array),
    })
  })

  it('handles empty plant list', async () => {
    const request = new Request('http://localhost/api/sync', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SYNC_API_KEY}`,
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.plants_synced).toBe(0)
    expect(data.photos_added).toBe(0)
  })
})
