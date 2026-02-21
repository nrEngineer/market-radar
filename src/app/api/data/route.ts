import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, isSupabaseConfigured } from '@/server/db/client'
import { validateCronToken } from '@/server/auth-utils'
import { notifyError } from '@/server/discord-notify'
import { opportunities } from '@/data/opportunities'
import { trends } from '@/data/trends'

// ── Supabase-backed queries (used when DB is configured) ────

async function getStatsFromDB() {
  const [opps, trds, cats] = await Promise.all([
    supabaseAdmin.from('opportunities').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('trends').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('categories').select('*', { count: 'exact', head: true })
  ])
  return {
    totalOpportunities: opps.count || 0,
    totalTrends: trds.count || 0,
    totalCategories: cats.count || 0,
    avgScore: 0
  }
}

async function getHighlightsFromDB() {
  const { data, error } = await supabaseAdmin
    .from('opportunities')
    .select('id, title, category, scores')
    .order('scores->overall', { ascending: false })
    .limit(5)
  if (error) throw error
  return data?.map(opp => ({
    id: opp.id, title: opp.title, category: opp.category,
    score: opp.scores?.overall || 0, change: null
  })) || []
}

async function getCategoriesFromDB() {
  const { data, error } = await supabaseAdmin
    .from('categories')
    .select('name, total_apps, growth')
    .order('total_apps', { ascending: false })
    .limit(6)
  if (error) throw error
  return data?.map(cat => ({
    name: cat.name, apps: cat.total_apps || 0, growth: cat.growth || '+0%'
  })) || []
}

// ── Static data fallback (used when Supabase is not configured) ──

function getStatsFromStatic() {
  const total = opportunities.length
  const avgScore = total > 0
    ? Math.round(opportunities.reduce((sum, o) => sum + o.scores.overall, 0) / total)
    : 0

  const categorySet = new Set(opportunities.map(o => o.category))

  return {
    totalOpportunities: total,
    totalTrends: trends.length,
    totalCategories: categorySet.size,
    avgScore
  }
}

function getHighlightsFromStatic() {
  return [...opportunities]
    .sort((a, b) => b.scores.overall - a.scores.overall)
    .slice(0, 5)
    .map(opp => ({
      id: opp.id,
      title: opp.title,
      category: opp.category,
      score: opp.scores.overall,
      change: null
    }))
}

function getCategoriesFromStatic() {
  const catMap = new Map<string, { count: number; growth: string }>()
  for (const opp of opportunities) {
    const prev = catMap.get(opp.category)
    if (!prev) {
      catMap.set(opp.category, { count: 1, growth: opp.market.growth })
    } else {
      catMap.set(opp.category, { count: prev.count + 1, growth: prev.growth })
    }
  }
  return [...catMap.entries()]
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, 6)
    .map(([name, { count, growth }]) => ({ name, apps: count, growth }))
}

// ── Main handler ────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const useDB = isSupabaseConfigured()

    const getStats = useDB ? getStatsFromDB : async () => getStatsFromStatic()
    const getHighlights = useDB ? getHighlightsFromDB : async () => getHighlightsFromStatic()
    const getCategories = useDB ? getCategoriesFromDB : async () => getCategoriesFromStatic()

    switch (type) {
      case 'stats':
        return NextResponse.json(await getStats(), {
          headers: { 'Cache-Control': 'public, max-age=300' }
        })
      case 'highlights':
        return NextResponse.json(await getHighlights(), {
          headers: { 'Cache-Control': 'public, max-age=300' }
        })
      case 'categories':
        return NextResponse.json(await getCategories(), {
          headers: { 'Cache-Control': 'public, max-age=300' }
        })
      case 'collection-status':
        return NextResponse.json({
          timestamp: new Date().toISOString(),
          sources: [
            { name: 'Product Hunt', status: 'ready', items: 0, lastRun: 'API接続待ち' },
            { name: 'App Store', status: 'ready', items: 0, lastRun: 'API接続待ち' },
            { name: 'Hacker News', status: 'ready', items: 0, lastRun: 'API接続待ち' },
          ]
        })
      default: {
        const [stats, highlights, categories] = await Promise.all([
          getStats(), getHighlights(), getCategories()
        ])
        return NextResponse.json({
          lastUpdate: new Date().toISOString(),
          stats, highlights, categories,
          dataSource: useDB ? 'supabase' : 'static'
        }, {
          headers: { 'Cache-Control': 'public, max-age=300' }
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
