import { describe, it, expect } from 'vitest'
import { generateAnalysisId, executeCustomResearch, type ResearchContext } from '../research-engine'

const baseContext: ResearchContext = {
  analysisId: 'analysis_abc123456_1700000000',
  executionTimeMs: 42,
  confidence: 85,
}

describe('generateAnalysisId', () => {
  it('should return id with "analysis_" prefix', () => {
    const id = generateAnalysisId('550e8400-e29b-41d4-a716-446655440000', 1700000000)
    expect(id).toMatch(/^analysis_/)
  })

  it('should strip dashes from uuid and take first 9 chars', () => {
    const id = generateAnalysisId('550e8400-e29b-41d4-a716-446655440000', 1700000000)
    // '550e8400e29b41d4a716446655440000' → first 9 = '550e8400e'
    expect(id).toBe('analysis_550e8400e_1700000000')
  })

  it('should append timestamp after underscore', () => {
    const ts = 9999999999
    const id = generateAnalysisId('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee', ts)
    expect(id).toContain(`_${ts}`)
  })
})

describe('executeCustomResearch', () => {
  it('should return baseResults fields from context', () => {
    const result = executeCustomResearch('test query', 'market', baseContext)
    expect(result.analysisId).toBe(baseContext.analysisId)
    expect(result.executionTimeMs).toBe(baseContext.executionTimeMs)
    expect(result.confidence).toBe(baseContext.confidence)
  })

  it('should include query in summary for "market" type', () => {
    const result = executeCustomResearch('AI市場', 'market', baseContext)
    expect(result.summary).toContain('AI市場')
    expect(result.findings.length).toBe(3)
    expect(result.insights.length).toBe(4)
  })

  it('should return competitor analysis for "competitor" type', () => {
    const result = executeCustomResearch('test', 'competitor', baseContext)
    expect(result.summary).toContain('競合他社')
    expect(result.findings.length).toBe(3)
    expect(result.findings[0].title).toBe('McKinsey Digital')
  })

  it('should return pricing analysis for "pricing" type', () => {
    const result = executeCustomResearch('test', 'pricing', baseContext)
    expect(result.summary).toContain('価格戦略')
    expect(result.findings.length).toBe(3)
  })

  it('should return trend analysis for "trend" type', () => {
    const result = executeCustomResearch('test', 'trend', baseContext)
    expect(result.summary).toContain('トレンド')
    expect(result.findings.length).toBe(3)
  })

  it('should include query in summary for "custom" type', () => {
    const result = executeCustomResearch('特定のクエリ', 'custom', baseContext)
    expect(result.summary).toContain('特定のクエリ')
    expect(result.findings.length).toBe(3)
  })

  it('should return basic analysis for unknown type', () => {
    const result = executeCustomResearch('test', 'unknown_type', baseContext)
    expect(result.summary).toContain('test')
    expect(result.findings.length).toBe(1)
    expect(result.insights.length).toBe(1)
  })

  it('should always have findings with confidence numbers', () => {
    const types = ['market', 'competitor', 'pricing', 'trend', 'custom', 'other']
    for (const type of types) {
      const result = executeCustomResearch('q', type, baseContext)
      for (const finding of result.findings) {
        expect(typeof finding.confidence).toBe('number')
        expect(finding.confidence).toBeGreaterThan(0)
        expect(finding.confidence).toBeLessThanOrEqual(100)
      }
    }
  })

  it('should always return non-empty insights array', () => {
    const types = ['market', 'competitor', 'pricing', 'trend', 'custom', 'other']
    for (const type of types) {
      const result = executeCustomResearch('q', type, baseContext)
      expect(result.insights.length).toBeGreaterThan(0)
    }
  })

  it('should always return dataSource as "template"', () => {
    const types = ['market', 'competitor', 'pricing', 'trend', 'custom', 'other']
    for (const type of types) {
      const result = executeCustomResearch('q', type, baseContext)
      expect(result.dataSource).toBe('template')
    }
  })
})
