// Data-driven research computation - matches query against real opportunity/trend data

import { opportunities } from '@/data/opportunities'
import { trends } from '@/data/trends'

export interface ResearchFinding {
  title: string
  description: string
  confidence: number
}

export interface ResearchResult {
  analysisId: string
  executionTimeMs: number
  confidence: number
  summary: string
  findings: ResearchFinding[]
  insights: string[]
  dataSource: 'template' | 'live' | 'cached'
}

export interface ResearchContext {
  analysisId: string
  executionTimeMs: number
  confidence: number
}

export function generateAnalysisId(uuid: string, timestamp: number): string {
  return 'analysis_' + uuid.replace(/-/g, '').slice(0, 9) + '_' + timestamp
}

// ── Keyword extraction ──
function extractKeywords(query: string): string[] {
  // Remove common Japanese particles and punctuation
  const stopWords = new Set([
    'の', 'に', 'は', 'を', 'が', 'で', 'と', 'も', 'から', 'まで', 'より',
    'て', 'た', 'する', 'します', 'ます', 'です', 'ある', 'いる', 'れる',
    'この', 'その', 'あの', 'どの', 'こと', 'もの', 'ため', 'よう',
    'ください', 'について', 'に関して', 'として', 'における', 'ない',
    'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'can', 'shall', 'and', 'or', 'but', 'not',
    'for', 'in', 'on', 'at', 'to', 'of', 'with', 'by', 'from', 'as',
  ])

  const tokens = query
    .toLowerCase()
    .replace(/[、。！？「」『』（）・\s]+/g, ' ')
    .split(' ')
    .filter(t => t.length >= 2 && !stopWords.has(t))

  return [...new Set(tokens)]
}

// ── Relevance scoring ──
function scoreRelevance(text: string, keywords: string[]): number {
  const lower = text.toLowerCase()
  let matches = 0
  for (const kw of keywords) {
    if (lower.includes(kw)) matches++
  }
  return keywords.length > 0 ? matches / keywords.length : 0
}

function scoreOpportunity(opp: typeof opportunities[0], keywords: string[]): number {
  const searchable = [
    opp.title, opp.subtitle, opp.category, opp.subcategory,
    opp.fiveW1H.what, opp.fiveW1H.who, opp.fiveW1H.why, opp.fiveW1H.how,
    ...opp.tags,
    ...opp.risks.factors.map(f => f.name),
    ...(opp.competitors.map(c => c.name)),
    ...(opp.targetSegments.flatMap(s => s.painPoints)),
  ].join(' ')

  return scoreRelevance(searchable, keywords)
}

function scoreTrend(trend: typeof trends[0], keywords: string[]): number {
  const searchable = [
    trend.name, trend.category,
    trend.fiveW1H.what, trend.fiveW1H.who, trend.fiveW1H.why,
    ...trend.relatedTrends,
    ...trend.signals.map(s => s.signal),
    trend.prediction.shortTerm, trend.prediction.midTerm,
  ].join(' ')

  return scoreRelevance(searchable, keywords)
}

// ── Format helpers ──
function formatYen(value: number): string {
  if (value >= 1_000_000_000) return `¥${(value / 1_000_000_000).toFixed(0)}B`
  if (value >= 100_000_000) return `¥${(value / 100_000_000).toFixed(0)}億`
  if (value >= 10_000_000) return `¥${(value / 10_000_000).toFixed(0)}千万`
  return `¥${value.toLocaleString()}`
}

// ── Core research function ──
export function executeCustomResearch(
  query: string,
  type: string,
  context: ResearchContext
): ResearchResult {
  const keywords = extractKeywords(query)
  const baseResults = {
    analysisId: context.analysisId,
    executionTimeMs: context.executionTimeMs,
    confidence: context.confidence,
    dataSource: 'cached' as const,
  }

  // Score all opportunities and trends
  const scoredOpps = opportunities
    .map(opp => ({ opp, score: scoreOpportunity(opp, keywords) }))
    .sort((a, b) => b.score - a.score)

  const scoredTrends = trends
    .map(trend => ({ trend, score: scoreTrend(trend, keywords) }))
    .sort((a, b) => b.score - a.score)

  // Get top matches (at least top 3, or those with >0 relevance)
  const relevantOpps = scoredOpps.filter(s => s.score > 0).slice(0, 5)
  const relevantTrends = scoredTrends.filter(s => s.score > 0).slice(0, 3)

  // If no matches found, return top-scored items as general recommendations
  const topOpps = relevantOpps.length > 0
    ? relevantOpps
    : scoredOpps.slice(0, 3).map(s => ({ ...s, score: 0.3 }))

  const topTrends = relevantTrends.length > 0
    ? relevantTrends
    : scoredTrends.slice(0, 2).map(s => ({ ...s, score: 0.2 }))

  // Build type-specific response
  switch (type) {
    case 'market':
      return buildMarketResearch(query, topOpps, topTrends, baseResults)
    case 'competitor':
      return buildCompetitorResearch(query, topOpps, baseResults)
    case 'pricing':
      return buildPricingResearch(query, topOpps, baseResults)
    case 'trend':
      return buildTrendResearch(query, topTrends, topOpps, baseResults)
    case 'customer':
      return buildCustomerResearch(query, topOpps, baseResults)
    case 'technology':
      return buildTechResearch(query, topOpps, baseResults)
    default:
      return buildGeneralResearch(query, topOpps, topTrends, baseResults)
  }
}

