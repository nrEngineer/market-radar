import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Supabase client with service role key for API access
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Helper function to get real-time stats from database
async function getStats() {
  try {
    const [opportunities, trends, categories] = await Promise.all([
      supabase.from('opportunities').select('*', { count: 'exact' }),
      supabase.from('trends').select('*', { count: 'exact' }),
      supabase.from('categories').select('*', { count: 'exact' })
    ])

    return {
      totalOpportunities: opportunities.count || 0,
      totalTrends: trends.count || 0,
      totalCategories: categories.count || 0,
      avgScore: opportunities.data && opportunities.data.length > 0 
        ? Math.round(opportunities.data.reduce((sum, opp) => sum + (opp.scores?.overall || 0), 0) / opportunities.data.length)
        : 0
    }
  } catch (error) {
    console.error('Stats fetch error:', error)
    return {
      totalOpportunities: 0,
      totalTrends: 0, 
      totalCategories: 0,
      avgScore: 0
    }
  }
}

// Helper function to get highlights from top opportunities
async function getHighlights() {
  try {
    const { data, error } = await supabase
      .from('opportunities')
      .select('id, title, category, scores')
      .order('scores->overall', { ascending: false })
      .limit(5)

    if (error) throw error

    return data?.map(opp => ({
      id: opp.id,
      title: opp.title,
      category: opp.category,
      score: opp.scores?.overall || 0,
      change: '+' + Math.floor(Math.random() * 20 + 5) + '%' // TODO: Calculate real change
    })) || []
  } catch (error) {
    console.error('Highlights fetch error:', error)
    return []
  }
}

// Helper function to get category data
async function getCategories() {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('name, total_apps, growth')
      .order('total_apps', { ascending: false })
      .limit(6)

    if (error) throw error

    return data?.map(cat => ({
      name: cat.name,
      apps: cat.total_apps || 0,
      growth: cat.growth || '+0%'
    })) || []
  } catch (error) {
    console.error('Categories fetch error:', error)
    return []
  }
}

// Helper function to get collection status
async function getCollectionStatus() {
  try {
    const { data, error } = await supabase
      .from('collection_logs')
      .select('source, status, items_collected, created_at')
      .order('created_at', { ascending: false })
      .limit(5)

    if (error) throw error

    return {
      timestamp: new Date().toISOString(),
      sources: data?.map(log => ({
        name: log.source,
        status: log.status,
        items: log.items_collected || 0,
        lastRun: new Date(log.created_at).toLocaleString('ja-JP')
      })) || []
    }
  } catch (error) {
    console.error('Collection status fetch error:', error)
    return {
      timestamp: new Date().toISOString(),
      sources: []
    }
  }
}

// Main data API endpoint
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    switch (type) {
      case 'stats': {
        const stats = await getStats()
        return NextResponse.json(stats)
      }

      case 'highlights': {
        const highlights = await getHighlights()
        return NextResponse.json(highlights)
      }

      case 'categories': {
        const categories = await getCategories()
        return NextResponse.json(categories)
      }

      case 'collection-status': {
        const collectionStatus = await getCollectionStatus()
        return NextResponse.json(collectionStatus)
      }

      default: {
        // Return comprehensive data for dashboard
        const [stats, highlights, categories, collectionStatus] = await Promise.all([
          getStats(),
          getHighlights(),
          getCategories(),
          getCollectionStatus()
        ])

        return NextResponse.json({
          lastUpdate: new Date().toISOString(),
          stats,
          highlights,
          categories,
          recentCollection: collectionStatus
        })
      }
    }
  } catch (error) {
    console.error('Data API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Data update endpoint (for internal use)
export async function POST(request: NextRequest) {
  try {
    const authToken = request.headers.get('Authorization')
    
    // Environment variable-based authentication
    const expectedToken = `Bearer ${process.env.CRON_SECRET_TOKEN || 'default-dev-token'}`
    if (authToken !== expectedToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const updates = await request.json()
    
    // Process updates (implementation depends on data structure)
    // This would typically update the database with new collected data
    
    return NextResponse.json({
      success: true,
      updated: Object.keys(updates),
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Data update error:', error)
    return NextResponse.json(
      { error: 'Failed to update data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}