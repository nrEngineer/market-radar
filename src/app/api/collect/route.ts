import { NextRequest, NextResponse } from 'next/server'

// データ収集ソースの設定
export const COLLECTION_SOURCES = {
  productHunt: {
    enabled: true,
    url: 'https://api.producthunt.com/v2/api/graphql',
    description: 'Product Hunt新着・話題の製品'
  },
  appStore: {
    enabled: true, 
    url: 'https://itunes.apple.com/search',
    description: 'App Store検索・ランキング'
  },
  playStore: {
    enabled: true,
    url: 'https://serpapi.com/search',
    description: 'Google Play Store検索'
  },
  hackernews: {
    enabled: true,
    url: 'https://hacker-news.firebaseio.com/v0',
    description: 'Hacker News話題'
  }
} as const

interface CollectionResult {
  source: string
  status: 'success' | 'error'
  dataCount: number
  timestamp: string
  data?: Record<string, unknown>[]
  error?: string
}

// Product Hunt データ収集
async function collectProductHunt(): Promise<CollectionResult> {
  try {
    // まずは模擬データで構造を作る
    const mockData = [
      {
        id: 'ph_001',
        name: 'AI Photo Editor Pro',
        tagline: 'Transform photos with AI in seconds',
        votes: 156,
        category: 'Productivity',
        launchDate: new Date().toISOString(),
        url: 'https://example.com/ai-photo-editor',
        description: 'Professional photo editing powered by AI'
      },
      {
        id: 'ph_002', 
        name: 'NoCode CRM Builder',
        tagline: 'Build custom CRM without coding',
        votes: 124,
        category: 'Business',
        launchDate: new Date().toISOString(),
        url: 'https://example.com/nocode-crm',
        description: 'Drag-and-drop CRM builder for small businesses'
      }
    ]

    return {
      source: 'producthunt',
      status: 'success',
      dataCount: mockData.length,
      timestamp: new Date().toISOString(),
      data: mockData
    }
  } catch (error) {
    return {
      source: 'producthunt',
      status: 'error',
      dataCount: 0,
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// App Store データ収集
async function collectAppStore(): Promise<CollectionResult> {
  try {
    // iTunes Search API を使った実際のデータ取得
    const categories = ['productivity', 'business', 'health-fitness', 'finance']
    const allApps = []

    for (const category of categories) {
      const response = await fetch(
        `https://itunes.apple.com/search?term=${category}&country=JP&media=software&limit=10`,
        { 
          method: 'GET',
          headers: {
            'User-Agent': 'MarketRadar/1.0'
          }
        }
      )
      
      if (response.ok) {
        const data = await response.json()
        const apps = data.results.map((app: Record<string, unknown>) => ({
          id: `app_${app.trackId}`,
          name: app.trackName,
          developer: app.artistName,
          category: app.primaryGenreName,
          price: app.price || 0,
          rating: app.averageUserRating || 0,
          ratingCount: app.userRatingCount || 0,
          description: app.description,
          releaseDate: app.releaseDate,
          url: app.trackViewUrl,
          iconUrl: app.artworkUrl100
        }))
        allApps.push(...apps)
      }
    }

    return {
      source: 'appstore',
      status: 'success', 
      dataCount: allApps.length,
      timestamp: new Date().toISOString(),
      data: allApps
    }
  } catch (error) {
    return {
      source: 'appstore',
      status: 'error',
      dataCount: 0,
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Hacker News データ収集
async function collectHackerNews(): Promise<CollectionResult> {
  try {
    // Top stories APIから上位ストーリーを取得
    const topStoriesResponse = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
    const topStoryIds = await topStoriesResponse.json()
    
    // 上位20件の詳細を取得
    const stories = await Promise.all(
      topStoryIds.slice(0, 20).map(async (id: number) => {
        const storyResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
        return storyResponse.json()
      })
    )

    const filteredStories = stories
      .filter(story => story && story.title && story.url)
      .map(story => ({
        id: `hn_${story.id}`,
        title: story.title,
        url: story.url,
        score: story.score || 0,
        author: story.by,
        timestamp: story.time ? new Date(story.time * 1000).toISOString() : new Date().toISOString(),
        commentCount: story.descendants || 0,
        text: story.text || ''
      }))

    return {
      source: 'hackernews',
      status: 'success',
      dataCount: filteredStories.length,
      timestamp: new Date().toISOString(),
      data: filteredStories
    }
  } catch (error) {
    return {
      source: 'hackernews',
      status: 'error',
      dataCount: 0,
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// メイン収集関数
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const source = searchParams.get('source')
  const authToken = request.headers.get('Authorization')

  // 環境変数ベース認証 (ハードコード禁止)
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret || authToken !== `Bearer ${cronSecret}`) {
    console.error('[Security] Unauthorized collect API access attempt')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    let results: CollectionResult[] = []

    if (source) {
      // 特定のソースのみ収集
      switch (source) {
        case 'producthunt':
          results.push(await collectProductHunt())
          break
        case 'appstore':
          results.push(await collectAppStore())
          break
        case 'hackernews':
          results.push(await collectHackerNews())
          break
        default:
          return NextResponse.json({ error: 'Invalid source' }, { status: 400 })
      }
    } else {
      // 全ソース収集
      results = await Promise.all([
        collectProductHunt(),
        collectAppStore(), 
        collectHackerNews()
      ])
    }

    // 結果をログ出力（開発用）
    console.log('Collection Results:', JSON.stringify(results, null, 2))

    // 後でデータベースに保存する処理をここに追加
    // await saveToDatabase(results)

    const summary = {
      timestamp: new Date().toISOString(),
      totalSources: results.length,
      totalItems: results.reduce((sum, result) => sum + result.dataCount, 0),
      successCount: results.filter(r => r.status === 'success').length,
      errorCount: results.filter(r => r.status === 'error').length,
      results: results
    }

    return NextResponse.json(summary)

  } catch (error) {
    console.error('Collection error:', error)
    return NextResponse.json(
      { 
        error: 'Collection failed', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 500 }
    )
  }
}

export async function POST() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}