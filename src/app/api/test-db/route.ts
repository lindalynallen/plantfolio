import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Try to query the plants table (should be empty but connection should work)
    const { data, error } = await supabase
      .from('plants')
      .select('count')
      .limit(1)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Database connection works! 🎉',
      data
    })
  } catch (err: any) {
    console.error('Unexpected error:', err)
    return NextResponse.json({
      success: false,
      error: err.message
    }, { status: 500 })
  }
}
