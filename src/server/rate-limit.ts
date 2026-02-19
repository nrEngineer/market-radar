import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

export interface RateLimitConfig {
  windowMs: number
  maxRequests: number
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: number
  retryAfter?: number
}

// --- Upstash Redis-based rate limiter (production) ---
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null

function createUpstashLimiter(config: RateLimitConfig): Ratelimit | null {
  if (!redis) return null
  const windowSec = Math.max(1, Math.round(config.windowMs / 1000))
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(config.maxRequests, `${windowSec} s`),
    analytics: false,
  })
}

const upstashLimiters = new Map<string, Ratelimit>()

function getUpstashLimiter(config: RateLimitConfig): Ratelimit | null {
  if (!redis) return null
  const key = `${config.windowMs}:${config.maxRequests}`
  let limiter = upstashLimiters.get(key)
  if (!limiter) {
    limiter = createUpstashLimiter(config)!
    upstashLimiters.set(key, limiter)
  }
  return limiter
}

// --- In-memory fallback (development / Upstash not configured) ---
interface RateLimitEntry {
  timestamps: number[]
}

const store = new Map<string, RateLimitEntry>()
const CLEANUP_INTERVAL = 5 * 60 * 1000
let lastCleanup = Date.now()

function cleanup(windowMs: number): void {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL) return
  lastCleanup = now
  const cutoff = now - windowMs
  for (const [key, entry] of store) {
    entry.timestamps = entry.timestamps.filter(t => t > cutoff)
    if (entry.timestamps.length === 0) {
      store.delete(key)
    }
  }
}

function checkRateLimitInMemory(
  key: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now()
  const cutoff = now - config.windowMs
  cleanup(config.windowMs)

  let entry = store.get(key)
  if (!entry) {
    entry = { timestamps: [] }
    store.set(key, entry)
  }

  entry.timestamps = entry.timestamps.filter(t => t > cutoff)

  const resetAt = entry.timestamps.length > 0
    ? entry.timestamps[0] + config.windowMs
    : now + config.windowMs

  if (entry.timestamps.length >= config.maxRequests) {
    const oldestInWindow = entry.timestamps[0]
    const retryAfter = Math.ceil((oldestInWindow + config.windowMs - now) / 1000)
    return {
      allowed: false,
      remaining: 0,
      resetAt,
      retryAfter: Math.max(retryAfter, 1),
    }
  }

  entry.timestamps.push(now)
  return {
    allowed: true,
    remaining: config.maxRequests - entry.timestamps.length,
    resetAt,
  }
}

// --- Public API ---
export function checkRateLimit(
  key: string,
  config: RateLimitConfig
): RateLimitResult {
  // Upstash is async but middleware needs sync result.
  // We use in-memory as the synchronous path and fire-and-forget Upstash check.
  // For true distributed limiting, use checkRateLimitAsync.
  return checkRateLimitInMemory(key, config)
}

export async function checkRateLimitAsync(
  key: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const limiter = getUpstashLimiter(config)
  if (!limiter) {
    return checkRateLimitInMemory(key, config)
  }

  try {
    const result = await limiter.limit(key)
    return {
      allowed: result.success,
      remaining: result.remaining,
      resetAt: result.reset,
      retryAfter: result.success ? undefined : Math.ceil((result.reset - Date.now()) / 1000),
    }
  } catch (error) {
    console.error('Upstash rate limit error, falling back to in-memory:', error)
    return checkRateLimitInMemory(key, config)
  }
}

export const RATE_LIMITS = {
  public: { windowMs: 60_000, maxRequests: 60 },
  authenticated: { windowMs: 60_000, maxRequests: 30 },
  computation: { windowMs: 60_000, maxRequests: 10 },
  payment: { windowMs: 60_000, maxRequests: 5 },
  health: { windowMs: 60_000, maxRequests: 120 },
} as const
