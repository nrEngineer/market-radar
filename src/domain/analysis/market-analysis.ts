// ═══════════════════════════════════════════════════════════════
// Market Analysis Pure Functions — McKinsey-Grade Intelligence
// Zero I/O: all functions are pure computation over raw data
// ═══════════════════════════════════════════════════════════════

import type {
  MarketAnalysis,
  TrendInsight,
  MarketOpportunity,
  AnalysisCompetitiveLandscape,
  InvestmentSignal,
  RiskFactor,
  Recommendation,
} from './types'

// ── Input Types ────────────────────────────────────────────────

export interface GitHubRepo {
  name: string
  full_name?: string
  description: string | null
  language: string | null
  stargazers_count: number
  topics?: string[]
}

export interface RedditPost {
  title: string
  selftext: string
  score: number
  num_comments: number
  subreddit: string
}

export interface GitHubTrend {
  category: string
  momentum: number
  source: 'github'
}

export interface RedditSignal {
  title: string
  category: string
  sentiment: 'positive' | 'negative' | 'neutral'
  engagement: number
  subreddit: string
  source: 'reddit'
}

export interface MarketSignal {
  category: string
  techMomentum?: number
  socialMomentum?: number
  marketSentiment?: 'positive' | 'negative' | 'neutral'
  sources: string[]
}

export type MarketSignalMap = Record<string, MarketSignal>

export interface RawMarketData {
  github: GitHubRepo[]
  reddit: RedditPost[]
  summary: {
    totalDataPoints: number
    sources: {
      github: number
      reddit: number
      trends: number
      press: number
      sec: number
    }
  }
}

// ── GitHub Analysis ──────────────────────────────────────────

export function analyzeGitHubTrends(repos: GitHubRepo[]): GitHubTrend[] {
  const categoryTrends: Record<string, number> = {}

  repos.forEach(repo => {
    const category = classifyRepoCategory(repo)
    categoryTrends[category] = (categoryTrends[category] || 0) + repo.stargazers_count
  })

  return Object.entries(categoryTrends)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([category, momentum]) => ({ category, momentum, source: 'github' as const }))
}

export function classifyRepoCategory(repo: GitHubRepo): string {
  const name = repo.name.toLowerCase()
  const description = (repo.description || '').toLowerCase()
  const topics = repo.topics || []

  const text = `${name} ${description} ${topics.join(' ')}`

  if (/ai|artificial|intelligence|machine|learning|neural|gpt|llm|agent/.test(text)) {
    return 'AI/ML'
  }

  if (/framework|library|sdk|api|cli|dev|tool/.test(text)) {
    return 'Developer Tools'
  }

  if (/web|frontend|backend|fullstack|react|vue|angular/.test(text)) {
    return 'Web Development'
  }

  if (/data|analytics|dashboard|visualization|database/.test(text)) {
    return 'Data & Analytics'
  }

  if (/devops|docker|kubernetes|cloud|infrastructure|deployment/.test(text)) {
    return 'DevOps/Infrastructure'
  }

  return 'Other'
}

// ── Reddit Analysis ───────────────────────────────────────────

export function analyzeRedditSignals(posts: RedditPost[]): RedditSignal[] {
  const signals: RedditSignal[] = []

  posts.forEach(post => {
    const sentiment = analyzeSentiment(post)
    const category = classifyRedditPost(post)
    const engagement = post.score + post.num_comments

    if (engagement > 50) {
      signals.push({
        title: post.title,
        category,
        sentiment,
        engagement,
        subreddit: post.subreddit,
        source: 'reddit'
      })
    }
  })

  return signals.sort((a, b) => b.engagement - a.engagement).slice(0, 20)
}

export function analyzeSentiment(post: RedditPost): 'positive' | 'negative' | 'neutral' {
  const text = `${post.title} ${post.selftext}`.toLowerCase()

  const positiveWords = ['great', 'amazing', 'successful', 'growth', 'opportunity', 'innovative']
  const negativeWords = ['failed', 'problem', 'issue', 'struggling', 'declined', 'worried']

  const positiveCount = positiveWords.filter(word => text.includes(word)).length
  const negativeCount = negativeWords.filter(word => text.includes(word)).length

  if (positiveCount > negativeCount) return 'positive'
  if (negativeCount > positiveCount) return 'negative'
  return 'neutral'
}

