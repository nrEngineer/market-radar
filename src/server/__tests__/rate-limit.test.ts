import { describe, it, expect, beforeEach } from 'vitest'
import { checkRateLimit, checkRateLimitAsync, RATE_LIMITS, type RateLimitConfig } from '../rate-limit'

const config: RateLimitConfig = {
  windowMs: 60_000,
  maxRequests: 3,
}

// checkRateLimit uses the in-memory path (Upstash env vars are not set in test)
describe('checkRateLimit (in-memory)', () => {
  beforeEach(() => {
    // Use unique keys per test to avoid cross-test pollution
  })

  it('should allow requests within limit', () => {
    const key = `test-allow-${Date.now()}`
    const result = checkRateLimit(key, config)
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(2)
  })

  it('should decrement remaining on each request', () => {
    const key = `test-decrement-${Date.now()}`
    const r1 = checkRateLimit(key, config)
    expect(r1.remaining).toBe(2)

    const r2 = checkRateLimit(key, config)
    expect(r2.remaining).toBe(1)

    const r3 = checkRateLimit(key, config)
    expect(r3.remaining).toBe(0)
  })

  it('should reject requests exceeding limit', () => {
    const key = `test-reject-${Date.now()}`
    checkRateLimit(key, config)
    checkRateLimit(key, config)
    checkRateLimit(key, config)

    const result = checkRateLimit(key, config)
    expect(result.allowed).toBe(false)
    expect(result.remaining).toBe(0)
  })

  it('should provide retryAfter when rejected', () => {
    const key = `test-retry-${Date.now()}`
    checkRateLimit(key, config)
    checkRateLimit(key, config)
    checkRateLimit(key, config)

    const result = checkRateLimit(key, config)
    expect(result.retryAfter).toBeDefined()
    expect(result.retryAfter).toBeGreaterThan(0)
  })

  it('should have resetAt timestamp in the future', () => {
    const key = `test-reset-${Date.now()}`
    const result = checkRateLimit(key, config)
    expect(result.resetAt).toBeGreaterThan(Date.now() - 1000)
  })

  it('should track different keys independently', () => {
    const key1 = `test-independent-a-${Date.now()}`
    const key2 = `test-independent-b-${Date.now()}`

    checkRateLimit(key1, config)
    checkRateLimit(key1, config)
    checkRateLimit(key1, config)

    const resultKey1 = checkRateLimit(key1, config)
    const resultKey2 = checkRateLimit(key2, config)

    expect(resultKey1.allowed).toBe(false)
    expect(resultKey2.allowed).toBe(true)
  })

  it('should respect different configs per key', () => {
    const key = `test-config-${Date.now()}`
    const strictConfig: RateLimitConfig = { windowMs: 60_000, maxRequests: 1 }

    const r1 = checkRateLimit(key, strictConfig)
    expect(r1.allowed).toBe(true)

    const r2 = checkRateLimit(key, strictConfig)
    expect(r2.allowed).toBe(false)
  })

  it('should handle high maxRequests config', () => {
    const key = `test-high-${Date.now()}`
    const highConfig: RateLimitConfig = { windowMs: 60_000, maxRequests: 1000 }

    const result = checkRateLimit(key, highConfig)
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(999)
  })
})

describe('checkRateLimitAsync (fallback to in-memory)', () => {
  // Upstash env vars are not set in test, so it falls back to in-memory
  it('should fall back to in-memory when Upstash is not configured', async () => {
    const key = `test-async-fallback-${Date.now()}`
    const result = await checkRateLimitAsync(key, config)

    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(2)
  })

  it('should enforce limits via async path', async () => {
    const key = `test-async-limit-${Date.now()}`
    await checkRateLimitAsync(key, config)
    await checkRateLimitAsync(key, config)
    await checkRateLimitAsync(key, config)

    const result = await checkRateLimitAsync(key, config)
    expect(result.allowed).toBe(false)
    expect(result.remaining).toBe(0)
    expect(result.retryAfter).toBeGreaterThan(0)
  })
})

describe('RATE_LIMITS presets', () => {
  it('should export all rate limit tiers', () => {
    expect(RATE_LIMITS.public).toEqual({ windowMs: 60_000, maxRequests: 60 })
    expect(RATE_LIMITS.authenticated).toEqual({ windowMs: 60_000, maxRequests: 30 })
    expect(RATE_LIMITS.computation).toEqual({ windowMs: 60_000, maxRequests: 10 })
    expect(RATE_LIMITS.payment).toEqual({ windowMs: 60_000, maxRequests: 5 })
    expect(RATE_LIMITS.health).toEqual({ windowMs: 60_000, maxRequests: 120 })
  })
})
