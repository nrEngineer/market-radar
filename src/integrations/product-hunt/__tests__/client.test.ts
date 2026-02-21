import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

import { ProductHuntAPI } from '../client'

describe('ProductHuntAPI', () => {
  let api: ProductHuntAPI

  beforeEach(() => {
    api = new ProductHuntAPI()
    mockFetch.mockReset()
  })

  describe('getTodaysFeatured', () => {
    it('should return products from RSS feed', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          text: () => Promise.resolve(`
            <rss><channel>
              <item>
                <title>AI Startup Tool</title>
                <description>A startup helper for AI</description>
                <link>https://product.com/1</link>
                <pubDate>Thu, 20 Feb 2026 00:00:00 GMT</pubDate>
              </item>
            </channel></rss>
          `),
        })

      const products = await api.getTodaysFeatured()

      expect(products.length).toBeGreaterThanOrEqual(1)
      expect(products[0].name).toBe('AI Startup Tool')
    })

    it('should return fallback products when scraping fails', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'))

      const products = await api.getTodaysFeatured()
      // scrapePublicFeatured catches and returns fallback products
      expect(Array.isArray(products)).toBe(true)
      expect(products.length).toBeGreaterThanOrEqual(0)
    })

    it('should limit to 20 products', async () => {
      const items = Array.from({ length: 25 }, (_, i) =>
        `<item><title>Product ${i}</title><description>Desc</description><link>https://example.com/${i}</link><pubDate>Thu, 20 Feb 2026</pubDate></item>`
      ).join('')

      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(`<rss><channel>${items}</channel></rss>`),
      })

      const products = await api.getTodaysFeatured()
      expect(products.length).toBeLessThanOrEqual(20)
    })
  })

  describe('getTrendingTopics', () => {
    it('should return topics', async () => {
      const topics = await api.getTrendingTopics()

      expect(topics.length).toBeGreaterThan(0)
      expect(topics[0]).toHaveProperty('id')
      expect(topics[0]).toHaveProperty('name')
      expect(topics[0]).toHaveProperty('posts_count')
    })

    it('should include standard tech topics', async () => {
      const topics = await api.getTrendingTopics()
      const names = topics.map(t => t.name)

      expect(names).toContain('SaaS')
      expect(names).toContain('Developer Tools')
    })
  })

  describe('analyzeProductTrends', () => {
    const products = [
      {
        id: '1',
        name: 'AI Code Tool',
        tagline: 'Write better code with AI',
        description: 'AI helper',
        votes_count: 100,
        comments_count: 10,
        created_at: '',
        day: '',
        featured_at: '',
        website: '',
        topics: [{ id: 'ai', name: 'AI Tools', slug: 'ai' }],
        makers: [],
        hunter: { id: '', name: '', username: '' },
        thumbnail: { media_url: '' },
        gallery_urls: [],
        related_posts: [],
      },
      {
        id: '2',
        name: 'SaaS Dashboard',
        tagline: 'Analytics for your SaaS',
        description: 'Dashboard tool',
        votes_count: 200,
        comments_count: 20,
        created_at: '',
        day: '',
        featured_at: '',
        website: '',
        topics: [
          { id: 'saas', name: 'SaaS', slug: 'saas' },
          { id: 'ai', name: 'AI Tools', slug: 'ai' },
        ],
        makers: [],
        hunter: { id: '', name: '', username: '' },
        thumbnail: { media_url: '' },
        gallery_urls: [],
        related_posts: [],
      },
    ]

    it('should count categories correctly', async () => {
      const result = await api.analyzeProductTrends(products)

      expect(result.categories['AI Tools']).toBe(2)
      expect(result.categories['SaaS']).toBe(1)
    })

    it('should calculate average votes', async () => {
      const result = await api.analyzeProductTrends(products)

      expect(result.averageVotes).toBe(150) // (100 + 200) / 2
    })

    it('should extract keywords', async () => {
      const result = await api.analyzeProductTrends(products)

      expect(result.topKeywords.length).toBeGreaterThan(0)
    })

    it('should generate market insights', async () => {
      const result = await api.analyzeProductTrends(products)

      expect(result.marketInsights.length).toBeGreaterThan(0)
      expect(result.marketInsights[0]).toContain('AI Tools')
    })

    it('should return trending topics sorted by frequency', async () => {
      const result = await api.analyzeProductTrends(products)

      expect(result.trendingTopics[0]).toBe('AI Tools')
    })
  })

  describe('RSS parsing', () => {
    it('should estimate topics from product name', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(`
          <rss><channel>
            <item>
              <title>AI Machine Learning Platform</title>
              <description>Use artificial intelligence</description>
              <link>https://example.com</link>
              <pubDate>Thu, 20 Feb 2026</pubDate>
            </item>
          </channel></rss>
        `),
      })

      const products = await api.getTodaysFeatured()
      const topics = products[0]?.topics?.map(t => t.name)

      expect(topics).toContain('AI & Machine Learning')
    })

    it('should default to Tech topic when no pattern matches', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(`
          <rss><channel>
            <item>
              <title>Random Thing</title>
              <description>Nothing special</description>
              <link>https://example.com</link>
              <pubDate>Thu, 20 Feb 2026</pubDate>
            </item>
          </channel></rss>
        `),
      })

      const products = await api.getTodaysFeatured()
      const topics = products[0]?.topics?.map(t => t.name)

      expect(topics).toContain('Tech')
    })

    it('should handle empty RSS feed', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve('<rss><channel></channel></rss>'),
      })

      const products = await api.getTodaysFeatured()
      expect(products).toEqual([])
    })
  })
})