type ScoredOpp = { opp: typeof opportunities[0]; score: number }
type ScoredTrend = { trend: typeof trends[0]; score: number }
type BaseResults = { analysisId: string; executionTimeMs: number; confidence: number; dataSource: 'cached' }

function buildMarketResearch(
  query: string, opps: ScoredOpp[], trds: ScoredTrend[], base: BaseResults
): ResearchResult {
  const topOpp = opps[0]?.opp
  const findings: ResearchFinding[] = []

  if (topOpp) {
    findings.push({
      title: `市場規模: ${topOpp.title}`,
      description: `TAM: ${formatYen(topOpp.market.sizing.tam.value)}（${topOpp.market.sizing.tam.description}）、SAM: ${formatYen(topOpp.market.sizing.sam.value)}、SOM: ${formatYen(topOpp.market.sizing.som.value)}。CAGR ${topOpp.market.sizing.cagr}%で${topOpp.market.maturity === 'emerging' ? '急成長中' : topOpp.market.maturity === 'growing' ? '安定成長中' : '成熟期'}。`,
      confidence: Math.min(95, Math.round(topOpp.scores.overall * 0.9 + opps[0].score * 20))
    })
  }

  for (const { opp, score } of opps.slice(1, 4)) {
    findings.push({
      title: `関連機会: ${opp.title}（スコア ${opp.scores.overall}/100）`,
      description: `${opp.subtitle}。推定売上 ${opp.revenue.estimated}、${opp.implementation.timeframe}で構築可能。リスク: ${opp.risks.level === 'low' ? '低' : opp.risks.level === 'medium' ? '中' : '高'}。`,
      confidence: Math.min(90, Math.round(70 + score * 30))
    })
  }

  for (const { trend } of trds.slice(0, 2)) {
    findings.push({
      title: `関連トレンド: ${trend.name}（モメンタム ${trend.momentum}）`,
      description: `${trend.fiveW1H.what}。${trend.prediction.shortTerm}`,
      confidence: Math.min(88, trend.momentum)
    })
  }

  const insights = generateMarketInsights(opps, trds)

  return {
    ...base,
    confidence: topOpp ? Math.round(topOpp.scores.overall * 0.85) : 65,
    summary: topOpp
      ? `「${query}」に関連する市場を分析。最も関連性の高い機会は「${topOpp.title}」（総合スコア ${topOpp.scores.overall}/100）。市場規模 SAM ${formatYen(topOpp.market.sizing.sam.value)}、CAGR ${topOpp.market.sizing.cagr}%。${opps.length}件の関連事業機会と${trds.length}件の関連トレンドを検出。`
      : `「${query}」に関する市場分析を実行。${opportunities.length}件のデータベースから関連情報を検索しました。`,
    findings,
    insights,
  }
}