export function classifyRedditPost(post: RedditPost): string {
  const text = `${post.title} ${post.selftext}`.toLowerCase()

  if (/funding|investment|raise|seed|series|valuation/.test(text)) return 'Funding'
  if (/launch|product|startup|mvp/.test(text)) return 'Product Launch'
  if (/acquisition|merger|bought|acquired/.test(text)) return 'M&A'
  if (/ai|artificial|intelligence|gpt|automation/.test(text)) return 'AI/Tech'
  if (/saas|software|platform|tool/.test(text)) return 'SaaS'

  return 'General'
}

// ── Signal Synthesis ──────────────────────────────────────────

export function synthesizeMarketSignals(githubTrends: GitHubTrend[], redditSignals: RedditSignal[]): MarketSignalMap {
  const combinedSignals: MarketSignalMap = {}

  githubTrends.forEach(trend => {
    combinedSignals[trend.category] = {
      category: trend.category,
      techMomentum: trend.momentum,
      sources: ['github']
    }
  })

  redditSignals.forEach(signal => {
    const category = signal.category
    if (combinedSignals[category]) {
      combinedSignals[category].marketSentiment = signal.sentiment
      combinedSignals[category].socialMomentum = signal.engagement
      combinedSignals[category].sources.push('reddit')
    } else {
      combinedSignals[category] = {
        category,
        marketSentiment: signal.sentiment,
        socialMomentum: signal.engagement,
        sources: ['reddit']
      }
    }
  })

  return combinedSignals
}

// ── Trend Insights ────────────────────────────────────────────

export function generateTrendInsights(marketSignals: MarketSignalMap): TrendInsight[] {
  const insights: TrendInsight[] = []

  Object.values(marketSignals).forEach((signal) => {
    const momentum = calculateTrendMomentum(signal)
    const confidence = calculateTrendConfidence(signal)

    if (momentum > 50) {
      insights.push({
        trend: signal.category,
        momentum,
        confidence,
        timeframe: predictTimeframe(momentum),
        impact: categorizeImpact(momentum),
        evidence: signal.sources.map((s: string) => `Strong ${s} signals`),
        prediction: generateTrendPrediction(signal)
      })
    }
  })

  return insights.sort((a, b) => b.momentum - a.momentum).slice(0, 5)
}

export function calculateTrendMomentum(signal: MarketSignal): number {
  let momentum = 0

  if (signal.techMomentum) momentum += Math.min(signal.techMomentum / 1000, 40)
  if (signal.socialMomentum) momentum += Math.min(signal.socialMomentum / 10, 30)
  if (signal.marketSentiment === 'positive') momentum += 20
  if (signal.sources.length > 1) momentum += 10

  return Math.min(momentum, 100)
}

export function calculateTrendConfidence(signal: MarketSignal): number {
  let confidence = 60

  if (signal.sources.length > 1) confidence += 20
  if (signal.techMomentum && signal.socialMomentum) confidence += 15
  if (signal.marketSentiment === 'positive') confidence += 5

  return Math.min(confidence, 95)
}

export function predictTimeframe(momentum: number): string {
  if (momentum > 80) return '1-3 months (immediate)'
  if (momentum > 60) return '3-6 months (near-term)'
  if (momentum > 40) return '6-12 months (medium-term)'
  return '12+ months (long-term)'
}

export function categorizeImpact(momentum: number): 'low' | 'medium' | 'high' | 'transformative' {
  if (momentum > 85) return 'transformative'
  if (momentum > 70) return 'high'
  if (momentum > 50) return 'medium'
  return 'low'
}

export function generateTrendPrediction(signal: MarketSignal): string {
  const category = signal.category
  const sentiment = signal.marketSentiment || 'neutral'

  const predictions: Record<string, string> = {
    'AI/ML': 'Continued rapid adoption with focus on practical applications and ROI measurement',
    'Developer Tools': 'Consolidation around platform plays and developer experience optimization',
    'SaaS': 'Vertical specialization and AI-powered automation integration',
    'Funding': sentiment === 'positive'
      ? 'Funding environment improving for proven models'
      : 'Continued selectivity with focus on profitability'
  }

  return predictions[category] || `${category} showing ${sentiment} signals with growing market interest`
}

// ── Market Opportunities ──────────────────────────────────────

