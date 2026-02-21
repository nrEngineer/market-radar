import { describe, it, expect } from 'vitest'
import { iTunesAppSchema, iTunesSearchResponseSchema } from '../itunes'
import { hnItemSchema, hnTopStoriesSchema } from '../hackernews'
import { githubRepoSchema, githubSearchResponseSchema } from '../github'

describe('iTunesAppSchema', () => {
  const validApp = {
    trackId: 123,
    trackName: 'TestApp',
    primaryGenreName: 'Productivity',
    price: 0,
    releaseDate: '2026-01-01',
  }

  it('should accept valid app data', () => {
    expect(iTunesAppSchema.safeParse(validApp).success).toBe(true)
  })

  it('should accept optional fields', () => {
    const full = {
      ...validApp,
      bundleId: 'com.test.app',
      averageUserRating: 4.5,
      userRatingCount: 1000,
      description: 'A test app',
      artworkUrl100: 'https://example.com/icon.png',
      currentVersionReleaseDate: '2026-02-01',
    }
    const result = iTunesAppSchema.safeParse(full)
    expect(result.success).toBe(true)
  })

  it('should reject missing trackId', () => {
    const { trackId: _, ...noId } = validApp
    expect(iTunesAppSchema.safeParse(noId).success).toBe(false)
  })

  it('should reject non-number trackId', () => {
    expect(iTunesAppSchema.safeParse({ ...validApp, trackId: 'abc' }).success).toBe(false)
  })

  it('should reject missing trackName', () => {
    const { trackName: _, ...noName } = validApp
    expect(iTunesAppSchema.safeParse(noName).success).toBe(false)
  })
})

describe('iTunesSearchResponseSchema', () => {
  it('should accept valid response', () => {
    const result = iTunesSearchResponseSchema.safeParse({
      resultCount: 1,
      results: [{ trackId: 1, trackName: 'App', primaryGenreName: 'Util', price: 0, releaseDate: '2026-01-01' }],
    })
    expect(result.success).toBe(true)
  })

  it('should accept empty results', () => {
    const result = iTunesSearchResponseSchema.safeParse({ resultCount: 0, results: [] })
    expect(result.success).toBe(true)
  })

  it('should reject missing resultCount', () => {
    expect(iTunesSearchResponseSchema.safeParse({ results: [] }).success).toBe(false)
  })
})

describe('hnItemSchema', () => {
  it('should accept valid HN item', () => {
    const result = hnItemSchema.safeParse({
      id: 12345,
      type: 'story',
      title: 'Show HN: My Project',
      url: 'https://example.com',
      score: 100,
      by: 'user123',
      time: 1700000000,
      descendants: 50,
    })
    expect(result.success).toBe(true)
  })

  it('should accept minimal item (only id)', () => {
    const result = hnItemSchema.safeParse({ id: 1 })
    expect(result.success).toBe(true)
  })

  it('should reject missing id', () => {
    expect(hnItemSchema.safeParse({ title: 'No id' }).success).toBe(false)
  })

  it('should accept all valid types', () => {
    for (const type of ['story', 'comment', 'job', 'poll', 'pollopt']) {
      expect(hnItemSchema.safeParse({ id: 1, type }).success).toBe(true)
    }
  })

  it('should reject invalid type', () => {
    expect(hnItemSchema.safeParse({ id: 1, type: 'invalid' }).success).toBe(false)
  })

  it('should accept optional kids array', () => {
    const result = hnItemSchema.safeParse({ id: 1, kids: [2, 3, 4] })
    expect(result.success).toBe(true)
  })
})

describe('hnTopStoriesSchema', () => {
  it('should accept array of numbers', () => {
    expect(hnTopStoriesSchema.safeParse([1, 2, 3]).success).toBe(true)
  })

  it('should accept empty array', () => {
    expect(hnTopStoriesSchema.safeParse([]).success).toBe(true)
  })

  it('should reject array with strings', () => {
    expect(hnTopStoriesSchema.safeParse(['a', 'b']).success).toBe(false)
  })
})

describe('githubRepoSchema', () => {
  const validRepo = {
    id: 1,
    name: 'test-repo',
    full_name: 'user/test-repo',
    description: 'A test repo',
    stargazers_count: 100,
    language: 'TypeScript',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-02-01T00:00:00Z',
  }

  it('should accept valid repo', () => {
    expect(githubRepoSchema.safeParse(validRepo).success).toBe(true)
  })

  it('should accept null description', () => {
    const result = githubRepoSchema.safeParse({ ...validRepo, description: null })
    expect(result.success).toBe(true)
  })

  it('should accept null language', () => {
    const result = githubRepoSchema.safeParse({ ...validRepo, language: null })
    expect(result.success).toBe(true)
  })

  it('should accept optional topics', () => {
    const result = githubRepoSchema.safeParse({ ...validRepo, topics: ['ai', 'saas'] })
    expect(result.success).toBe(true)
  })

  it('should reject missing name', () => {
    const { name: _, ...noName } = validRepo
    expect(githubRepoSchema.safeParse(noName).success).toBe(false)
  })
})

describe('githubSearchResponseSchema', () => {
  it('should accept valid search response', () => {
    const result = githubSearchResponseSchema.safeParse({
      total_count: 1,
      incomplete_results: false,
      items: [{
        id: 1, name: 'r', full_name: 'u/r', description: null, stargazers_count: 5,
        language: null, created_at: '2026-01-01', updated_at: '2026-01-01',
      }],
    })
    expect(result.success).toBe(true)
  })

  it('should accept empty items', () => {
    const result = githubSearchResponseSchema.safeParse({
      total_count: 0, incomplete_results: false, items: [],
    })
    expect(result.success).toBe(true)
  })
})
