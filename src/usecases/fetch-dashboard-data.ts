import { isSupabaseConfigured } from '@/server/db/client'
import * as dashboardService from '@/server/services/dashboard-service'
import { opportunities } from '@/data/opportunities'
import { trends } from '@/data/trends'

// ── Static data helpers (when Supabase is not configured) ──

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
    avgScore,
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
      change: null,
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

function getCollectionStatusStatic() {
  return {
    timestamp: new Date().toISOString(),
    sources: [
      { name: 'Product Hunt', status: 'ready', items: 0, lastRun: 'API接続待ち' },
      { name: 'App Store', status: 'ready', items: 0, lastRun: 'API接続待ち' },
      { name: 'Hacker News', status: 'ready', items: 0, lastRun: 'API接続待ち' },
    ],
  }
}

// ── Main usecase ───────────────────────────────────────────

type DashboardType = 'stats' | 'highlights' | 'categories' | 'collection-status' | null

export async function fetchDashboardData(type: DashboardType) {
  const useDB = isSupabaseConfigured()

  const getStats = useDB ? dashboardService.getStats : async () => getStatsFromStatic()
  const getHighlights = useDB ? dashboardService.getHighlights : async () => getHighlightsFromStatic()
  const getCategories = useDB ? dashboardService.getCategories : async () => getCategoriesFromStatic()
  const getCollectionStatus = useDB ? dashboardService.getCollectionStatus : async () => getCollectionStatusStatic()

  switch (type) {
    case 'stats':
      return getStats()
    case 'highlights':
      return getHighlights()
    case 'categories':
      return getCategories()
    case 'collection-status':
      return getCollectionStatus()
    default: {
      const [stats, highlights, categories] = await Promise.all([
        getStats(), getHighlights(), getCategories(),
      ])
      return {
        lastUpdate: new Date().toISOString(),
        stats,
        highlights,
        categories,
        dataSource: useDB ? 'supabase' : 'static',
      }
    }
  }
}
