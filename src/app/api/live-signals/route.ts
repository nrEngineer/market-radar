import { NextResponse } from 'next/server'
import { collectAppStore } from '@/integrations/collectors/app-store'
import { collectHackerNews } from '@/integrations/collectors/hacker-news'
import type { CollectionResult } from '@/integrations/collectors/types'

// Public API: ライブ市場シグナルを無認証で取得
// HN, iTunes App Store から直接データ収集し、分析結果を返す
export async function GET() {
  try {
    const results = await Promise.allSettled([
      collectHackerNews(),
      collectAppStore(),
    ])

    const collected: CollectionResult[] = results.map((r, i) => {
      if (r.status === 'fulfilled') return r.value
      const sources = ['hackernews', 'appstore']
      return {
        source: sources[i],
        status: 'error' as const,
        dataCount: 0,
        timestamp: new Date().toISOString(),
        error: r.reason?.message || 'Collection failed',
      }
    })

    const hnData = collected.find(c => c.source === 'hackernews')
    const appData = collected.find(c => c.source === 'appstore')

    // HN からテック・SaaS トレンドを抽出
    const hnStories = (hnData?.data || []) as Array<Record<string, unknown>>
    const techSignals = hnStories
      .filter(s => {
        const title = String(s.title || '').toLowerCase()
        return /ai|saas|startup|launch|open.?source|developer|api|cloud/.test(title)
      })
      .slice(0, 10)
      .map(s => ({
        title: s.title,
        score: s.score,
        url: s.url,
        source: 'Hacker News',
        category: categorizeTechStory(String(s.title || '')),
      }))

    // App Store からカテゴリ別トレンド抽出
    const apps = (appData?.data || []) as Array<Record<string, unknown>>
    const appSignals = apps
      .filter(a => Number(a.rating || 0) >= 4.0)
      .slice(0, 10)
      .map(a => ({
        name: a.name,
        category: a.category,
        rating: a.rating,
        price: a.price === 0 ? 'Free' : `¥${a.price}`,
        source: 'App Store',
      }))

    // カテゴリ別集計
    const categoryCount: Record<string, number> = {}
    for (const signal of techSignals) {
      categoryCount[signal.category] = (categoryCount[signal.category] || 0) + 1
    }
    const hotCategories = Object.entries(categoryCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([category, count]) => ({ category, count }))

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      sources: {
        hackerNews: { status: hnData?.status || 'error', items: hnData?.dataCount || 0 },
        appStore: { status: appData?.status || 'error', items: appData?.dataCount || 0 },
      },
      techSignals,
      appSignals,
      hotCategories,
      totalDataPoints: collected.reduce((sum, c) => sum + c.dataCount, 0),
    }, {
      headers: { 'Cache-Control': 'public, max-age=300' }
    })
  } catch (error) {
    console.error('Live signals error:', error)
    return NextResponse.json(
      { error: 'Live signal collection failed', timestamp: new Date().toISOString() },
      { status: 500 }
    )
  }
}

function categorizeTechStory(title: string): string {
  const t = title.toLowerCase()
  if (/ai|gpt|llm|machine.?learn|neural|agent/.test(t)) return 'AI/ML'
  if (/saas|subscription|mrr|churn/.test(t)) return 'SaaS'
  if (/startup|launch|product.?hunt|ship/.test(t)) return 'Startups'
  if (/open.?source|github|oss/.test(t)) return 'Open Source'
  if (/api|developer|sdk|framework/.test(t)) return 'DevTools'
  if (/cloud|aws|infrastructure|deploy/.test(t)) return 'Infrastructure'
  return 'Tech General'
}
