import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

import { collectAppStore } from '../app-store'

describe('collectAppStore', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('should return success result with apps on valid response', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        resultCount: 1,
        results: [{
          trackId: 123,
          trackName: 'TestApp',
          artistName: 'Dev',
          primaryGenreName: 'Productivity',
          price: 0,
          averageUserRating: 4.5,
          userRatingCount: 100,
          description: 'test',
          releaseDate: '2026-01-01',
          trackViewUrl: 'https://apps.apple.com/123',
          artworkUrl100: 'https://example.com/icon.png',
        }],
      }),
    })

    const result = await collectAppStore()

    expect(result.source).toBe('appstore')
    expect(result.status).toBe('success')
    expect(result.dataCount).toBeGreaterThan(0)
    expect(result.timestamp).toBeDefined()
  })

  it('should fetch from 4 categories', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ resultCount: 0, results: [] }),
    })

    await collectAppStore()

    expect(mockFetch).toHaveBeenCalledTimes(4)
  })

  it('should return 0 count when API returns non-ok', async () => {
    mockFetch.mockResolvedValue({ ok: false })

    const result = await collectAppStore()

    expect(result.source).toBe('appstore')
    expect(result.status).toBe('success')
    expect(result.dataCount).toBe(0)
  })

  it('should return error result on fetch failure', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'))

    const result = await collectAppStore()

    expect(result.source).toBe('appstore')
    expect(result.status).toBe('error')
    expect(result.dataCount).toBe(0)
    expect(result.error).toBe('Network error')
  })

  it('should handle non-Error throws', async () => {
    mockFetch.mockRejectedValue('string error')

    const result = await collectAppStore()

    expect(result.status).toBe('error')
    expect(result.error).toBe('Unknown error')
  })

  it('should map app fields correctly', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        resultCount: 1,
        results: [{
          trackId: 456,
          trackName: 'MyApp',
          artistName: 'DevTeam',
          primaryGenreName: 'Business',
          price: 9.99,
          averageUserRating: 4.8,
          userRatingCount: 500,
          description: 'A business app',
          releaseDate: '2025-06-15',
          trackViewUrl: 'https://apps.apple.com/456',
          artworkUrl100: 'https://example.com/456.png',
        }],
      }),
    })

    const result = await collectAppStore()
    const app = result.data?.[0] as Record<string, unknown>

    expect(app).toBeDefined()
    expect(app.id).toBe('app_456')
    expect(app.name).toBe('MyApp')
    expect(app.category).toBe('Business')
    expect(app.price).toBe(9.99)
    expect(app.rating).toBe(4.8)
  })
})
