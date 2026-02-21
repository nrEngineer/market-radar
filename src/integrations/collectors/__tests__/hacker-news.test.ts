import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

import { collectHackerNews } from '../hacker-news'

describe('collectHackerNews', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('should return success result with stories', async () => {
    mockFetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve([1, 2]),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve({
          id: 1, title: 'Show HN: Test', url: 'https://example.com',
          score: 50, by: 'user', time: 1700000000, descendants: 10,
        }),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve({
          id: 2, title: 'Ask HN: Question', url: 'https://ask.com',
          score: 30, by: 'user2', time: 1700000001, descendants: 5,
        }),
      })

    const result = await collectHackerNews()

    expect(result.source).toBe('hackernews')
    expect(result.status).toBe('success')
    expect(result.dataCount).toBe(2)
  })

  it('should filter stories without title or url', async () => {
    mockFetch
      .mockResolvedValueOnce({
        json: () => Promise.resolve([1, 2]),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ id: 1, title: 'Has title', url: 'https://example.com', score: 10 }),
      })
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ id: 2, title: 'No URL story' }),
      })

    const result = await collectHackerNews()

    expect(result.dataCount).toBe(1)
  })

  it('should limit to top 20 stories', async () => {
    const ids = Array.from({ length: 30 }, (_, i) => i + 1)
    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve(ids),
    })

    for (let i = 1; i <= 20; i++) {
      mockFetch.mockResolvedValueOnce({
        json: () => Promise.resolve({
          id: i, title: `Story ${i}`, url: `https://example.com/${i}`, score: i,
        }),
      })
    }

    const result = await collectHackerNews()
    // 1 call for top stories + 20 calls for items
    expect(mockFetch).toHaveBeenCalledTimes(21)
  })

  it('should return error on fetch failure', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'))

    const result = await collectHackerNews()

    expect(result.source).toBe('hackernews')
    expect(result.status).toBe('error')
    expect(result.dataCount).toBe(0)
    expect(result.error).toBe('Network error')
  })

  it('should map story fields correctly', async () => {
    mockFetch
      .mockResolvedValueOnce({ json: () => Promise.resolve([1]) })
      .mockResolvedValueOnce({
        json: () => Promise.resolve({
          id: 42, title: 'Test Story', url: 'https://test.com',
          score: 99, by: 'author1', time: 1700000000, descendants: 15,
        }),
      })

    const result = await collectHackerNews()
    const story = result.data?.[0] as Record<string, unknown>

    expect(story.id).toBe('hn_42')
    expect(story.title).toBe('Test Story')
    expect(story.url).toBe('https://test.com')
    expect(story.score).toBe(99)
    expect(story.author).toBe('author1')
    expect(story.commentCount).toBe(15)
  })

  it('should handle stories with missing optional fields', async () => {
    mockFetch
      .mockResolvedValueOnce({ json: () => Promise.resolve([1]) })
      .mockResolvedValueOnce({
        json: () => Promise.resolve({
          id: 1, title: 'Minimal', url: 'https://example.com',
        }),
      })

    const result = await collectHackerNews()
    const story = result.data?.[0] as Record<string, unknown>

    expect(story.score).toBe(0)
    expect(story.commentCount).toBe(0)
  })
})
