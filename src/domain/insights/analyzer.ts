/* ═══════════════════════════════════════════════════════════════
   Market Radar — Insight Generation Engine
   Derives actionable insights from collected data
   ═══════════════════════════════════════════════════════════════ */

export interface MarketInsight {
  id: string
  insight: string
  impact: 'positive' | 'negative' | 'neutral'
  confidence: number
  source: string
  methodology: string
  dataPoints: number
  generatedAt: string
  category: string
  actionability: 'immediate' | 'short-term' | 'long-term' | 'monitor'
  evidence: string[]
}

export interface TrendSignal {
  source: string
  signal: string
  date: string
  strength: number
  rawData?: string
  methodology: string
}

/**
 * Generate insights from Hacker News data
 */
export function analyzeHackerNewsData(stories: Array<{
  title: string
  score: number
  url: string
  commentCount: number
  timestamp: string
}>, analysisTimestamp: string): MarketInsight[] {
  const insights: MarketInsight[] = []
  const now = analysisTimestamp

  // Categorize stories by topic
  const aiStories = stories.filter(s => 
    /\b(ai|gpt|llm|claude|openai|anthropic|machine learning|neural|transformer|agent)\b/i.test(s.title)
  )
  const saasStories = stories.filter(s =>
    /\b(saas|startup|launch|product|app|platform|tool)\b/i.test(s.title)
  )
  // AI trend insight
  if (aiStories.length > 0) {
    const avgScore = aiStories.reduce((s, st) => s + st.score, 0) / aiStories.length
    const percentOfTotal = ((aiStories.length / stories.length) * 100).toFixed(1)
    
    insights.push({
      id: `hn-ai-${now}`,
      insight: `Hacker News Top Stories中、AI関連が${aiStories.length}件（${percentOfTotal}%）を占有。平均スコア${Math.round(avgScore)}pt。AI関連プロダクトへの開発者関心度は依然として非常に高い水準`,
      impact: aiStories.length > 5 ? 'positive' : 'neutral',
      confidence: Math.min(60 + aiStories.length * 3, 90),
      source: 'Hacker News Firebase API',
      methodology: `HN Top Storiesから上位${stories.length}件を取得し、AI関連キーワード（ai, gpt, llm, claude, openai等）でフィルタ。スコアと件数から関心度を定量化`,
      dataPoints: stories.length,
      generatedAt: now,
      category: 'AI / Machine Learning',
      actionability: 'monitor',
      evidence: aiStories.slice(0, 3).map(s => `"${s.title}" (${s.score}pt, ${s.commentCount}コメント)`),
    })
  }

  // SaaS/Startup insight
  if (saasStories.length > 0) {
    const avgComments = saasStories.reduce((s, st) => s + st.commentCount, 0) / saasStories.length
    
    insights.push({
      id: `hn-saas-${now}`,
      insight: `SaaS/スタートアップ関連記事${saasStories.length}件。平均コメント数${Math.round(avgComments)}件。コメント数が多い（>50）記事は深い議論を示し、市場の成熟度を反映`,
      impact: 'neutral',
      confidence: Math.min(55 + saasStories.length * 2, 85),
      source: 'Hacker News Firebase API',
      methodology: `SaaS/プロダクト関連キーワードでフィルタし、コメント数を議論の深さの指標として分析`,
      dataPoints: saasStories.length,
      generatedAt: now,
      category: 'SaaS / Enterprise',
      actionability: 'monitor',
      evidence: saasStories.slice(0, 3).map(s => `"${s.title}" (${s.commentCount}コメント)`),
    })
  }

  return insights
}

/**
 * Generate insights from App Store data
 */
