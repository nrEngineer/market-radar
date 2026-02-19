import { collectAppStore } from '@/integrations/collectors/app-store'
import { collectHackerNews } from '@/integrations/collectors/hacker-news'
import { productHuntAPI } from '@/integrations/product-hunt/client'
import type { CollectionResult } from '@/integrations/collectors/types'

// Product Hunt データ収集（実API接続）
async function collectProductHunt(): Promise<CollectionResult> {
  try {
    const products = await productHuntAPI.getTodaysFeatured()

    const data = products.map(p => ({
      id: p.id,
      name: p.name,
      tagline: p.tagline,
      votes: p.votes_count,
      category: p.topics[0]?.name || 'General',
      launchDate: p.featured_at,
      url: p.website,
      description: p.description,
    }))

    return {
      source: 'producthunt',
      status: 'success',
      dataCount: data.length,
      timestamp: new Date().toISOString(),
      data: data as Record<string, unknown>[],
    }
  } catch (error) {
    return {
      source: 'producthunt',
      status: 'error',
      dataCount: 0,
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export interface CollectMarketDataSummary {
  timestamp: string
  totalSources: number
  totalItems: number
  successCount: number
  errorCount: number
  results: CollectionResult[]
}

// 市場データ収集のオーケストレーター
export async function collectMarketData(source?: string | null): Promise<CollectMarketDataSummary> {
  let results: CollectionResult[]

  if (source) {
    switch (source) {
      case 'producthunt':
        results = [await collectProductHunt()]
        break
      case 'appstore':
        results = [await collectAppStore()]
        break
      case 'hackernews':
        results = [await collectHackerNews()]
        break
      default:
        throw new Error(`Invalid source: ${source}`)
    }
  } else {
    // 全ソース並列収集
    results = await Promise.all([
      collectProductHunt(),
      collectAppStore(),
      collectHackerNews()
    ])
  }

  // 結果をログ出力（開発用）
  console.log('Collection Results:', JSON.stringify(results, null, 2))

  return {
    timestamp: new Date().toISOString(),
    totalSources: results.length,
    totalItems: results.reduce((sum, result) => sum + result.dataCount, 0),
    successCount: results.filter(r => r.status === 'success').length,
    errorCount: results.filter(r => r.status === 'error').length,
    results
  }
}