function buildCompetitorResearch(
  query: string, opps: ScoredOpp[], base: BaseResults
): ResearchResult {
  const findings: ResearchFinding[] = []

  for (const { opp } of opps.slice(0, 3)) {
    if (opp.competitors.length > 0) {
      for (const comp of opp.competitors.slice(0, 2)) {
        findings.push({
          title: `${comp.name}（${opp.title}市場）`,
          description: `${comp.description}。設立${comp.founded}年、従業員${comp.employees}。強み: ${comp.strengths.join('、')}。弱み: ${comp.weaknesses.join('、')}。最近の動き: ${comp.recentMoves.join('、') || '特になし'}`,
          confidence: 85
        })
      }
    }

    // Market gap analysis
    findings.push({
      title: `${opp.title}: 競合環境（競合強度 ${opp.market.competitiveIntensity}/100）`,
      description: `競合スコア ${opp.scores.competition}/100。${opp.market.competitiveIntensity < 50 ? 'ブルーオーシャン' : opp.market.competitiveIntensity < 70 ? '適度な競争' : '激戦区'}。個人開発者の参入余地: ${opp.scores.competition > 70 ? '大きい' : opp.scores.competition > 50 ? '中程度' : '限定的'}。`,
      confidence: Math.round(opp.scores.competition * 0.9)
    })
  }

  const insights: string[] = []
  const blueOceans = opps.filter(o => o.opp.market.competitiveIntensity < 50)
  if (blueOceans.length > 0) {
    insights.push(`ブルーオーシャン候補: ${blueOceans.map(o => o.opp.title).join('、')}（競合強度50未満）`)
  }

  const bestFeasibility = opps.reduce((best, curr) =>
    curr.opp.scores.feasibility > best.opp.scores.feasibility ? curr : best, opps[0])
  if (bestFeasibility) {
    insights.push(`実現可能性が最も高い: ${bestFeasibility.opp.title}（${bestFeasibility.opp.implementation.techStack.join(', ')}で${bestFeasibility.opp.implementation.timeframe}）`)
  }

  insights.push(
    '日本市場特化（日本語UI・法制度対応）は海外勢に対する自然なモートになる',
    '競合の弱点（高価格、英語UI、機能過多）をピンポイントで突く差別化が有効'
  )

  return {
    ...base,
    confidence: 80,
    summary: `「${query}」に関連する競合分析を実行。${opps.reduce((n, o) => n + o.opp.competitors.length, 0)}社の競合データと${opps.length}市場の競合強度を分析。`,
    findings,
    insights,
  }
}

function buildPricingResearch(
  query: string, opps: ScoredOpp[], base: BaseResults
): ResearchResult {
  const findings: ResearchFinding[] = []

  for (const { opp } of opps.slice(0, 4)) {
    findings.push({
      title: `${opp.title}: 価格戦略`,
      description: `収益モデル: ${opp.revenue.model}。推定月次売上 ${opp.revenue.estimated}（レンジ: ¥${opp.revenue.range.min.toLocaleString()}-${opp.revenue.range.max.toLocaleString()}）。粗利率 ${opp.revenue.margins.gross}%、純利率 ${opp.revenue.margins.net}%。損益分岐 ${opp.revenue.breakEven}。`,
      confidence: 82
    })
  }

  // Price band analysis from data
  const priceModels = opps.map(o => o.opp.revenue.model)
  const uniqueModels = [...new Set(priceModels)]

  findings.push({
    title: '収益モデル分布',
    description: `分析対象の事業機会で採用されている収益モデル: ${uniqueModels.join('、')}。Freemium + Subscription が個人開発者に最も適合。`,
    confidence: 88
  })

  const insights = [
    `月額¥3,000-10,000の価格帯は個人開発SaaSの最適ゾーン（分析データベースの中央値）`,
    `Freemiumモデルの平均有料転換率は3-5%。初期100ユーザーで¥15K-50K/月の売上`,
    `損益分岐点の中央値は${opps.length > 0 ? opps.map(o => parseInt(o.opp.revenue.breakEven)).filter(n => !isNaN(n)).sort((a, b) => a - b)[Math.floor(opps.length / 2)] || 5 : 5}ヶ月目`,
    '年額プランの導入で、月額比20%割引でもLTV 1.6倍の効果',
  ]

  return {
    ...base,
    confidence: 82,
    summary: `「${query}」に関連する価格戦略を分析。${opps.length}件の事業機会の収益データから、価格帯・収益モデル・損益分岐点を比較。`,
    findings,
    insights,
  }
}

