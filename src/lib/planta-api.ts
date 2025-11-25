/**
 * Planta API Client
 * Handles authentication, token refresh, and API calls to Planta
 *
 * IMPORTANT: This is server-side only! Never import in client components.
 * Uses service role key for elevated Supabase permissions.
 */

import { createClient } from '@supabase/supabase-js'
import type { PlantaPlant, PlantaPlantsResponse, PlantaAuthResponse } from '@/types'

// Create server-side Supabase client with service role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

const PLANTA_API_BASE_URL = process.env.PLANTA_API_BASE_URL || 'https://public.planta-api.com'

/**
 * Get a valid access token, automatically refreshing if needed
 * Checks if token expires in less than 1 hour and refreshes if so
 */
export async function getAccessToken(): Promise<string> {
  // Fetch current tokens from database
  const { data: tokenData, error } = await supabase
    .from('sync_tokens')
    .select('*')
    .eq('id', 1)
    .single()

  if (error || !tokenData) {
    throw new Error('Failed to fetch sync tokens from database. Please ensure tokens are inserted.')
  }

  // Check if token expires in less than 1 hour
  const expiresAt = new Date(tokenData.expires_at)
  const oneHourFromNow = new Date(Date.now() + 3600000) // 1 hour in ms

  if (expiresAt < oneHourFromNow) {
    console.log('🔄 Access token expires soon, refreshing...')
    return await refreshAccessToken(tokenData.refresh_token)
  }

  return tokenData.access_token
}

/**
 * Refresh the access token using the refresh token
 * Updates database with new tokens (both access_token and refresh_token rotate)
 */
async function refreshAccessToken(currentRefreshToken: string): Promise<string> {
  try {
    // Call Planta API to refresh token (no Authorization header needed)
    const response = await fetch(`${PLANTA_API_BASE_URL}/v1/auth/refreshToken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refreshToken: currentRefreshToken
      })
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error(
          'Refresh token is invalid or expired. Please manually update tokens in Supabase dashboard.'
        )
      }
      throw new Error(`Token refresh failed: ${response.status} ${response.statusText}`)
    }

    const data: PlantaAuthResponse = await response.json()

    // Update database with new tokens (both rotate!)
    const { error: updateError } = await supabase
      .from('sync_tokens')
      .update({
        access_token: data.data.accessToken,
        refresh_token: data.data.refreshToken,
        expires_at: data.data.expiresAt,
        updated_at: new Date().toISOString()
      })
      .eq('id', 1)

    if (updateError) {
      console.error('⚠️  Warning: Failed to update tokens in database:', updateError.message)
      // Don't throw - sync can still work with the new token
    }

    console.log('✅ Token refreshed successfully')
    return data.data.accessToken

  } catch (error: any) {
    throw new Error(`Failed to refresh token: ${error.message}`)
  }
}

/**
 * Fetch all plants from Planta API with cursor-based pagination
 * Handles rate limiting (429) with exponential backoff
 */
export async function fetchAllPlants(): Promise<PlantaPlant[]> {
  const accessToken = await getAccessToken()
  const plants: PlantaPlant[] = []
  let cursor: string | null = null

  while (true) {
    const url = cursor
      ? `${PLANTA_API_BASE_URL}/v1/addedPlants?cursor=${cursor}`
      : `${PLANTA_API_BASE_URL}/v1/addedPlants`

    // Fetch with retry logic for rate limiting
    const response = await fetchWithRetry(url, accessToken)
    const data: PlantaPlantsResponse = await response.json()

    plants.push(...data.data)
    console.log(`📥 Fetched ${data.data.length} plants (total: ${plants.length})`)

    // Check if there are more pages
    if (!data.pagination.nextPage) {
      break // Done!
    }

    cursor = data.pagination.nextPage
  }

  return plants
}

/**
 * Fetch with retry logic for rate limiting (429 errors)
 * Retries up to 3 times with exponential backoff: 1s, 2s, 4s
 */
async function fetchWithRetry(
  url: string,
  accessToken: string,
  maxRetries: number = 3
): Promise<Response> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        }
      })

      // Handle rate limiting
      if (response.status === 429) {
        const delay = Math.pow(2, attempt) * 1000 // 1s, 2s, 4s
        console.warn(`⚠️  Rate limited (429), waiting ${delay}ms before retry...`)
        await new Promise(resolve => setTimeout(resolve, delay))
        continue
      }

      // Other errors - throw immediately
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`)
      }

      return response

    } catch (error: any) {
      lastError = error
      if (attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 1000
        console.warn(`⚠️  Request failed, retrying in ${delay}ms...`)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  throw new Error(`Request failed after ${maxRetries} attempts: ${lastError?.message}`)
}

/**
 * Download a photo from URL and return as buffer
 * Retries up to 3 times on failure
 */
export async function downloadPhoto(url: string): Promise<Buffer> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Failed to download photo: ${response.status} ${response.statusText}`)
      }

      const arrayBuffer = await response.arrayBuffer()
      return Buffer.from(arrayBuffer)

    } catch (error: any) {
      lastError = error
      if (attempt < 2) {
        const delay = Math.pow(2, attempt) * 1000 // 1s, 2s
        console.warn(`⚠️  Photo download failed, retrying in ${delay}ms...`)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  throw new Error(`Photo download failed after 3 attempts: ${lastError?.message}`)
}
