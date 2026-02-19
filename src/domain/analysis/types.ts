// ═══════════════════════════════════════════════════════════════
// Free Market Analysis Domain Types
// ═══════════════════════════════════════════════════════════════

export interface MarketAnalysis {
  timestamp: string
  trendsAnalysis: TrendInsight[]
  marketOpportunities: MarketOpportunity[]
  competitiveLandscape: AnalysisCompetitiveLandscape
  investmentSignals: InvestmentSignal[]
  riskFactors: RiskFactor[]
  recommendations: Recommendation[]
  confidence: number
  dataSources: DataSourceSummary
}

export interface TrendInsight {
  trend: string
  momentum: number
  confidence: number
  timeframe: string
  impact: 'low' | 'medium' | 'high' | 'transformative'
  evidence: string[]
  prediction: string
}

export interface MarketOpportunity {
  title: string
  category: string
  description: string
  marketSize: string
  competitionLevel: 'low' | 'medium' | 'high'
  barriers: string[]
  timeline: string
  score: number
}

export interface AnalysisCompetitiveLandscape {
  emergingPlayers: string[]
  hotCategories: string[]
  consolidationTrends: string[]
  marketGaps: string[]
}

export interface InvestmentSignal {
  signal: string
  strength: number
  source: string
  implication: string
}

export interface RiskFactor {
  risk: string
  probability: number
  impact: number
  mitigation: string
}

export interface Recommendation {
  action: string
  priority: 'high' | 'medium' | 'low'
  timeframe: string
  rationale: string
}

export interface DataSourceSummary {
  github: number
  reddit: number
  trends: number
  press: number
  sec: number
  total: number
}