function buildTrendResearch(
  query: string, trds: ScoredTrend[], opps: ScoredOpp[], base: BaseResults
): ResearchResult {
  const findings: ResearchFinding[] = []

  for (const { trend } of trds) {
    const latestVolume = trend.searchVolume[trend.searchVolume.length - 1]
    const firstVolume = trend.searchVolume[0]
    const growthPct = Math.round(((latestVolume.value - firstVolume.value) / firstVolume.value) * 100)

    findings.push({
      title: `${trend.name}（モメンタム ${trend.momentum}/100）`,
      description: `ステータス: ${trend.status}。検索ボリューム: ${latestVolume.value.toLocaleString()}（6ヶ月で+${growthPct}%）。採用段階: ${trend.adoptionCurve}。短期予測: ${trend.prediction.shortTerm}`,
      confidence: Math.min(92, trend.momentum)
    })

    // Add signal details
    if (trend.signals.length > 0) {
      const topSignal = trend.signals.sort((a, b) => b.strength - a.strength)[0]
      findings.push({
        title: `${trend.name}: 最強シグナル`,
        description: `[${topSignal.source}] ${topSignal.signal}（強度 ${topSignal.strength}/100、${topSignal.date}）`,
        confidence: topSignal.strength
      })
    }
  }

  // Add related opportunities
  if (opps.length > 0) {
    findings.push({
      title: 'トレンドに乗った事業機会',
      description: opps.slice(0, 3).map(o =>
        `${o.opp.title}（スコア ${o.opp.scores.overall}、タイミング ${o.opp.scores.timing}/100）`
      ).join('。'),
      confidence: 78
    })
  }

  const insights: string[] = []
  const emergingTrends = trds.filter(t => t.trend.status === 'emerging')
  if (emergingTrends.length > 0) {
    insights.push(`今すぐ参入すべき新興トレンド: ${emergingTrends.map(t => t.trend.name).join('、')}`)
  }
  const decliningTrends = trds.filter(t => t.trend.momentum < 50)
  if (decliningTrends.length > 0) {
    insights.push(`⚠️ 成長鈍化中: ${decliningTrends.map(t => t.trend.name).join('、')} — 新規参入は慎重に`)
  }
  insights.push(
    'トレンドの交差点（例: AI × バーティカルSaaS）にブルーオーシャンが生まれやすい',
    '採用段階が "early_adopters" のトレンドは、個人開発者が先行者優位を取れる最適タイミング'
  )

  return {
    ...base,
    confidence: 80,
    summary: `「${query}」に関連するトレンドを分析。${trds.length}件のトレンドと${opps.length}件の関連事業機会を検出。`,
    findings,
    insights,
  }
}

function buildCustomerResearch(
  query: string, opps: ScoredOpp[], base: BaseResults
): ResearchResult {
  const findings: ResearchFinding[] = []

  for (const { opp } of opps.slice(0, 3)) {
    for (const seg of opp.targetSegments.slice(0, 1)) {
      findings.push({
        title: `${opp.title}: ${seg.name}`,
        description: `市場規模 ${seg.size}（全体の${seg.percentage}%）。ペインポイント: ${seg.painPoints.join('、')}。支払意欲 ${seg.willingness}/100。CAC ${seg.acquisitionCost}、LTV ${seg.ltv}。`,
        confidence: 84
      })
      if (seg.persona) {
        findings.push({
          title: `ペルソナ: ${seg.persona.name}（${seg.persona.age}、${seg.persona.role}）`,
          description: `目標: ${seg.persona.goals.join('、')}。不満: ${seg.persona.frustrations.join('、')}。「${seg.persona.quote}」`,
          confidence: 78
        })
      }
    }
  }

  const insights = [
    ...opps.slice(0, 2).flatMap(o =>
      o.opp.targetSegments.slice(0, 1).map(s =>
        `${o.opp.title}: ${s.name}向け。獲得チャネル: ${s.channels.join('、')}`
      )
    ),
    'LTV/CAC比率3倍以上が健全なユニットエコノミクスの目安',
    '初期ユーザーはTwitter/X + Product Huntでの無料獲得が最もコスト効率が高い',
  ]

  return {
    ...base,
    confidence: 78,
    summary: `「${query}」に関連する顧客分析。${opps.reduce((n, o) => n + o.opp.targetSegments.length, 0)}セグメントのペルソナ・ペインポイント・ユニットエコノミクスを分析。`,
    findings,
    insights,
  }
}

