import { describe, it, expect, vi } from 'vitest'

vi.mock('@/integrations/free-sources/collector', () => ({
  freeDataCollector: {
    collectAllMarketData: vi.fn().mockResolvedValue({
      github: [],
      reddit: [],
      trends: [],
      sec: [],
      press: [],
      summary: { timestamp: new Date().toISOString(), sources: {}, totalDataPoints: 0 },
    }),
  },
}))

import { runFreeAnalysis } from '../run-free-analysis'

describe('runFreeAnalysis', () => {
  it('should return a MarketAnalysis object', async () => {
    const result = await runFreeAnalysis('comprehensive', '30d')

    expect(result).toBeDefined()
    expect(result).toHaveProperty('timestamp')
  })

  it('should include trend analysis', async () => {
    const result = await runFreeAnalysis('market-overview', '7d')
    expect(result).toHaveProperty('trendsAnalysis')
    expect(Array.isArray(result.trendsAnalysis)).toBe(true)
  })

  it('should include market data sections', async () => {
    const result = await runFreeAnalysis('comprehensive', '30d')

    expect(result).toHaveProperty('marketOpportunities')
    expect(result).toHaveProperty('competitiveLandscape')
    expect(result).toHaveProperty('riskFactors')
    expect(result).toHaveProperty('recommendations')
    expect(result).toHaveProperty('investmentSignals')
    expect(result).toHaveProperty('dataSources')
  })

  it('should include confidence score', async () => {
    const result = await runFreeAnalysis('comprehensive', '30d')

    expect(result.confidence).toBeGreaterThanOrEqual(0)
    expect(result.confidence).toBeLessThanOrEqual(100)
  })
})
