import { describe, it, expect } from 'vitest'
import {
  customResearchSchema,
  stripeCheckoutSchema,
  freeAnalysisParamsSchema,
  collectSourceSchema,
} from '../schemas'

describe('customResearchSchema', () => {
  it('should accept valid input with defaults', () => {
    const result = customResearchSchema.safeParse({ query: 'AI SaaS trends' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.type).toBe('market')
    }
  })

  it('should accept all valid types', () => {
    const types = ['market', 'competitor', 'trend', 'technology', 'opportunity', 'pricing', 'custom']
    for (const type of types) {
      const result = customResearchSchema.safeParse({ query: 'test', type })
      expect(result.success).toBe(true)
    }
  })

  it('should reject empty query', () => {
    const result = customResearchSchema.safeParse({ query: '' })
    expect(result.success).toBe(false)
  })

  it('should reject query longer than 500 chars', () => {
    const result = customResearchSchema.safeParse({ query: 'a'.repeat(501) })
    expect(result.success).toBe(false)
  })

  it('should accept query of exactly 500 chars', () => {
    const result = customResearchSchema.safeParse({ query: 'a'.repeat(500) })
    expect(result.success).toBe(true)
  })

  it('should reject invalid type', () => {
    const result = customResearchSchema.safeParse({ query: 'test', type: 'invalid' })
    expect(result.success).toBe(false)
  })

  it('should accept valid datetime timestamp', () => {
    const result = customResearchSchema.safeParse({
      query: 'test',
      timestamp: '2026-02-20T12:00:00Z',
    })
    expect(result.success).toBe(true)
  })
})

describe('stripeCheckoutSchema', () => {
  it('should accept valid plan', () => {
    const result = stripeCheckoutSchema.safeParse({ plan: 'premium' })
    expect(result.success).toBe(true)
  })

  it('should accept all valid plans', () => {
    for (const plan of ['premium', 'professional', 'enterprise']) {
      const result = stripeCheckoutSchema.safeParse({ plan })
      expect(result.success).toBe(true)
    }
  })

  it('should reject free plan (not a checkout plan)', () => {
    const result = stripeCheckoutSchema.safeParse({ plan: 'free' })
    expect(result.success).toBe(false)
  })

  it('should accept optional URLs', () => {
    const result = stripeCheckoutSchema.safeParse({
      plan: 'premium',
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
    })
    expect(result.success).toBe(true)
  })

  it('should reject invalid URL format', () => {
    const result = stripeCheckoutSchema.safeParse({
      plan: 'premium',
      success_url: 'not-a-url',
    })
    expect(result.success).toBe(false)
  })

  it('should accept optional email', () => {
    const result = stripeCheckoutSchema.safeParse({
      plan: 'premium',
      customer_email: 'user@example.com',
    })
    expect(result.success).toBe(true)
  })

  it('should reject invalid email', () => {
    const result = stripeCheckoutSchema.safeParse({
      plan: 'premium',
      customer_email: 'invalid-email',
    })
    expect(result.success).toBe(false)
  })
})

describe('freeAnalysisParamsSchema', () => {
  it('should use defaults when no params given', () => {
    const result = freeAnalysisParamsSchema.safeParse({})
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.type).toBe('comprehensive')
      expect(result.data.timeframe).toBe('30d')
    }
  })

  it('should accept all valid types', () => {
    const types = ['market-overview', 'trend-analysis', 'competitor-scan', 'opportunity-finder', 'risk-assessment', 'comprehensive']
    for (const type of types) {
      const result = freeAnalysisParamsSchema.safeParse({ type })
      expect(result.success).toBe(true)
    }
  })

  it('should accept all valid timeframes', () => {
    for (const timeframe of ['7d', '30d', '90d', '1y']) {
      const result = freeAnalysisParamsSchema.safeParse({ timeframe })
      expect(result.success).toBe(true)
    }
  })

  it('should reject invalid type', () => {
    const result = freeAnalysisParamsSchema.safeParse({ type: 'invalid' })
    expect(result.success).toBe(false)
  })
})

describe('collectSourceSchema', () => {
  it('should default to all', () => {
    const result = collectSourceSchema.safeParse({})
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.source).toBe('all')
    }
  })

  it('should accept all valid sources', () => {
    const sources = ['github', 'hackernews', 'reddit', 'appstore', 'producthunt', 'all']
    for (const source of sources) {
      const result = collectSourceSchema.safeParse({ source })
      expect(result.success).toBe(true)
    }
  })

  it('should reject invalid source', () => {
    const result = collectSourceSchema.safeParse({ source: 'twitter' })
    expect(result.success).toBe(false)
  })
})