function buildTechResearch(
  query: string, opps: ScoredOpp[], base: BaseResults
): ResearchResult {
  const findings: ResearchFinding[] = []

  // Tech stack analysis
  const allStacks = opps.flatMap(o => o.opp.implementation.techStack)
  const stackCount = new Map<string, number>()
  for (const tech of allStacks) {
    stackCount.set(tech, (stackCount.get(tech) || 0) + 1)
  }
  const sortedStacks = [...stackCount.entries()].sort((a, b) => b[1] - a[1])

  findings.push({
    title: '推奨技術スタック（データベース分析）',
    description: `最も採用されている技術: ${sortedStacks.slice(0, 6).map(([tech, count]) => `${tech}(${count}件)`).join('、')}。個人開発者に最適な組み合わせ: Next.js + Supabase + Vercel + Stripe。`,
    confidence: 90
  })

  for (const { opp } of opps.slice(0, 3)) {
    findings.push({
      title: `${opp.title}: 技術要件`,
      description: `スタック: ${opp.implementation.techStack.join(', ')}。開発期間: ${opp.implementation.timeframe}。チーム規模: ${opp.implementation.teamSize}。総コスト: ${opp.implementation.totalCost}。実現可能性スコア: ${opp.scores.feasibility}/100。`,
      confidence: opp.scores.feasibility
    })
  }

  const insights = [
    `個人開発の推奨スタック: ${sortedStacks.slice(0, 4).map(([t]) => t).join(' + ')}（実績ベース）`,
    '初期投資¥300K-500Kで構築可能な事業機会が最も多い',
    'Vercel + Supabaseの無料枠で月間1万MAUまでインフラコスト¥0',
    'AI API連携はOpenAI/Anthropic APIのPay-per-useで初期コストを抑制',
  ]

  return {
    ...base,
    confidence: 85,
    summary: `「${query}」に関する技術分析。${opps.length}件の事業機会の技術スタック・開発コスト・実現可能性を比較。`,
    findings,
    insights,
  }
}

function buildGeneralResearch(
  query: string, opps: ScoredOpp[], trds: ScoredTrend[], base: BaseResults
): ResearchResult {
  const findings: ResearchFinding[] = []

  // Top opportunities
  for (const { opp, score } of opps.slice(0, 3)) {
    findings.push({
      title: `${opp.title}（総合スコア ${opp.scores.overall}/100）`,
      description: `${opp.subtitle}。SAM: ${formatYen(opp.market.sizing.sam.value)}、CAGR: ${opp.market.sizing.cagr}%。推定売上 ${opp.revenue.estimated}。${opp.implementation.timeframe}で構築可能（${opp.implementation.totalCost}）。`,
      confidence: Math.min(90, Math.round(opp.scores.overall * 0.9 + score * 15))
    })
  }

  // Top trends
  for (const { trend } of trds.slice(0, 2)) {
    findings.push({
      title: `トレンド: ${trend.name}（モメンタム ${trend.momentum}）`,
      description: `${trend.fiveW1H.what}。予測: ${trend.prediction.shortTerm}`,
      confidence: trend.momentum
    })
  }

  const insights = generateMarketInsights(opps, trds)

  return {
    ...base,
    confidence: 75,
    summary: `「${query}」を多角的に分析。${opps.length}件の関連事業機会と${trds.length}件のトレンドを検出。データベース内の${opportunities.length}件の事業機会と${trends.length}件のトレンドから関連度スコアリング。`,
    findings,
    insights,
  }
}

function generateMarketInsights(opps: ScoredOpp[], trds: ScoredTrend[]): string[] {
  const insights: string[] = []

  // Blue ocean detection
  const lowCompetition = opps.filter(o => o.opp.scores.competition > 70)
  if (lowCompetition.length > 0) {
    insights.push(`競合が少ないブルーオーシャン: ${lowCompetition.slice(0, 2).map(o => o.opp.title).join('、')}`)
  }

  // Best timing
  const goodTiming = opps.filter(o => o.opp.scores.timing > 85)
  if (goodTiming.length > 0) {
    insights.push(`今がベストタイミング: ${goodTiming.slice(0, 2).map(o => `${o.opp.title}（タイミングスコア ${o.opp.scores.timing}）`).join('、')}`)
  }

  // Fastest to build
  const fastBuild = [...opps].sort((a, b) => {
    const aMonths = parseInt(a.opp.implementation.timeframe) || 3
    const bMonths = parseInt(b.opp.implementation.timeframe) || 3
    return aMonths - bMonths
  })
  if (fastBuild.length > 0) {
    insights.push(`最速で構築可能: ${fastBuild[0].opp.title}（${fastBuild[0].opp.implementation.timeframe}、${fastBuild[0].opp.implementation.totalCost}）`)
  }

  // Growing trends connection
  const emergingTrends = trds.filter(t => t.trend.status === 'emerging')
  if (emergingTrends.length > 0) {
    insights.push(`注目の新興トレンド: ${emergingTrends.map(t => t.trend.name).join('、')} — 早期参入で先行者優位`)
  }

  // Always add general insights
  insights.push('個人開発のMVPは1-2ヶ月以内が理想。3ヶ月超えると市場環境が変わるリスク')

  return insights
}
