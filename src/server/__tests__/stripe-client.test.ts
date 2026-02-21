import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('stripe-client', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('should export null when STRIPE_SECRET_KEY is not set', async () => {
    vi.stubEnv('STRIPE_SECRET_KEY', '')
    const { stripe } = await import('../stripe-client')
    expect(stripe).toBeNull()
  })

  it('should export a Stripe instance when STRIPE_SECRET_KEY is set', async () => {
    vi.stubEnv('STRIPE_SECRET_KEY', 'sk_test_fake_key_for_testing')
    const { stripe } = await import('../stripe-client')
    expect(stripe).not.toBeNull()
    expect(stripe).toHaveProperty('checkout')
    expect(stripe).toHaveProperty('webhooks')
  })
})
