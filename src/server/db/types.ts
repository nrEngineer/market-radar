export interface DatabaseOpportunity {
  id: string
  title: string
  subtitle: string
  category: string
  subcategory: string
  status: 'validated' | 'hypothesis' | 'researching' | 'archived'
  five_w1h: Record<string, unknown>
  scores: Record<string, unknown>
  risks: Record<string, unknown>
  revenue: Record<string, unknown>
  market: Record<string, unknown>
  implementation: Record<string, unknown>
  competitors: Record<string, unknown>
  target_segments: Record<string, unknown>
  evidence: Record<string, unknown>
  provenance: Record<string, unknown>
  next_steps: Record<string, unknown>
  tags: string[]
  created_at: string
  updated_at: string
}

export interface DatabaseTrend {
  id: string
  name: string
  category: string
  status: 'emerging' | 'growing' | 'mature' | 'declining'
  momentum: number
  search_volume: Record<string, unknown>[]
  adoption_curve: string
  impact: 'low' | 'medium' | 'high' | 'transformative'
  timeframe: string
  related_trends: string[]
  signals: Record<string, unknown>[]
  prediction: Record<string, unknown>
  five_w1h: Record<string, unknown>
  provenance: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface DatabaseCategory {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  color: string
  total_apps: number
  total_revenue: string
  avg_revenue: string
  median_revenue: string
  growth: string
  yoy_growth: string
  sizing: Record<string, unknown>
  monthly_data: Record<string, unknown>[]
  top_apps: Record<string, unknown>[]
  subcategories: Record<string, unknown>[]
  regions: Record<string, unknown>[]
  five_w1h: Record<string, unknown>
  provenance: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface DatabaseCollectedData {
  id: string
  source: string
  raw_data: Record<string, unknown>
  processed_data?: Record<string, unknown>
  collected_at: string
  data_count: number
  status: 'success' | 'error' | 'partial'
  error?: string
  metadata?: Record<string, unknown>
}

export interface DatabaseCollectionLog {
  id: string
  source: string
  status: 'success' | 'error' | 'partial'
  data_count: number
  error?: string
  execution_time_ms: number
  timestamp: string
  metadata?: Record<string, unknown>
}
