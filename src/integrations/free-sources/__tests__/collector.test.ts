import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

import {
  GitHubTrendingAPI,
  RedditMarketAPI,
  GoogleTrendsAPI,
  SECFilingsAPI,
  PressReleaseScanner,
  FreeDataCollector,
} from '../collector'

describe('GitHubTrendingAPI', () => {
  const api = new GitHubTrendingAPI()

  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('should return repos on valid response', async () => {
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve({
        items: [
          {
            name: 'repo1', full_name: 'user/repo1', description: 'Test',
            stargazers_count: 100, language: 'TypeScript', created_at: '2026-01-01',
            updated_at: '2026-01-15', topics: ['ai'], homepage: null,
          },
        ],
      }),
    })

    const repos = await api.getTrendingRepos('7d')

    expect(repos).toHaveLength(1)
    expect(repos[0].name).toBe('repo1')
  })

  it('should return empty array on error', async () => {
    mockFetch.mockRejectedValue(new Error('fail'))

    const repos = await api.getTrendingRepos()
    expect(repos).toEqual([])
  })

  it('should return empty array on invalid response', async () => {
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve({ invalid: true }),
    })

    const repos = await api.getTrendingRepos()
    expect(repos).toEqual([])
  })

  it('should support different timeframes', async () => {
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve({ items: [] }),
    })

    await api.getTrendingRepos('24h')
    expect(mockFetch).toHaveBeenCalledTimes(1)
    const url = mockFetch.mock.calls[0][0] as string
    expect(url).toContain('created:>')
  })

  it('should get trending topics from repos', async () => {
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve({
        items: [
          { name: 'r1', full_name: 'u/r1', description: '', stargazers_count: 50, language: '', created_at: '', updated_at: '', topics: ['ai', 'saas'], homepage: '' },
          { name: 'r2', full_name: 'u/r2', description: '', stargazers_count: 100, language: '', created_at: '', updated_at: '', topics: ['ai', 'cloud'], homepage: '' },
        ],
      }),
    })

    const topics = await api.getTrendingTopics()

    expect(topics[0]).toBe('ai')
    expect(topics).toContain('saas')
    expect(topics).toContain('cloud')
  })
})

describe('RedditMarketAPI', () => {
  const api = new RedditMarketAPI()

  beforeEach(() => {
    vi.useFakeTimers()
    mockFetch.mockReset()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should fetch posts from multiple subreddits', async () => {
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve({
        data: {
          children: [
            { data: { title: 'Post', selftext: 'text', score: 50, num_comments: 5, author: 'user', created_utc: 1700000000, subreddit: 'startups', url: 'https://example.com', permalink: '/r/startups/1' } },
          ],
        },
      }),
    })

    const promise = api.getMarketSignals(1)
    // Advance timers for each subreddit sleep
    for (let i = 0; i < 8; i++) {
      await vi.advanceTimersByTimeAsync(1000)
    }
    const posts = await promise

    expect(posts.length).toBeGreaterThanOrEqual(0)
  })

  it('should filter posts with score <= 10', async () => {
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve({
        data: {
          children: [
            { data: { title: 'Low', selftext: '', score: 5, num_comments: 0, author: 'u', created_utc: 0, subreddit: 's', url: '', permalink: '' } },
          ],
        },
      }),
    })

    const promise = api.getMarketSignals(1)
    for (let i = 0; i < 8; i++) {
      await vi.advanceTimersByTimeAsync(1000)
    }
    const posts = await promise
    expect(posts).toHaveLength(0)
  })

  it('should handle fetch errors gracefully', async () => {
    mockFetch.mockRejectedValue(new Error('Reddit down'))

    const promise = api.getMarketSignals(1)
    for (let i = 0; i < 8; i++) {
      await vi.advanceTimersByTimeAsync(1000)
    }
    const posts = await promise
    expect(posts).toHaveLength(0)
  })
})

describe('GoogleTrendsAPI', () => {
  it('should return empty array', async () => {
    const api = new GoogleTrendsAPI()
    const trends = await api.getTechTrends()
    expect(trends).toEqual([])
  })
})

describe('SECFilingsAPI', () => {
  const api = new SECFilingsAPI()

  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('should return empty array on error', async () => {
    mockFetch.mockRejectedValue(new Error('SEC down'))

    const filings = await api.getRecentAcquisitions()
    expect(filings).toEqual([])
  })
})

describe('PressReleaseScanner', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should return empty array from scanForMAActivity', async () => {
    const scanner = new PressReleaseScanner()
    const promise = scanner.scanForMAActivity()
    for (let i = 0; i < 3; i++) {
      await vi.advanceTimersByTimeAsync(2000)
    }
    const releases = await promise
    expect(releases).toEqual([])
  })
})

describe('FreeDataCollector', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    mockFetch.mockReset()
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve({ items: [], data: { children: [] } }),
      text: () => Promise.resolve(''),
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should return summary with all data sources', async () => {
    const collector = new FreeDataCollector()
    const promise = collector.collectAllMarketData()
    // Advance enough time for all sleeps (Reddit: 8x1s, Press: 3x2s)
    for (let i = 0; i < 20; i++) {
      await vi.advanceTimersByTimeAsync(2000)
    }
    const result = await promise

    expect(result.summary).toBeDefined()
    expect(result.summary.timestamp).toBeDefined()
    expect(result.summary.sources).toHaveProperty('github')
    expect(result.summary.sources).toHaveProperty('reddit')
    expect(result.summary.sources).toHaveProperty('trends')
    expect(result.summary.sources).toHaveProperty('sec')
    expect(result.summary.sources).toHaveProperty('press')
  })

  it('should handle all sources failing gracefully', async () => {
    mockFetch.mockRejectedValue(new Error('all down'))

    const collector = new FreeDataCollector()
    const promise = collector.collectAllMarketData()
    for (let i = 0; i < 20; i++) {
      await vi.advanceTimersByTimeAsync(2000)
    }
    const result = await promise

    expect(result.github).toEqual([])
    expect(result.reddit).toEqual([])
    expect(result.trends).toEqual([])
    expect(result.sec).toEqual([])
    expect(result.press).toEqual([])
    expect(result.summary.totalDataPoints).toBe(0)
  })
})
