import { describe, it, expect } from 'vitest'
import { transformProductHuntData, getFallbackData } from '../transformer'

const mockProducts = [
  {
    id: 'p1',
    name: 'Product A',
    tagline: 'Do things',
    description: 'A great product',
    votes_count: 100,
    comments_count: 10,
    featured_at: '2026-01-01',
    website: 'https://producta.com',
    topics: [{ name: 'SaaS' }, { name: 'AI' }],
    makers: [{ name: 'Alice' }],
    hunter: { name: 'Bob' },
    thumbnail: { media_url: 'https://example.com/thumb.png' },
  },
  {
    id: 'p2',
    name: 'Product B',
    tagline: 'Other things',
    description: 'Another product',
    votes_count: 50,
    comments_count: 5,
    featured_at: '2026-01-02',
    website: 'https://productb.com',
    topics: [],
    makers: [],
    hunter: { name: 'Carol' },
    thumbnail: { media_url: 'https://example.com/thumb2.png' },
  },
]

const mockTopics = [
  { id: 't1', name: 'SaaS', description: 'Software', posts_count: 100, followers_count: 5000 },
]

const mockAnalysis = {
  categories: { SaaS: 2 },
  topKeywords: ['saas', 'ai'],
  averageVotes: 75.4,
  trendingTopics: ['SaaS'],
  marketInsights: ['SaaS is hot'],
}

describe('transformProductHuntData', () => {
  it('should transform products correctly', () => {
    const result = transformProductHuntData(mockProducts, mockTopics, mockAnalysis)

    expect(result.products).toHaveLength(2)
    expect(result.products[0].id).toBe('p1')
    expect(result.products[0].name).toBe('Product A')
    expect(result.products[0].votes).toBe(100)
    expect(result.products[0].topics).toEqual(['SaaS', 'AI'])
    expect(result.products[0].maker).toBe('Alice')
    expect(result.products[0].hunter).toBe('Bob')
  })

  it('should default maker to Unknown when no makers', () => {
    const result = transformProductHuntData(mockProducts, mockTopics, mockAnalysis)

    expect(result.products[1].maker).toBe('Unknown')
  })

  it('should transform topics correctly', () => {
    const result = transformProductHuntData(mockProducts, mockTopics, mockAnalysis)

    expect(result.topics).toHaveLength(1)
    expect(result.topics[0].postsCount).toBe(100)
    expect(result.topics[0].followersCount).toBe(5000)
  })

  it('should round averageVotes in analysis', () => {
    const result = transformProductHuntData(mockProducts, mockTopics, mockAnalysis)

    expect(result.analysis.averageVotes).toBe(75)
  })

  it('should set totalProducts from products array length', () => {
    const result = transformProductHuntData(mockProducts, mockTopics, mockAnalysis)

    expect(result.analysis.totalProducts).toBe(2)
  })

  it('should include metadata', () => {
    const result = transformProductHuntData(mockProducts, mockTopics, mockAnalysis)

    expect(result.metadata.source).toBe('Product Hunt')
    expect(result.metadata.cost).toContain('¥0')
    expect(result.metadata.freshness).toBe('Real-time')
    expect(result.metadata.timestamp).toBeDefined()
  })

  it('should not set fallback flag', () => {
    const result = transformProductHuntData(mockProducts, mockTopics, mockAnalysis)

    expect(result.fallback).toBeUndefined()
  })
})

describe('getFallbackData', () => {
  it('should return data with fallback flag', () => {
    const result = getFallbackData()

    expect(result.fallback).toBe(true)
  })

  it('should have products array', () => {
    const result = getFallbackData()

    expect(Array.isArray(result.products)).toBe(true)
    expect(result.products.length).toBeGreaterThan(0)
  })

  it('should have topics array', () => {
    const result = getFallbackData()

    expect(Array.isArray(result.topics)).toBe(true)
  })

  it('should indicate fallback in metadata source', () => {
    const result = getFallbackData()

    expect(result.metadata.source).toContain('Fallback')
    expect(result.metadata.freshness).toBe('Demo Data')
  })
})
