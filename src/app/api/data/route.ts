import { NextRequest, NextResponse } from 'next/server'

// 模擬データストア（本番ではデータベースを使用）
const dataStore = {
  lastUpdate: new Date().toISOString(),
  stats: {
    totalApps: 1234,
    totalWebServices: 567, 
    opportunities: 89,
    avgRevenue: 45000
  },
  highlights: [
    { id: 1, title: "AI写真編集アプリが急上昇", category: "Mobile App", score: 92, change: "+15%" },
    { id: 2, title: "ノーコードCRM新規参入", category: "Web SaaS", score: 88, change: "+12%" },
    { id: 3, title: "フィットネストラッカー需要増", category: "Mobile App", score: 85, change: "+8%" }
  ],
  categories: [
    { name: "AI Tools", apps: 234, growth: "+23%" },
    { name: "Productivity", apps: 189, growth: "+18%" },
    { name: "Health & Fitness", apps: 156, growth: "+15%" },
    { name: "Finance", apps: 143, growth: "+12%" }
  ],
  recentCollection: {
    timestamp: new Date().toISOString(),
    sources: [
      { name: 'App Store', status: 'success', items: 45, lastRun: '2分前' },
      { name: 'Product Hunt', status: 'success', items: 12, lastRun: '5分前' },
      { name: 'Hacker News', status: 'success', items: 20, lastRun: '3分前' }
    ]
  }
}

export async function GET(request: NextRequest) {
  try {
    // クエリパラメータで特定のデータタイプを指定可能
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    switch (type) {
      case 'stats':
        return NextResponse.json(dataStore.stats)
      case 'highlights':
        return NextResponse.json(dataStore.highlights)
      case 'categories':
        return NextResponse.json(dataStore.categories)
      case 'collection-status':
        return NextResponse.json(dataStore.recentCollection)
      default:
        return NextResponse.json(dataStore)
    }
  } catch (error) {
    console.error('Data API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch data' }, 
      { status: 500 }
    )
  }
}

// データ更新用（内部API）
export async function POST(request: NextRequest) {
  try {
    const authToken = request.headers.get('Authorization')
    
    // 環境変数ベース認証 (ハードコード禁止)
    const cronSecret = process.env.CRON_SECRET
    if (!cronSecret || authToken !== `Bearer ${cronSecret}`) {
      console.error('[Security] Unauthorized data POST access attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const updates = await request.json()
    
    // データストアを更新
    if (updates.stats) dataStore.stats = { ...dataStore.stats, ...updates.stats }
    if (updates.highlights) dataStore.highlights = updates.highlights
    if (updates.categories) dataStore.categories = updates.categories
    if (updates.recentCollection) dataStore.recentCollection = updates.recentCollection
    
    dataStore.lastUpdate = new Date().toISOString()

    return NextResponse.json({ 
      success: true, 
      updated: Object.keys(updates),
      timestamp: dataStore.lastUpdate 
    })
  } catch (error) {
    console.error('Data update error:', error)
    return NextResponse.json(
      { error: 'Failed to update data' }, 
      { status: 500 }
    )
  }
}