export function analyzeAppStoreData(apps: Array<{
  name: string
  category: string
  price: number
  rating: number
  ratingCount: number
  releaseDate: string
}>, analysisTimestamp: string): MarketInsight[] {
  const insights: MarketInsight[] = []
  const now = analysisTimestamp

  // Categorize by type
  const categories: Record<string, typeof apps> = {}
  apps.forEach(app => {
    if (!categories[app.category]) categories[app.category] = []
    categories[app.category].push(app)
  })

  // Average rating analysis
  const avgRating = apps.length > 0
    ? apps.reduce((s, a) => s + (a.rating || 0), 0) / apps.filter(a => a.rating > 0).length
    : 0

  if (avgRating > 0) {
    insights.push({
      id: `as-rating-${now}`,
      insight: `日本App Storeの主要カテゴリ平均レビュースコア: ${avgRating.toFixed(1)}/5.0。生産性カテゴリは${(categories['Productivity']?.reduce((s, a) => s + (a.rating || 0), 0) / (categories['Productivity']?.filter(a => a.rating > 0).length || 1) || 0).toFixed(1)}で、ユーザーの期待値が高い市場`,
      impact: avgRating >= 4.0 ? 'positive' : 'neutral',
      confidence: 75,
      source: 'iTunes Search API (Japan)',
      methodology: `iTunes Search APIで主要4カテゴリ（productivity, business, health-fitness, finance）を検索。各カテゴリ上位10件の平均レビュースコアを算出`,
      dataPoints: apps.length,
      generatedAt: now,
      category: 'Mobile App',
      actionability: 'short-term',
      evidence: [`分析対象: ${apps.length}アプリ`, `カテゴリ数: ${Object.keys(categories).length}`, `評価あり: ${apps.filter(a => a.rating > 0).length}件`],
    })
  }

  // Free vs Paid analysis
  const freeApps = apps.filter(a => a.price === 0)
  const paidApps = apps.filter(a => a.price > 0)
  const freePercent = ((freeApps.length / apps.length) * 100).toFixed(0)

  insights.push({
    id: `as-pricing-${now}`,
    insight: `無料アプリが${freePercent}%を占有。フリーミアムモデルが支配的な市場環境。有料アプリ平均価格: ¥${Math.round(paidApps.reduce((s, a) => s + a.price, 0) / (paidApps.length || 1))}`,
    impact: 'neutral',
    confidence: 80,
    source: 'iTunes Search API (Japan)',
    methodology: `収集アプリの価格帯分布を分析。price=0を無料、>0を有料として分類`,
    dataPoints: apps.length,
    generatedAt: now,
    category: 'Mobile App',
    actionability: 'immediate',
    evidence: [`無料: ${freeApps.length}件 (${freePercent}%)`, `有料: ${paidApps.length}件`, `有料平均価格: ¥${Math.round(paidApps.reduce((s, a) => s + a.price, 0) / (paidApps.length || 1))}`],
  })

  // High-rated new apps (potential competitors)
  const recentHighRated = apps
    .filter(a => a.rating >= 4.5 && a.ratingCount > 100)
    .sort((a, b) => b.ratingCount - a.ratingCount)

  if (recentHighRated.length > 0) {
    insights.push({
      id: `as-quality-${now}`,
      insight: `高評価アプリ（★4.5以上、100+レビュー）が${recentHighRated.length}件存在。品質基準が高い市場であり、参入には★4.3以上を最低ラインとすべき`,
      impact: 'neutral',
      confidence: 82,
      source: 'iTunes Search API (Japan)',
      methodology: `rating >= 4.5 かつ ratingCount > 100 のアプリを抽出し、品質ベンチマークを設定`,
      dataPoints: recentHighRated.length,
      generatedAt: now,
      category: 'Mobile App',
      actionability: 'immediate',
      evidence: recentHighRated.slice(0, 3).map(a => `${a.name}: ★${a.rating} (${a.ratingCount.toLocaleString()}件)`),
    })
  }

  return insights
}

/**
 * Generate aggregate summary insights
 */
export function generateSummaryInsights(
  hnInsights: MarketInsight[],
  asInsights: MarketInsight[],
  collectionTimestamp: string
): MarketInsight[] {
  const allInsights = [...hnInsights, ...asInsights]
  const positiveCount = allInsights.filter(i => i.impact === 'positive').length
  const negativeCount = allInsights.filter(i => i.impact === 'negative').length
  const totalDataPoints = allInsights.reduce((s, i) => s + i.dataPoints, 0)

  return [
    {
      id: `summary-${collectionTimestamp}`,
      insight: `本日の分析: ${allInsights.length}件のインサイトを${totalDataPoints}データポイントから生成。ポジティブシグナル${positiveCount}件、ネガティブ${negativeCount}件。AI関連市場は引き続き強い成長シグナルを示す`,
      impact: positiveCount > negativeCount ? 'positive' : 'neutral',
      confidence: 70,
      source: '複合分析（HN + App Store）',
      methodology: '各データソースからの個別インサイトを統合し、全体的な市場センチメントを算出',
      dataPoints: totalDataPoints,
      generatedAt: collectionTimestamp,
      category: 'Summary',
      actionability: 'monitor',
      evidence: [`HNインサイト: ${hnInsights.length}件`, `App Storeインサイト: ${asInsights.length}件`],
    },
  ]
}
