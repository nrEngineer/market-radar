import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, isSupabaseConfigured } from '@/server/db/client'
import { validateCronToken } from '@/server/auth-utils'
import { notifyError } from '@/server/discord-notify'

async function getStats() {
  try {
    const [opportunities, trends, categories] = await Promise.all([
      supabaseAdmin.from('opportunities').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('trends').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('categories').select('*', { count: 'exact', head: true })
    ])

    return {
      totalOpportunities: opportunities.count || 0,
      totalTrends: trends.count || 0,
      totalCategories: categories.count || 0,
      avgScore: 0
    }
  } catch (error) {
    console.error('Stats fetch error:', error)
    return { totalOpportunities: 0, totalTrends: 0, totalCategories: 0, avgScore: 0 }
  }
}

async function getHighlights() {
  try {
    const { data, error } = await supabaseAdmin
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
      change: null
    })) || []
  } catch (error) {
    console.error('Highlights fetch error:', error)
    return []
  }
}

async function getCategories() {
  try {
    const { data, error } = await supabaseAdmin
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

async function getCollectionStatus() {
  try {
    const { data, error } = await supabaseAdmin
      .from('collection_logs')
      .select('source, status, data_count, timestamp')
      .order('timestamp', { ascending: false })
      .limit(5)

    if (error) throw error

    return {
      timestamp: new Date().toISOString(),
      sources: data?.map(log => ({
        name: log.source,
        status: log.status,
        items: log.data_count || 0,
        lastRun: new Date(log.timestamp).toLocaleString('ja-JP')
      })) || []
    }
  } catch (error) {
    console.error('Collection status fetch error:', error)
    return { timestamp: new Date().toISOString(), sources: [] }
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        error: 'Service temporarily unavailable'
      }, { status: 503 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    switch (type) {
      case 'stats':
        return NextResponse.json(await getStats())
      case 'highlights':
        return NextResponse.json(await getHighlights())
      case 'categories':
        return NextResponse.json(await getCategories())
      case 'collection-status':
        return NextResponse.json(await getCollectionStatus())
      default: {
        const [stats, highlights, categories, collectionStatus] = await Promise.all([
          getStats(), getHighlights(), getCategories(), getCollectionStatus()
        ])
        return NextResponse.json({
          lastUpdate: new Date().toISOString(),
          stats, highlights, categories, recentCollection: collectionStatus
        })
      }
    }
  } catch (error) {
    console.error('Data API error:', error)
    notifyError('data', error instanceof Error ? error.message : 'Unknown error').catch(() => {})
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authToken = request.headers.get('Authorization')
    if (!validateCronToken(authToken)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const updates = await request.json()

    return NextResponse.json({
      success: true,
      updated: Object.keys(updates),
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Data update error:', error)
    notifyError('data-update', error instanceof Error ? error.message : 'Unknown error').catch(() => {})
    return NextResponse.json({ error: 'Failed to update data' }, { status: 500 })
  }
}
