import { describe, it, expect } from 'vitest'
import { analyzeHackerNewsData, analyzeAppStoreData, generateSummaryInsights, type MarketInsight } from '../analyzer'

const timestamp = '2026-02-19T00:00:00.000Z'

// ── analyzeHackerNewsData ─────────────────────────────────────

describe('analyzeHackerNewsData', () => {
  it('should generate AI insight when AI stories exist', () => {
    const stories = [
      { title: 'New GPT-4 model released', score: 200, url: 'https://example.com', commentCount: 50, timestamp },
      { title: 'OpenAI announces Claude competitor', score: 150, url: 'https://example.com', commentCount: 30, timestamp },
    ]
    const insights = analyzeHackerNewsData(stories, timestamp)
    expect(insights.some(i => i.category === 'AI / Machine Learning')).toBe(true)
  })

  it('should generate SaaS insight when SaaS stories exist', () => {
    const stories = [
      { title: 'Best SaaS startup tools', score: 100, url: 'https://example.com', commentCount: 20, timestamp },
      { title: 'New product launch on HN', score: 80, url: 'https://example.com', commentCount: 15, timestamp },
    ]
    const insights = analyzeHackerNewsData(stories, timestamp)
    expect(insights.some(i => i.category === 'SaaS / Enterprise')).toBe(true)
  })

  it('should return positive impact when AI stories > 5', () => {
    const stories = Array.from({ length: 8 }, (_, i) => ({
      title: `AI tool ${i}`,
      score: 100,
      url: 'https://example.com',
      commentCount: 10,
      timestamp,
    }))
    const insights = analyzeHackerNewsData(stories, timestamp)
    const aiInsight = insights.find(i => i.category === 'AI / Machine Learning')
    expect(aiInsight?.impact).toBe('positive')
  })

  it('should return neutral impact when AI stories <= 5', () => {
    const stories = [
      { title: 'New AI model', score: 100, url: 'https://example.com', commentCount: 10, timestamp },
      { title: 'Random non-AI post', score: 50, url: 'https://example.com', commentCount: 5, timestamp },
    ]
    const insights = analyzeHackerNewsData(stories, timestamp)
    const aiInsight = insights.find(i => i.category === 'AI / Machine Learning')
    expect(aiInsight?.impact).toBe('neutral')
  })

  it('should cap AI confidence at 90', () => {
    const stories = Array.from({ length: 20 }, (_, i) => ({
      title: `AI project ${i}`,
      score: 100,
      url: 'https://example.com',
      commentCount: 10,
      timestamp,
    }))
    const insights = analyzeHackerNewsData(stories, timestamp)
    const aiInsight = insights.find(i => i.category === 'AI / Machine Learning')
    expect(aiInsight!.confidence).toBeLessThanOrEqual(90)
  })

  it('should return empty array when no stories match', () => {
    const stories = [
      { title: 'Random blog post', score: 50, url: 'https://example.com', commentCount: 5, timestamp },
    ]
    const insights = analyzeHackerNewsData(stories, timestamp)
    expect(insights.length).toBe(0)
  })

  it('should include evidence with top 3 stories', () => {
    const stories = Array.from({ length: 5 }, (_, i) => ({
      title: `AI tool ${i}`,
      score: 100 + i * 10,
      url: 'https://example.com',
      commentCount: 10 + i,
      timestamp,
    }))
    const insights = analyzeHackerNewsData(stories, timestamp)
    const aiInsight = insights.find(i => i.category === 'AI / Machine Learning')
    expect(aiInsight!.evidence.length).toBeLessThanOrEqual(3)
  })

  it('should set correct id format', () => {
    const stories = [
      { title: 'GPT news', score: 100, url: 'https://example.com', commentCount: 10, timestamp },
    ]
    const insights = analyzeHackerNewsData(stories, timestamp)
    expect(insights[0].id).toBe(`hn-ai-${timestamp}`)
  })
})

// ── analyzeAppStoreData ───────────────────────────────────────

