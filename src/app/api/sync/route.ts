/**
 * Planta API Sync Endpoint
 * Manually sync new photos from Planta API
 *
 * Usage: POST http://localhost:3000/api/sync
 *
 * Returns:
 * {
 *   success: true,
 *   plants_synced: 54,
 *   photos_added: 3,
 *   errors: []
 * }
 */

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { fetchAllPlants, downloadPhoto } from '@/lib/planta-api'
import type { PlantaPlant, SyncResponse } from '@/types'

// Create server-side Supabase client with service role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

/**
 * POST /api/sync
 * Sync new photos from Planta API
 */
export async function POST() {
  console.log('🔄 Starting Planta API sync...\n')

  let plantsSynced = 0
  let photosAdded = 0
  const errors: Array<{ plant_id: string; message: string }> = []

  try {
    // 1. Fetch all plants from Planta API (token refresh happens automatically)
    const plantaPlants = await fetchAllPlants()
    console.log(`\n📊 Fetched ${plantaPlants.length} plants from Planta API\n`)

    // 2. Process each plant
    for (const plantaPlant of plantaPlants) {
      try {
        const photoWasAdded = await syncPlant(plantaPlant)
        if (photoWasAdded) {
          photosAdded++
        }
        plantsSynced++
      } catch (err: any) {
        const displayName = plantaPlant.names.custom || plantaPlant.names.localizedName
        console.error(`❌ Error syncing plant ${displayName}:`, err.message)
        errors.push({
          plant_id: plantaPlant.id,
          message: err.message
        })
      }
    }

    // 3. Print summary
    console.log('\n' + '='.repeat(60))
    console.log('✅ Sync complete!')
    console.log('='.repeat(60))
    console.log(`📊 Plants synced: ${plantsSynced}`)
    console.log(`📸 Photos added: ${photosAdded}`)
    console.log(`❌ Errors: ${errors.length}`)

    if (errors.length > 0) {
      console.log('\n⚠️  Errors:')
      errors.forEach(e => {
        console.log(`   - Plant ${e.plant_id}: ${e.message}`)
      })
    }

    // 4. Return response
    const response: SyncResponse = {
      success: true,
      plants_synced: plantsSynced,
      photos_added: photosAdded,
      errors
    }

    return NextResponse.json(response)

  } catch (error: any) {
    console.error('\n💥 Sync failed with fatal error:', error.message)
    return NextResponse.json(
      {
        success: false,
        error: error.message
      },
      { status: 500 }
    )
  }
}

/**
 * Sync a single plant
 * - Inserts plant if it doesn't exist (unlikely - we already have all 54)
 * - Checks if photo already exists (by planta_image_url)
 * - Downloads and uploads new photo if needed
 *
 * Returns true if a photo was added, false otherwise
 */
async function syncPlant(plantaPlant: PlantaPlant): Promise<boolean> {
  const displayName = plantaPlant.names.custom || plantaPlant.names.localizedName

  // 1. Check if plant exists in database
  const { data: existingPlant } = await supabase
    .from('plants')
    .select('id')
    .eq('planta_id', plantaPlant.id)
    .maybeSingle()

  let plantId: string

  if (!existingPlant) {
    // New plant - insert it
    const { data: newPlant, error: insertError } = await supabase
      .from('plants')
      .insert({
        planta_id: plantaPlant.id,
        localized_name: plantaPlant.names.localizedName,
        variety: plantaPlant.names.variety,
        custom_name: plantaPlant.names.custom,
        scientific_name: plantaPlant.names.scientific,
        location: plantaPlant.site.name,
        is_active: true
      })
      .select('id')
      .single()

    if (insertError || !newPlant) {
      throw new Error(`Failed to insert new plant: ${insertError?.message}`)
    }

    plantId = newPlant.id
    console.log(`  ✨ New plant: ${displayName}`)
  } else {
    // Plant exists - use existing ID (don't overwrite data)
    plantId = existingPlant.id
    console.log(`  ⏭️  Plant exists: ${displayName}`)
  }

  // 2. Check if plant has an image
  if (!plantaPlant.image?.url) {
    console.log(`  ⚠️  No image for plant`)
    return false
  }

  // 3. Check if we already have this photo (by URL)
  const { data: existingPhoto } = await supabase
    .from('photos')
    .select('id')
    .eq('planta_image_url', plantaPlant.image.url)
    .maybeSingle()

  if (existingPhoto) {
    console.log(`  ⏭️  Photo already exists`)
    return false
  }

  // 4. Download and upload new photo
  console.log(`  📸 Downloading new photo...`)
  const photoBuffer = await downloadPhoto(plantaPlant.image.url)

  // Sanitize timestamp for filename (replace colons with dashes)
  // Example: 2025-06-29T00:22:14.333Z → 2025-06-29T00-22-14-333Z
  const timestamp = plantaPlant.image.lastUpdated.replace(/:/g, '-')
  const filename = `${plantaPlant.id}-${timestamp}.webp`
  const storagePath = `planta/${filename}`

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase
    .storage
    .from('plant-photos')
    .upload(storagePath, photoBuffer, {
      contentType: 'image/webp',
      upsert: false  // Fail if file already exists (shouldn't happen)
    })

  if (uploadError) {
    throw new Error(`Failed to upload photo: ${uploadError.message}`)
  }

  // Get public URL
  const { data: urlData } = supabase
    .storage
    .from('plant-photos')
    .getPublicUrl(storagePath)

  // Insert photo record into database
  const { error: insertPhotoError } = await supabase
    .from('photos')
    .insert({
      plant_id: plantId,
      storage_path: storagePath,
      photo_url: urlData.publicUrl,
      source: 'planta',
      planta_image_url: plantaPlant.image.url,
      planta_last_updated: plantaPlant.image.lastUpdated,
      display_order: null,  // Only used for historical photos
      taken_at: null        // Could be populated later
    })

  if (insertPhotoError) {
    throw new Error(`Failed to insert photo record: ${insertPhotoError.message}`)
  }

  console.log(`  ✅ Photo added!`)
  return true
}
