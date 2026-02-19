import { supabaseAdmin, isSupabaseConfigured } from '@/server/db/client'

export function isDatabaseConfigured(): boolean {
  return isSupabaseConfigured()
}

export async function getStats() {
  try {
    const [opportunities, trends, categories] = await Promise.all([
      supabaseAdmin.from('opportunities').select('*', { count: 'exact' }).limit(200),
      supabaseAdmin.from('trends').select('*', { count: 'exact' }).limit(200),
      supabaseAdmin.from('categories').select('*', { count: 'exact' }).limit(200)
    ])

    return {
      totalOpportunities: opportunities.count || 0,
      totalTrends: trends.count || 0,
      totalCategories: categories.count || 0,
      avgScore: opportunities.data && opportunities.data.length > 0
        ? Math.round(opportunities.data.reduce((sum: number, opp: any) => sum + (opp.scores?.overall || 0), 0) / opportunities.data.length)
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

export async function getHighlights() {
  try {
    const { data, error } = await supabaseAdmin
      .from('opportunities')
      .select('id, title, category, scores')
      .order('scores->overall', { ascending: false })
      .limit(5)

    if (error) throw error

    return data?.map((opp: any) => ({
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

export async function getCategories() {
  try {
    const { data, error } = await supabaseAdmin
      .from('categories')
      .select('name, total_apps, growth')
      .order('total_apps', { ascending: false })
      .limit(6)

    if (error) throw error

    return data?.map((cat: any) => ({
      name: cat.name,
      apps: cat.total_apps || 0,
      growth: cat.growth || '+0%'
    })) || []
  } catch (error) {
    console.error('Categories fetch error:', error)
    return []
  }
}

export async function getCollectionStatus() {
  try {
    const { data, error } = await supabaseAdmin
      .from('collection_logs')
      .select('source, status, data_count, timestamp')
      .order('timestamp', { ascending: false })
      .limit(5)

    if (error) throw error

    return {
      timestamp: new Date().toISOString(),
      sources: data?.map((log: any) => ({
        name: log.source,
        status: log.status,
        items: log.data_count || 0,
        lastRun: new Date(log.timestamp).toLocaleString('ja-JP')
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

export async function getDashboardData() {
  const [stats, highlights, categories, collectionStatus] = await Promise.all([
    getStats(),
    getHighlights(),
    getCategories(),
    getCollectionStatus()
  ])

  return {
    lastUpdate: new Date().toISOString(),
    stats,
    highlights,
    categories,
    recentCollection: collectionStatus
  }
}