export function identifyOpportunities(marketSignals: MarketSignalMap): MarketOpportunity[] {
  const opportunities: MarketOpportunity[] = []

  Object.values(marketSignals).forEach((signal) => {
    const momentum = calculateTrendMomentum(signal)
    const sourceCount = signal.sources.length

    if (momentum > 40 && sourceCount >= 1) {
      const competitionLevel: 'low' | 'medium' | 'high' =
        momentum > 80 ? 'high' : momentum > 60 ? 'medium' : 'low'

      opportunities.push({
        title: `${signal.category} Market Entry`,
        category: signal.category,
        description: `${signal.category} shows ${momentum}% momentum across ${sourceCount} data sources. ${signal.marketSentiment === 'positive' ? 'Positive market sentiment detected.' : 'Market sentiment is neutral or mixed.'}`,
        marketSize: momentum > 70 ? 'Large' : momentum > 50 ? 'Medium' : 'Emerging',
        competitionLevel,
        barriers: competitionLevel === 'high'
          ? ['Established players', 'High brand loyalty', 'Capital requirements']
          : competitionLevel === 'medium'
            ? ['Moderate competition', 'Technical complexity']
            : ['Low barriers to entry'],
        timeline: predictTimeframe(momentum),
        score: momentum,
      })
    }
  })

  return opportunities.sort((a, b) => b.score - a.score).slice(0, 5)
}

// ── Competitive Landscape ─────────────────────────────────────

export function mapCompetitiveLandscape(rawData: RawMarketData): AnalysisCompetitiveLandscape {
  const emergingPlayers: string[] = []
  const hotCategories: string[] = []
  const consolidationTrends: string[] = []
  const marketGaps: string[] = []

  // Extract emerging players from GitHub repos
  if (rawData.github && Array.isArray(rawData.github)) {
    rawData.github
      .filter(r => r.stargazers_count > 1000)
      .slice(0, 5)
      .forEach(r => emergingPlayers.push(r.full_name || r.name))
  }

  // Extract hot categories from GitHub trends
  const githubTrends = analyzeGitHubTrends(rawData.github || [])
  githubTrends.slice(0, 5).forEach(t => hotCategories.push(t.category))

  // Detect consolidation via category concentration
  const categoryCount: Record<string, number> = {}
  githubTrends.forEach(t => {
    categoryCount[t.category] = (categoryCount[t.category] || 0) + t.momentum
  })
  Object.entries(categoryCount)
    .filter(([, count]) => count > 5000)
    .forEach(([cat]) => consolidationTrends.push(`${cat}: high concentration indicates consolidation`))

  // Market gaps = categories with low representation but growing interest
  const redditSignals = analyzeRedditSignals(rawData.reddit || [])
  const redditCategories = new Set(redditSignals.map(s => s.category))
  const githubCategories = new Set(githubTrends.map(t => t.category))
  redditCategories.forEach(cat => {
    if (!githubCategories.has(cat)) {
      marketGaps.push(`${cat}: social interest without strong tech presence`)
    }
  })

  return { emergingPlayers, hotCategories, consolidationTrends, marketGaps }
}

// ── Investment Signals ────────────────────────────────────────

export function extractInvestmentSignals(rawData: RawMarketData): InvestmentSignal[] {
  const signals: InvestmentSignal[] = []

  // Extract funding-related signals from Reddit
  const redditSignals = analyzeRedditSignals(rawData.reddit || [])
  redditSignals
    .filter(s => s.category === 'Funding' || s.category === 'M&A')
    .forEach(s => {
      signals.push({
        signal: s.title,
        strength: Math.min(s.engagement / 100, 1),
        source: `Reddit r/${s.subreddit}`,
        implication: s.category === 'Funding'
          ? 'Active investment indicates growing market confidence'
          : 'M&A activity signals market consolidation phase',
      })
    })

  // GitHub momentum as tech investment signal
  const githubTrends = analyzeGitHubTrends(rawData.github || [])
  githubTrends
    .filter(t => t.momentum > 5000)
    .forEach(t => {
      signals.push({
        signal: `High developer activity in ${t.category}`,
        strength: Math.min(t.momentum / 50000, 1),
        source: 'GitHub Trending',
        implication: `Strong open-source momentum in ${t.category} suggests growing ecosystem and market opportunity`,
      })
    })

  return signals.sort((a, b) => b.strength - a.strength).slice(0, 10)
}

// ── Risk Assessment ───────────────────────────────────────────

