/**
 * Insert all plants from Planta API responses into Supabase
 * Run this ONCE before running the historical photo backfill
 */

import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import * as path from 'path'

// Load environment variables from .env.local
config({ path: path.join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function main() {
  console.log('🌿 Inserting plants from Planta API into Supabase...\n')

  try {
    // Load both API response pages
    const page1 = require('../../response_1762303835488.json')
    const page2 = require('../../response_1762303871695.json')
    const allPlants = [...page1.data, ...page2.data]

    console.log(`📥 Found ${allPlants.length} plants from Planta API\n`)

    let inserted = 0
    let skipped = 0
    const errors: Array<{ plant: string; error: string }> = []

    for (const plantaPlant of allPlants) {
      try {
        const displayName = plantaPlant.names.custom || plantaPlant.names.localizedName

        // Check if plant already exists
        const { data: existing } = await supabase
          .from('plants')
          .select('id')
          .eq('planta_id', plantaPlant.id)
          .maybeSingle()

        if (existing) {
          console.log(`  ⏭️  Skipping: ${displayName} (already exists)`)
          skipped++
          continue
        }

        // Insert new plant
        const { error: insertError } = await supabase
          .from('plants')
          .insert({
            planta_id: plantaPlant.id,
            localized_name: plantaPlant.names.localizedName,
            variety: plantaPlant.names.variety || null,
            custom_name: plantaPlant.names.custom || null,
            scientific_name: plantaPlant.names.scientific || null,
            location: plantaPlant.site.name || null,
            is_active: true
          })

        if (insertError) {
          throw insertError
        }

        console.log(`  ✅ Inserted: ${displayName}`)
        inserted++

      } catch (err: any) {
        const displayName = plantaPlant.names.custom || plantaPlant.names.localizedName
        console.error(`  ❌ Error inserting ${displayName}:`, err.message)
        errors.push({
          plant: displayName,
          error: err.message
        })
      }
    }

    // Print summary
    console.log('\n' + '='.repeat(60))
    console.log('✅ Plant insertion complete!')
    console.log('='.repeat(60))
    console.log(`📊 Total plants processed: ${allPlants.length}`)
    console.log(`✨ Plants inserted: ${inserted}`)
    console.log(`⏭️  Plants skipped (already exist): ${skipped}`)
    console.log(`❌ Errors: ${errors.length}`)

    if (errors.length > 0) {
      console.log('\n⚠️  Errors:')
      errors.forEach(e => {
        console.log(`   - ${e.plant}: ${e.error}`)
      })
    }

    console.log('\n🎉 Ready for historical photo backfill!\n')

  } catch (err: any) {
    console.error('❌ Fatal error:', err.message)
    process.exit(1)
  }
}

main()
