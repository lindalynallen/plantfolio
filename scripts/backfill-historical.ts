/**
 * Backfill historical plant photos to Supabase
 * Uploads photos from local folders and inserts records into database
 */

import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

// Load environment variables
config({ path: path.join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

const HISTORICAL_PHOTOS_DIR = path.join(__dirname, '..', '..', 'historical-plant-photos')

// Support test mode via command line argument
const isTestMode = process.argv.includes('--test')
const MAPPING_FILE = isTestMode
  ? path.join(__dirname, 'folder-to-plant-mapping.TEST.json')
  : path.join(__dirname, 'folder-to-plant-mapping.json')

interface FolderMapping {
  [folderName: string]: string // planta_id
}

interface Stats {
  foldersProcessed: number
  photosUploaded: number
  warnings: string[]
  errors: Array<{ folder: string; file: string; error: string }>
}

/**
 * Extract display order from filename
 * Examples: "01.jpeg" -> 1, "IMG_0042.jpg" -> 42, "photo-5.jpeg" -> 5
 */
function extractDisplayOrder(filename: string): number {
  // Remove extension
  const nameWithoutExt = filename.replace(/\.(jpe?g|png|webp)$/i, '')
  // Extract first number found
  const match = nameWithoutExt.match(/\d+/)
  return match ? parseInt(match[0], 10) : 999
}

/**
 * Check file size and return warning if too large
 */
function checkFileSize(filePath: string): string | null {
  const stats = fs.statSync(filePath)
  const sizeInMB = stats.size / (1024 * 1024)

  if (sizeInMB > 5) {
    return `File is ${sizeInMB.toFixed(2)}MB (exceeds 5MB)`
  }

  return null
}

/**
 * Process a single folder
 */
async function processFolder(
  folderName: string,
  plantaId: string,
  stats: Stats
): Promise<void> {
  const folderPath = path.join(HISTORICAL_PHOTOS_DIR, folderName)

  console.log(`\n📁 Processing folder: ${folderName}`)

  // Check if folder exists
  if (!fs.existsSync(folderPath)) {
    throw new Error(`Folder not found: ${folderPath}`)
  }

  // Get plant ID from database
  const { data: plant, error: plantError } = await supabase
    .from('plants')
    .select('id')
    .eq('planta_id', plantaId)
    .single()

  if (plantError || !plant) {
    throw new Error(`Plant not found in database for planta_id: ${plantaId}`)
  }

  const plantId = plant.id
  console.log(`   Plant ID: ${plantId}`)

  // List all image files
  const allFiles = fs.readdirSync(folderPath)
  const imageFiles = allFiles
    .filter(f => /\.(jpe?g|png|webp)$/i.test(f))
    .sort() // Sort alphabetically

  console.log(`   Found ${imageFiles.length} photos`)

  if (imageFiles.length === 0) {
    console.log(`   ⚠️  No photos found, skipping`)
    return
  }

  // Process each file
  for (const filename of imageFiles) {
    const filePath = path.join(folderPath, filename)
    const displayOrder = extractDisplayOrder(filename)

    try {
      // Check file size
      const sizeWarning = checkFileSize(filePath)
      if (sizeWarning) {
        console.log(`   ⚠️  ${filename}: ${sizeWarning}`)
        stats.warnings.push(`${folderName}/${filename}: ${sizeWarning}`)
      }

      // Read file
      const fileBuffer = fs.readFileSync(filePath)

      // Upload to Supabase Storage
      const storagePath = `historical/${folderName}/${filename}`
      const { error: uploadError } = await supabase
        .storage
        .from('plant-photos')
        .upload(storagePath, fileBuffer, {
          contentType: 'image/jpeg',
          upsert: false // Don't overwrite if exists
        })

      if (uploadError) {
        // If file already exists, skip silently (this allows re-running the script)
        if (uploadError.message.includes('already exists')) {
          console.log(`   ⏭️  ${filename} (already uploaded)`)
          continue
        }
        throw uploadError
      }

      // Get public URL
      const { data: urlData } = supabase
        .storage
        .from('plant-photos')
        .getPublicUrl(storagePath)

      // Insert photo record
      const { error: insertError } = await supabase
        .from('photos')
        .insert({
          plant_id: plantId,
          storage_path: storagePath,
          photo_url: urlData.publicUrl,
          source: 'historical',
          planta_image_url: null,
          planta_last_updated: null,
          display_order: displayOrder,
          taken_at: null
        })

      if (insertError) {
        throw insertError
      }

      console.log(`   ✅ ${filename} (order: ${displayOrder})`)
      stats.photosUploaded++

    } catch (err: any) {
      console.error(`   ❌ ${filename}: ${err.message}`)
      stats.errors.push({
        folder: folderName,
        file: filename,
        error: err.message
      })
    }
  }

  stats.foldersProcessed++
}

async function main() {
  console.log('🌿 Starting historical photo backfill...\n')
  if (isTestMode) {
    console.log('🧪 TEST MODE - Only processing folders in TEST mapping file')
  }
  console.log('='.repeat(60))

  const stats: Stats = {
    foldersProcessed: 0,
    photosUploaded: 0,
    warnings: [],
    errors: []
  }

  try {
    // Load mapping file
    if (!fs.existsSync(MAPPING_FILE)) {
      throw new Error(`Mapping file not found: ${MAPPING_FILE}`)
    }

    const mapping: FolderMapping = JSON.parse(
      fs.readFileSync(MAPPING_FILE, 'utf-8')
    )

    const folderCount = Object.keys(mapping).length
    console.log(`📋 Loaded mapping for ${folderCount} folders`)
    console.log(`📂 Photos directory: ${HISTORICAL_PHOTOS_DIR}`)
    console.log('='.repeat(60))

    // Process each folder
    for (const [folderName, plantaId] of Object.entries(mapping)) {
      try {
        await processFolder(folderName, plantaId, stats)
      } catch (err: any) {
        console.error(`\n❌ Error processing folder ${folderName}:`, err.message)
        stats.errors.push({
          folder: folderName,
          file: '(folder)',
          error: err.message
        })
      }
    }

    // Print summary
    console.log('\n' + '='.repeat(60))
    console.log('✅ BACKFILL COMPLETE!')
    console.log('='.repeat(60))
    console.log(`📁 Folders processed: ${stats.foldersProcessed}/${folderCount}`)
    console.log(`📸 Photos uploaded: ${stats.photosUploaded}`)
    console.log(`⚠️  Warnings: ${stats.warnings.length}`)
    console.log(`❌ Errors: ${stats.errors.length}`)

    if (stats.warnings.length > 0) {
      console.log('\n⚠️  WARNINGS:')
      stats.warnings.forEach(w => console.log(`   - ${w}`))
    }

    if (stats.errors.length > 0) {
      console.log('\n❌ ERRORS:')
      stats.errors.forEach(e => {
        const location = e.file === '(folder)' ? e.folder : `${e.folder}/${e.file}`
        console.log(`   - ${location}: ${e.error}`)
      })
    }

    console.log('\n🎉 Done! Check your Supabase dashboard to verify.\n')

  } catch (err: any) {
    console.error('\n❌ Fatal error:', err.message)
    process.exit(1)
  }
}

main()
