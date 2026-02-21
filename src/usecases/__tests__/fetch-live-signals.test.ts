import { describe, it, expect, vi } from 'vitest'

vi.mock('@/integrations/collectors/app-store', () => ({
  collectAppStore: vi.fn().mockResolvedValue({
    source: 'appstore',
    status: 'success',
    dataCount: 2,
    timestamp: new Date().toISOString(),
    data: [
      { name: 'App1', category: 'Productivity', rating: 4.5, price: 0 },
      { name: 'App2', category: 'Business', rating: 3.5, price: 5 },
    ],
  }),
}))

vi.mock('@/integrations/collectors/hacker-news', () => ({
  collectHackerNews: vi.fn().mockResolvedValue({
    source: 'hackernews',
    status: 'success',
    dataCount: 3,
    timestamp: new Date().toISOString(),
    data: [
      { title: 'Show HN: AI SaaS tool', score: 100, url: 'https://example.com/1' },
      { title: 'Launch: New startup platform', score: 50, url: 'https://example.com/2' },
      { title: 'Regular non-tech post', score: 30, url: 'https://example.com/3' },
    ],
  }),
}))

import { fetchLiveSignals } from '../fetch-live-signals'

describe('fetchLiveSignals', () => {
  it('should return structured result', async () => {
    const result = await fetchLiveSignals()

    expect(result.timestamp).toBeDefined()
    expect(result.sources).toBeDefined()
    expect(result.techSignals).toBeDefined()
    expect(result.appSignals).toBeDefined()
    expect(result.hotCategories).toBeDefined()
    expect(result.totalDataPoints).toBeDefined()
  })

  it('should include source status', async () => {
    const result = await fetchLiveSignals()

    expect(result.sources.hackerNews.status).toBe('success')
    expect(result.sources.appStore.status).toBe('success')
    expect(result.sources.hackerNews.items).toBe(3)
    expect(result.sources.appStore.items).toBe(2)
  })

  it('should filter tech signals by keywords', async () => {
    const result = await fetchLiveSignals()

    // "AI SaaS tool" and "startup platform" match, "Regular non-tech post" does not
    expect(result.techSignals.length).toBeGreaterThanOrEqual(1)
    for (const signal of result.techSignals) {
      expect(signal.source).toBe('Hacker News')
      expect(signal.category).toBeDefined()
    }
  })

  it('should filter apps with rating >= 4.0', async () => {
    const result = await fetchLiveSignals()

    // Only App1 (4.5) passes, App2 (3.5) filtered out
    expect(result.appSignals).toHaveLength(1)
    expect(result.appSignals[0].name).toBe('App1')
  })

  it('should categorize tech signals correctly', async () => {
    const result = await fetchLiveSignals()

    const aiSignal = result.techSignals.find(s => String(s.title).includes('AI'))
    if (aiSignal) {
      expect(aiSignal.category).toBe('AI/ML')
    }
  })

  it('should compute hot categories', async () => {
    const result = await fetchLiveSignals()

    expect(Array.isArray(result.hotCategories)).toBe(true)
    for (const cat of result.hotCategories) {
      expect(cat.category).toBeDefined()
      expect(cat.count).toBeGreaterThan(0)
    }
  })

  it('should compute total data points', async () => {
    const result = await fetchLiveSignals()

    expect(result.totalDataPoints).toBe(5) // 3 HN + 2 App Store
  })

  it('should format app price correctly', async () => {
    const result = await fetchLiveSignals()

    const freeApp = result.appSignals.find(a => a.name === 'App1')
    expect(freeApp?.price).toBe('Free')
  })
})
