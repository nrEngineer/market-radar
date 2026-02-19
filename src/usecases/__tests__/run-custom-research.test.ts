import { describe, it, expect } from 'vitest'
import { runCustomResearch } from '../run-custom-research'

describe('runCustomResearch', () => {
  const timestamp = '2026-02-19T00:00:00.000Z'

  it('should return result with status success', () => {
    const result = runCustomResearch('AI market', 'market', timestamp)
    expect(result.status).toBe('success')
  })

  it('should echo back query and type', () => {
    const result = runCustomResearch('my query', 'competitor', timestamp)
    expect(result.query).toBe('my query')
    expect(result.type).toBe('competitor')
  })

  it('should echo back timestamp', () => {
    const result = runCustomResearch('q', 'market', timestamp)
    expect(result.timestamp).toBe(timestamp)
  })

  it('should generate a valid analysisId', () => {
    const result = runCustomResearch('q', 'market', timestamp)
    expect(result.analysisId).toMatch(/^analysis_[a-f0-9]{9}_\d+$/)
  })

  it('should throw when query is empty', () => {
    expect(() => runCustomResearch('', 'market', timestamp)).toThrow('Query and type required')
  })

  it('should throw when type is empty', () => {
    expect(() => runCustomResearch('query', '', timestamp)).toThrow('Query and type required')
  })

  it('should return findings and insights for each type', () => {
    const types = ['market', 'competitor', 'pricing', 'trend', 'custom']
    for (const type of types) {
      const result = runCustomResearch('test', type, timestamp)
      expect(result.findings.length).toBeGreaterThan(0)
      expect(result.insights.length).toBeGreaterThan(0)
    }
  })

  it('should have summary containing the query for market type', () => {
    const result = runCustomResearch('特定のキーワード', 'market', timestamp)
    expect(result.summary).toContain('特定のキーワード')
  })
})
