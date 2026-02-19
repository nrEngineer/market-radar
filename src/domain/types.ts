/* ═══════════════════════════════════════════════════════════════
   Market Radar — Pro-Grade Type Definitions
   5W1H Information Architecture
   ═══════════════════════════════════════════════════════════════ */

// ── Data Quality & Provenance ──
export interface DataSource {
  name: string
  url: string
  type: 'api' | 'scraping' | 'manual' | 'ai-analysis'
  lastCollected: string
  frequency: string // e.g. "毎日", "毎時", "週次"
  reliability: number // 0-100
  sampleSize?: number
  methodology?: string
}

export interface DataProvenance {
  sources: DataSource[]
  collectedAt: string
  updatedAt: string
  confidenceScore: number // 0-100
  qualityIndicators: {
    completeness: number
    accuracy: number
    timeliness: number
    consistency: number
  }
  notes?: string
}

// ── 5W1H Framework ──
export interface FiveW1H {
  what: string    // 何のデータか
  who: string     // 誰のためのデータか
  when: string    // いつのデータか
  where: string   // どこの市場か
  why: string     // なぜ重要か
  how: string     // どう活用するか
}

// ── Market Sizing (TAM/SAM/SOM) ──
export interface MarketSizing {
  tam: { value: number; unit: string; description: string; year: number }
  sam: { value: number; unit: string; description: string; year: number }
  som: { value: number; unit: string; description: string; year: number }
  cagr: number // Compound Annual Growth Rate %
  methodology: string
  sources: string[]
}

// ── Competitor Analysis ──
export interface Competitor {
  id: string
  name: string
  logo?: string
  description: string
  founded: number
  funding: string
  employees: string
  revenue: string
  marketShare: number // %
  strengths: string[]
  weaknesses: string[]
  positioning: {
    x: number // -100 to 100 (price: low→high)
    y: number // -100 to 100 (features: basic→advanced)
  }
  products: string[]
  regions: string[]
  recentMoves: string[]
}

export interface CompetitiveLandscape {
  totalPlayers: number
  topPlayers: Competitor[]
  marketConcentration: 'fragmented' | 'moderate' | 'concentrated' | 'monopolistic'
  herfindahlIndex: number
  entryBarriers: { factor: string; level: 'low' | 'medium' | 'high'; description: string }[]
  keySuccessFactors: string[]
}

// ── Customer Segmentation ──
export interface CustomerSegment {
  id: string
  name: string
  size: string
  percentage: number // % of total market
  characteristics: string[]
  painPoints: string[]
  willingness: number // 0-100 willingness to pay
  acquisitionCost: string
  ltv: string
  channels: string[]
  persona: {
    name: string
    age: string
    role: string
    goals: string[]
    frustrations: string[]
    quote: string
  }
}

// ── Trend Analysis ──
export interface TrendData {
  id: string
  name: string
  category: string
  status: 'emerging' | 'growing' | 'mature' | 'declining'
  momentum: number // -100 to 100
  searchVolume: { month: string; value: number }[]
  adoptionCurve: 'innovators' | 'early_adopters' | 'early_majority' | 'late_majority' | 'laggards'
  impact: 'low' | 'medium' | 'high' | 'transformative'
  timeframe: string
  relatedTrends: string[]
  signals: { source: string; signal: string; date: string; strength: number }[]
  prediction: {
    shortTerm: string // 3-6 months
    midTerm: string   // 6-18 months
    longTerm: string  // 18-36 months
  }
  fiveW1H: FiveW1H
  provenance: DataProvenance
}

// ── Opportunity (Enhanced) ──
export interface OpportunityDetail {
  id: string
  title: string
  subtitle: string
  category: string
  subcategory: string
  status: 'validated' | 'hypothesis' | 'researching' | 'archived'
  
  // Revenue & Financials
  revenue: {
    estimated: string
    range: { min: number; max: number }
    model: string // "SaaS", "Freemium", "One-time", etc.
    projections: { month: string; value: number }[]
    breakEven: string
    margins: { gross: number; net: number }
  }
  
