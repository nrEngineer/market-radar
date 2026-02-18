import { NextRequest, NextResponse } from 'next/server'
import { realDataSeeder } from '@/lib/db/seed-real-data'

// Real Data Seeding API - Convert free data sources into structured database
export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const authToken = request.headers.get('Authorization')
    const expectedToken = `Bearer ${process.env.CRON_SECRET_TOKEN || 'default-dev-token'}`
    
    if (authToken !== expectedToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    console.log('🌱 Starting real data seeding process...')
    
    const results = await realDataSeeder.seedAllData()
    
    return NextResponse.json({
      success: true,
      message: 'Real data seeded successfully',
      results,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Real data seeding error:', error)
    return NextResponse.json({
      success: false,
      error: 'Data seeding failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

// Quick data refresh endpoint (GET)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const preview = searchParams.get('preview') === 'true'
    
    if (preview) {
      // Return a preview of what would be seeded without actually seeding
      const { freeDataCollector } = await import('@/lib/integrations/free-data-sources')
      const rawData = await freeDataCollector.collectAllMarketData()
      
      return NextResponse.json({
        preview: true,
        dataPoints: rawData.summary.totalDataPoints,
        sources: rawData.summary.sources,
        sampleData: {
          github: rawData.github.slice(0, 3).map((r: any) => ({
            name: r.name,
            description: r.description,
            stars: r.stargazers_count,
            language: r.language
          })),
          reddit: rawData.reddit.slice(0, 3).map((p: any) => ({
            title: p.title,
            subreddit: p.subreddit,
            score: p.score,
            comments: p.num_comments
          }))
        },
        timestamp: new Date().toISOString()
      })
    }
    
    return NextResponse.json({
      message: 'Use POST to seed data, or GET with ?preview=true to preview',
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    return NextResponse.json({
      error: 'Preview failed', 
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}