export function assessRisks(marketSignals: MarketSignalMap): RiskFactor[] {
  const risks: RiskFactor[] = []

  const signals = Object.values(marketSignals)

  // High competition risk
  const highMomentumCount = signals.filter(s => calculateTrendMomentum(s) > 70).length
  if (highMomentumCount > 3) {
    risks.push({
      risk: 'Intense competition in trending categories',
      probability: 0.8,
      impact: 0.7,
      mitigation: 'Focus on underserved niches and differentiated value propositions',
    })
  }

  // Market concentration risk
  const dominantCategories = signals.filter(s => (s.techMomentum || 0) > 10000)
  if (dominantCategories.length > 0) {
    risks.push({
      risk: 'Market dominated by established players in key categories',
      probability: 0.6,
      impact: 0.8,
      mitigation: 'Target adjacent or emerging segments where incumbents are slow to adapt',
    })
  }

  // Negative sentiment risk
  const negativeSentiment = signals.filter(s => s.marketSentiment === 'negative')
  if (negativeSentiment.length > 0) {
    risks.push({
      risk: 'Negative market sentiment detected in some segments',
      probability: 0.5,
      impact: 0.5,
      mitigation: 'Monitor sentiment trends and avoid heavily negative segments',
    })
  }

  // Data sparsity risk
  const singleSourceSignals = signals.filter(s => s.sources.length <= 1)
  if (singleSourceSignals.length > signals.length / 2) {
    risks.push({
      risk: 'Limited data sources reducing analysis confidence',
      probability: 0.7,
      impact: 0.4,
      mitigation: 'Integrate additional data sources to improve signal reliability',
    })
  }

  return risks.sort((a, b) => (b.probability * b.impact) - (a.probability * a.impact))
}

// ── Recommendations ───────────────────────────────────────────

export function generateRecommendations(marketSignals: MarketSignalMap): Recommendation[] {
  const recommendations: Recommendation[] = []
  const signals = Object.values(marketSignals)

  // Sort by momentum to prioritize
  const ranked = signals
    .map(s => ({ ...s, momentum: calculateTrendMomentum(s) }))
    .sort((a, b) => b.momentum - a.momentum)

  // Top opportunity recommendation
  if (ranked.length > 0 && ranked[0].momentum > 60) {
    recommendations.push({
      action: `Prioritize ${ranked[0].category} as primary market focus`,
      priority: 'high',
      timeframe: '1-3 months',
      rationale: `Highest momentum (${ranked[0].momentum}%) with signals from ${ranked[0].sources.join(', ')}`,
    })
  }

  // Multi-source validation recommendation
  const multiSourceSignals = ranked.filter(s => s.sources.length > 1)
  if (multiSourceSignals.length > 0) {
    recommendations.push({
      action: `Deep-dive analysis into ${multiSourceSignals.map(s => s.category).join(', ')}`,
      priority: 'high',
      timeframe: '2-4 weeks',
      rationale: 'These categories show correlated signals across multiple data sources, indicating strong market validation',
    })
  }

  // Emerging opportunity recommendation
  const emerging = ranked.filter(s => s.momentum > 40 && s.momentum <= 60)
  if (emerging.length > 0) {
    recommendations.push({
      action: `Monitor emerging trends in ${emerging.map(s => s.category).slice(0, 3).join(', ')}`,
      priority: 'medium',
      timeframe: '3-6 months',
      rationale: 'Moderate momentum suggests these categories may become significant opportunities as they mature',
    })
  }

  // Data improvement recommendation
  const lowConfidence = ranked.filter(s => s.sources.length <= 1)
  if (lowConfidence.length > 2) {
    recommendations.push({
      action: 'Expand data collection to additional sources for better signal validation',
      priority: 'medium',
      timeframe: '1-2 months',
      rationale: `${lowConfidence.length} signals rely on single data source, limiting analysis confidence`,
    })
  }

  return recommendations
}

// ── Confidence ────────────────────────────────────────────────

export function calculateConfidence(dataPoints: number): number {
  if (dataPoints > 200) return 85
  if (dataPoints > 100) return 75
  if (dataPoints > 50) return 65
  return 55
}

// ── Main Orchestration (pure computation, no I/O) ─────────────

export function performClaudeAnalysis(
  rawData: RawMarketData,
  analysisType: string,
  timeframe: string,
  timestamp: string
): MarketAnalysis {
  const githubTrends = analyzeGitHubTrends(rawData.github)
  const redditSignals = analyzeRedditSignals(rawData.reddit)
  const marketSignals = synthesizeMarketSignals(githubTrends, redditSignals)

  return {
    timestamp,
    trendsAnalysis: generateTrendInsights(marketSignals),
    marketOpportunities: identifyOpportunities(marketSignals),
    competitiveLandscape: mapCompetitiveLandscape(rawData),
    investmentSignals: extractInvestmentSignals(rawData),
    riskFactors: assessRisks(marketSignals),
    recommendations: generateRecommendations(marketSignals),
    confidence: calculateConfidence(rawData.summary.totalDataPoints),
    dataSources: {
      github: rawData.summary.sources.github,
      reddit: rawData.summary.sources.reddit,
      trends: rawData.summary.sources.trends,
      press: rawData.summary.sources.press,
      sec: rawData.summary.sources.sec,
      total: rawData.summary.totalDataPoints
    }
  }
}
