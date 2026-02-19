import { describe, it, expect, vi } from 'vitest'

// Mock all external collectors before importing the module under test
vi.mock('@/integrations/collectors/app-store', () => ({
  collectAppStore: vi.fn().mockResolvedValue({
    source: 'appstore',
    status: 'success',
    dataCount: 10,
    timestamp: '2026-02-19T00:00:00.000Z',
    data: [],
  }),
}))

vi.mock('@/integrations/collectors/hacker-news', () => ({
  collectHackerNews: vi.fn().mockResolvedValue({
    source: 'hackernews',
    status: 'success',
    dataCount: 5,
    timestamp: '2026-02-19T00:00:00.000Z',
    data: [],
  }),
}))

vi.mock('@/integrations/product-hunt/client', () => ({
  productHuntAPI: {
    getTodaysFeatured: vi.fn().mockResolvedValue([]),
  },
}))

import { collectMarketData } from '../collect-market-data'

describe('collectMarketData', () => {
  it('should collect all sources when no source specified', async () => {
    const result = await collectMarketData()
    expect(result.totalSources).toBe(3)
    expect(result.timestamp).toBeDefined()
  })

  it('should collect only appstore when source is appstore', async () => {
    const result = await collectMarketData('appstore')
    expect(result.totalSources).toBe(1)
    expect(result.results[0].source).toBe('appstore')
  })

  it('should collect only hackernews when source is hackernews', async () => {
    const result = await collectMarketData('hackernews')
    expect(result.totalSources).toBe(1)
    expect(result.results[0].source).toBe('hackernews')
  })

  it('should collect only producthunt when source is producthunt', async () => {
    const result = await collectMarketData('producthunt')
    expect(result.totalSources).toBe(1)
    expect(result.results[0].source).toBe('producthunt')
  })

  it('should throw for invalid source', async () => {
    await expect(collectMarketData('invalid')).rejects.toThrow('Invalid source: invalid')
  })

  it('should aggregate totalItems from all results', async () => {
    const result = await collectMarketData('appstore')
    expect(result.totalItems).toBe(10)
  })

  it('should count success and error results', async () => {
    const result = await collectMarketData('appstore')
    expect(result.successCount).toBe(1)
    expect(result.errorCount).toBe(0)
  })
})
