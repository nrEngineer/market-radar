import { NextResponse } from 'next/server'
import { fetchProductHuntData } from '@/usecases/fetch-product-hunt-data'
import { notifyError } from '@/server/discord-notify'

// Product Hunt Data Collection API
export async function GET() {
  try {
    const data = await fetchProductHuntData()

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, max-age=1800',
        'X-Data-Source': 'Product Hunt RSS + Public API'
      }
    })
  } catch (error) {
    console.error('Product Hunt API error:', error)
    notifyError('product-hunt-data', error instanceof Error ? error.message : 'Unknown error').catch(() => {})

    return NextResponse.json(
      { error: 'Product Hunt data collection failed', timestamp: new Date().toISOString() },
      { status: 500 }
    )
  }
}
