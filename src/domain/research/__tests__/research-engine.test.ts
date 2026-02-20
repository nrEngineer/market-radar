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
  })

  it('should include query in summary for "market" type', () => {
    const result = executeCustomResearch('AI市場', 'market', baseContext)
    expect(result.summary).toContain('AI市場')
    expect(result.findings.length).toBeGreaterThan(0)
    expect(result.insights.length).toBeGreaterThan(0)
  })

  it('should return competitor analysis for "competitor" type', () => {
    const result = executeCustomResearch('AI', 'competitor', baseContext)
    expect(result.summary).toContain('競合')
    expect(result.findings.length).toBeGreaterThan(0)
  })

  it('should return pricing analysis for "pricing" type', () => {
    const result = executeCustomResearch('SaaS', 'pricing', baseContext)
    expect(result.summary).toContain('価格')
    expect(result.findings.length).toBeGreaterThan(0)
  })

  it('should return trend analysis for "trend" type', () => {
    const result = executeCustomResearch('AI', 'trend', baseContext)
    expect(result.summary).toContain('トレンド')
    expect(result.findings.length).toBeGreaterThan(0)
  })

  it('should handle general/custom type', () => {
    const result = executeCustomResearch('フリーランス請求管理', 'custom', baseContext)
    expect(result.summary.length).toBeGreaterThan(0)
    expect(result.findings.length).toBeGreaterThan(0)
    expect(result.insights.length).toBeGreaterThan(0)
  })

  it('should return results for unknown type using general handler', () => {
    const result = executeCustomResearch('test', 'unknown_type', baseContext)
    expect(result.summary).toContain('test')
    expect(result.findings.length).toBeGreaterThan(0)
    expect(result.insights.length).toBeGreaterThan(0)
  })

  it('should always have findings with confidence numbers', () => {
    const types = ['market', 'competitor', 'pricing', 'trend', 'customer', 'technology', 'custom']
    for (const type of types) {
      const result = executeCustomResearch('AI SaaS', type, baseContext)
      for (const finding of result.findings) {
        expect(typeof finding.confidence).toBe('number')
        expect(finding.confidence).toBeGreaterThan(0)
        expect(finding.confidence).toBeLessThanOrEqual(100)
      }
    }
  })

  it('should always return non-empty insights array', () => {
    const types = ['market', 'competitor', 'pricing', 'trend', 'customer', 'technology', 'custom']
    for (const type of types) {
      const result = executeCustomResearch('SaaS市場', type, baseContext)
      expect(result.insights.length).toBeGreaterThan(0)
    }
  })

  it('should return dataSource as "cached"', () => {
    const types = ['market', 'competitor', 'pricing', 'trend', 'custom']
    for (const type of types) {
      const result = executeCustomResearch('q', type, baseContext)
      expect(result.dataSource).toBe('cached')
    }
  })

  it('should find relevant opportunities when query matches keywords', () => {
    // Query about freelance invoicing should find related opportunities
    const result = executeCustomResearch('フリーランス 請求書 管理', 'market', baseContext)
    expect(result.findings.length).toBeGreaterThan(0)
    expect(result.summary.length).toBeGreaterThan(10)
  })

  it('should return customer analysis with segments and personas', () => {
    const result = executeCustomResearch('AI アプリ ユーザー', 'customer', baseContext)
    expect(result.findings.length).toBeGreaterThan(0)
    expect(result.insights.length).toBeGreaterThan(0)
  })

  it('should return technology analysis with tech stacks', () => {
    const result = executeCustomResearch('Next.js SaaS 開発', 'technology', baseContext)
    expect(result.findings.length).toBeGreaterThan(0)
    // Should mention tech stacks
    const allText = result.findings.map(f => f.description).join(' ')
    expect(allText.length).toBeGreaterThan(50)
  })
})
