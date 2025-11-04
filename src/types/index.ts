/**
 * Database Types
 * These interfaces match the Supabase database schema
 */

export interface Plant {
  id: string
  planta_id: string
  localized_name: string
  variety: string | null
  custom_name: string | null
  scientific_name: string | null
  location: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Photo {
  id: string
  plant_id: string
  storage_path: string
  photo_url: string
  source: 'planta' | 'historical'
  planta_image_url: string | null
  planta_last_updated: string | null
  display_order: number | null
  taken_at: string | null
  created_at: string
}

export interface SyncToken {
  id: number
  access_token: string
  refresh_token: string
  expires_at: string
  updated_at: string
}

/**
 * API Response Types
 */

export interface SyncResponse {
  success: boolean
  plants_synced: number
  photos_added: number
  errors: Array<{ plant_id: string; message: string }>
}

/**
 * Planta API Types
 * These match the structure from the Planta API response
 */

export interface PlantaPlant {
  id: string
  names: {
    localizedName: string
    variety: string | null
    custom: string | null
    scientific: string
  }
  site: {
    name: string
  }
  image: {
    url: string
    lastUpdated: string
  } | null
}
