import { describe, it, expect } from 'vitest'
import { PRICING_PLANS } from '../pricing'

describe('PRICING_PLANS', () => {
  it('should export all 4 plans', () => {
    expect(Object.keys(PRICING_PLANS)).toEqual(['free', 'premium', 'professional', 'enterprise'])
  })

  it('should have free plan with price 0 and no stripe_price_id', () => {
    const free = PRICING_PLANS.free
    expect(free.price).toBe(0)
    expect(free.stripe_price_id).toBeUndefined()
    expect(free.features.length).toBeGreaterThan(0)
  })

  it('should have stripe_price_id for paid plans', () => {
    expect(PRICING_PLANS.premium.stripe_price_id).toBeDefined()
    expect(PRICING_PLANS.professional.stripe_price_id).toBeDefined()
    expect(PRICING_PLANS.enterprise.stripe_price_id).toBeDefined()
  })

  it('should have prices in ascending order', () => {
    const prices = Object.values(PRICING_PLANS).map(p => p.price)
    for (let i = 1; i < prices.length; i++) {
      expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1])
    }
  })

  it('should have valid limits for each plan', () => {
    for (const plan of Object.values(PRICING_PLANS)) {
      expect(plan.limits).toHaveProperty('analyses')
      expect(plan.limits).toHaveProperty('reports')
      expect(plan.limits).toHaveProperty('api_calls')
    }
  })
})
