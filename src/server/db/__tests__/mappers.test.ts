import { describe, it, expect } from 'vitest'
import { convertToOpportunity, convertToTrend } from '../mappers'
import type { DatabaseOpportunity, DatabaseTrend } from '../types'

describe('convertToOpportunity', () => {
  const mockOpp: DatabaseOpportunity = {
    id: 'opp-1',
    title: 'Test Opportunity',
    subtitle: 'Subtitle',
    category: 'SaaS',
    subcategory: 'B2B',
    status: 'validated',
    five_w1h: { what: 'test' },
    scores: { overall: 85 },
    risks: { level: 'low' },
    revenue: { estimated: '¥10M' },
    market: { size: 'large' },
    implementation: { timeframe: '3m' },
    competitors: {},
    target_segments: {},
    evidence: {},
    provenance: {},
    next_steps: {},
    tags: ['saas'],
    created_at: '2026-01-01',
    updated_at: '2026-02-01',
  }

  it('should convert snake_case to camelCase', () => {
    const result = convertToOpportunity(mockOpp)

    expect(result.id).toBe('opp-1')
    expect(result.title).toBe('Test Opportunity')
    expect(result.fiveW1H).toEqual({ what: 'test' })
    expect(result.targetSegments).toEqual({})
    expect(result.nextSteps).toEqual({})
    expect(result.createdAt).toBe('2026-01-01')
    expect(result.updatedAt).toBe('2026-02-01')
  })

  it('should preserve all fields', () => {
    const result = convertToOpportunity(mockOpp)

    expect(Object.keys(result)).toHaveLength(20)
  })
})

describe('convertToTrend', () => {
  const mockTrend: DatabaseTrend = {
    id: 'trend-1',
    name: 'AI Agents',
    category: 'Technology',
    status: 'growing',
    momentum: 85,
    search_volume: [{ date: '2026-01', value: 100 }],
    adoption_curve: 'early-majority',
    impact: 'high',
    timeframe: '2026-2027',
    related_trends: ['LLM'],
    signals: [],
    prediction: { direction: 'up' },
    five_w1h: { what: 'AI agents' },
    provenance: {},
    created_at: '2026-01-01',
    updated_at: '2026-02-01',
  }

  it('should convert snake_case to camelCase', () => {
    const result = convertToTrend(mockTrend)

    expect(result.id).toBe('trend-1')
    expect(result.name).toBe('AI Agents')
    expect(result.searchVolume).toEqual([{ date: '2026-01', value: 100 }])
    expect(result.adoptionCurve).toBe('early-majority')
    expect(result.relatedTrends).toEqual(['LLM'])
    expect(result.fiveW1H).toEqual({ what: 'AI agents' })
    expect(result.createdAt).toBe('2026-01-01')
    expect(result.updatedAt).toBe('2026-02-01')
  })

  it('should preserve all fields', () => {
    const result = convertToTrend(mockTrend)

    expect(Object.keys(result)).toHaveLength(16)
  })
})