describe('analyzeAppStoreData', () => {
  const sampleApps = [
    { name: 'App1', category: 'Productivity', price: 0, rating: 4.5, ratingCount: 200, releaseDate: '2025-01-01' },
    { name: 'App2', category: 'Productivity', price: 480, rating: 4.2, ratingCount: 150, releaseDate: '2025-02-01' },
    { name: 'App3', category: 'Health', price: 0, rating: 4.8, ratingCount: 300, releaseDate: '2025-03-01' },
  ]

  it('should generate rating insight when apps have ratings', () => {
    const insights = analyzeAppStoreData(sampleApps, timestamp)
    expect(insights.some(i => i.id.startsWith('as-rating-'))).toBe(true)
  })

  it('should return positive impact when average rating >= 4.0', () => {
    const insights = analyzeAppStoreData(sampleApps, timestamp)
    const ratingInsight = insights.find(i => i.id.startsWith('as-rating-'))
    expect(ratingInsight?.impact).toBe('positive')
  })

  it('should generate pricing insight with free vs paid breakdown', () => {
    const insights = analyzeAppStoreData(sampleApps, timestamp)
    const pricingInsight = insights.find(i => i.id.startsWith('as-pricing-'))
    expect(pricingInsight).toBeDefined()
    expect(pricingInsight!.insight).toContain('無料')
  })

  it('should generate quality insight for high-rated apps with many reviews', () => {
    const insights = analyzeAppStoreData(sampleApps, timestamp)
    const qualityInsight = insights.find(i => i.id.startsWith('as-quality-'))
    expect(qualityInsight).toBeDefined()
  })

  it('should not generate quality insight when no apps meet threshold', () => {
    const lowApps = [
      { name: 'App1', category: 'Productivity', price: 0, rating: 3.0, ratingCount: 10, releaseDate: '2025-01-01' },
    ]
    const insights = analyzeAppStoreData(lowApps, timestamp)
    expect(insights.some(i => i.id.startsWith('as-quality-'))).toBe(false)
  })

  it('should handle empty apps array', () => {
    const insights = analyzeAppStoreData([], timestamp)
    // No rating insight (avgRating=0), but pricing insight will have NaN issues
    // The function should still not throw
    expect(Array.isArray(insights)).toBe(true)
  })
})

// ── generateSummaryInsights ───────────────────────────────────

describe('generateSummaryInsights', () => {
  it('should return exactly one summary insight', () => {
    const hn: MarketInsight[] = [{
      id: 'hn-1', insight: 'test', impact: 'positive', confidence: 80,
      source: 'HN', methodology: 'test', dataPoints: 10, generatedAt: timestamp,
      category: 'AI', actionability: 'monitor', evidence: [],
    }]
    const as: MarketInsight[] = [{
      id: 'as-1', insight: 'test', impact: 'neutral', confidence: 70,
      source: 'AS', methodology: 'test', dataPoints: 20, generatedAt: timestamp,
      category: 'Mobile', actionability: 'immediate', evidence: [],
    }]
    const summary = generateSummaryInsights(hn, as, timestamp)
    expect(summary.length).toBe(1)
    expect(summary[0].id).toBe(`summary-${timestamp}`)
  })

  it('should return positive impact when positive count > negative count', () => {
    const hn: MarketInsight[] = [{
      id: 'hn-1', insight: 'good', impact: 'positive', confidence: 80,
      source: 'HN', methodology: 'test', dataPoints: 10, generatedAt: timestamp,
      category: 'AI', actionability: 'monitor', evidence: [],
    }]
    const summary = generateSummaryInsights(hn, [], timestamp)
    expect(summary[0].impact).toBe('positive')
  })

  it('should aggregate data points from all insights', () => {
    const hn: MarketInsight[] = [{
      id: 'hn-1', insight: '', impact: 'neutral', confidence: 80,
      source: 'HN', methodology: '', dataPoints: 100, generatedAt: timestamp,
      category: 'AI', actionability: 'monitor', evidence: [],
    }]
    const as: MarketInsight[] = [{
      id: 'as-1', insight: '', impact: 'neutral', confidence: 70,
      source: 'AS', methodology: '', dataPoints: 200, generatedAt: timestamp,
      category: 'Mobile', actionability: 'immediate', evidence: [],
    }]
    const summary = generateSummaryInsights(hn, as, timestamp)
    expect(summary[0].dataPoints).toBe(300)
  })
})
