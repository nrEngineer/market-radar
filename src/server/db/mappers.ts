import type { DatabaseOpportunity, DatabaseTrend } from './types'

export function convertToOpportunity(dbRecord: DatabaseOpportunity): Record<string, unknown> {
  return {
    id: dbRecord.id,
    title: dbRecord.title,
    subtitle: dbRecord.subtitle,
    category: dbRecord.category,
    subcategory: dbRecord.subcategory,
    status: dbRecord.status,
    fiveW1H: dbRecord.five_w1h,
    scores: dbRecord.scores,
    risks: dbRecord.risks,
    revenue: dbRecord.revenue,
    market: dbRecord.market,
    implementation: dbRecord.implementation,
    competitors: dbRecord.competitors,
    targetSegments: dbRecord.target_segments,
    evidence: dbRecord.evidence,
    provenance: dbRecord.provenance,
    nextSteps: dbRecord.next_steps,
    tags: dbRecord.tags,
    createdAt: dbRecord.created_at,
    updatedAt: dbRecord.updated_at,
  }
}

export function convertToTrend(dbRecord: DatabaseTrend): Record<string, unknown> {
  return {
    id: dbRecord.id,
    name: dbRecord.name,
    category: dbRecord.category,
    status: dbRecord.status,
    momentum: dbRecord.momentum,
    searchVolume: dbRecord.search_volume,
    adoptionCurve: dbRecord.adoption_curve,
    impact: dbRecord.impact,
    timeframe: dbRecord.timeframe,
    relatedTrends: dbRecord.related_trends,
    signals: dbRecord.signals,
    prediction: dbRecord.prediction,
    fiveW1H: dbRecord.five_w1h,
    provenance: dbRecord.provenance,
    createdAt: dbRecord.created_at,
    updatedAt: dbRecord.updated_at,
  }
}