  // Market Analysis
  market: {
    sizing: MarketSizing
    growth: string
    maturity: 'nascent' | 'emerging' | 'growing' | 'mature' | 'declining'
    competitiveIntensity: number // 0-100
  }
  
  // Scoring
  scores: {
    overall: number
    marketSize: number
    growth: number
    competition: number
    feasibility: number
    timing: number
    moat: number
  }
  
  // Risk Assessment
  risks: {
    level: 'low' | 'medium' | 'high'
    factors: { name: string; probability: number; impact: number; mitigation: string }[]
    scenarios: {
      best: { description: string; revenue: string; probability: number }
      base: { description: string; revenue: string; probability: number }
      worst: { description: string; revenue: string; probability: number }
    }
  }
  
  // Implementation
  implementation: {
    timeframe: string
    phases: { name: string; duration: string; tasks: string[]; cost: string }[]
    techStack: string[]
    teamSize: string
    totalCost: string
  }
  
  // Competition
  competitors: Competitor[]
  
  // Customers
  targetSegments: CustomerSegment[]
  
  // Evidence
  evidence: {
    productHunt: { upvotes: number; rank: number; date: string } | null
    appStore: { rating: number; reviews: number; rank: number } | null
    searchTrend: { volume: number; growth: string } | null
    socialSignals: { mentions: number; sentiment: number } | null
  }
  
  // 5W1H
  fiveW1H: FiveW1H
  
  // Data Quality
  provenance: DataProvenance
  
  // Action Items
  nextSteps: { priority: number; action: string; deadline: string; owner: string }[]
  
  // Metadata
  createdAt: string
  updatedAt: string
  tags: string[]
}

// ── Category Deep-Dive ──
export interface CategoryDetail {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  color: string
  
  // Market Data
  totalApps: number
  totalRevenue: string
  avgRevenue: string
  medianRevenue: string
  growth: string
  yoyGrowth: string
  
  // Market Sizing
  sizing: MarketSizing
  
  // Trends
  monthlyData: { month: string; apps: number; revenue: number; growth: number }[]
  
  // Top Players
  topApps: {
    name: string
    revenue: string
    downloads: string
    rating: number
    growth: string
  }[]
  
  // Sub-categories
  subcategories: {
    name: string
    count: number
    growth: string
    avgRevenue: string
  }[]
  
  // Regional Data
  regions: {
    name: string
    marketShare: number
    growth: string
    revenue: string
  }[]
  
  // 5W1H
  fiveW1H: FiveW1H
  provenance: DataProvenance
}

// ── Revenue Models ──
export interface RevenueModel {
  type: string
  description: string
  avgArpu: string
  conversionRate: string
  churnRate: string
  ltv: string
  cac: string
  ltvCacRatio: number
  examples: string[]
  pros: string[]
  cons: string[]
}

export interface RevenueProjection {
  scenario: string
  months: { month: string; mrr: number; users: number; churn: number; growth: number }[]
  annualRevenue: number
  assumptions: string[]
}

// ── Analytics Dashboard ──
export interface AnalyticsSummary {
  period: string
  totalOpportunities: number
  newOpportunities: number
  validatedOpportunities: number
  avgScore: number
  topCategory: string
  topGrowthArea: string
  dataPointsCollected: number
  sourcesActive: number
  marketInsights: {
    insight: string
    impact: 'positive' | 'negative' | 'neutral'
    confidence: number
    source: string
  }[]
  weeklyTrend: { week: string; opportunities: number; avgScore: number }[]
  categoryDistribution: { category: string; count: number; avgScore: number }[]
  riskDistribution: { level: string; count: number; percentage: number }[]
}

// ── Methodology ──
export interface MethodologySection {
  title: string
  description: string
  steps: { step: number; name: string; description: string; tools: string[] }[]
  dataQualityFramework: string
  limitations: string[]
  updateFrequency: string
}

// ── Navigation ──
export interface NavItem {
  label: string
  href: string
  icon: string
  badge?: string
  description?: string
}
