import { describe, it, expect, vi, beforeEach } from 'vitest'
import type Stripe from 'stripe'

// Track mock calls
const mockUpsert = vi.fn().mockResolvedValue({ error: null })
const mockUpdate = vi.fn()
const mockEq = vi.fn().mockResolvedValue({ error: null })

vi.mock('@/server/db/client', () => ({
  supabaseAdmin: {
    from: () => ({
      upsert: (...args: unknown[]) => {
        mockUpsert(...args)
        return Promise.resolve({ error: null })
      },
      update: (...args: unknown[]) => {
        mockUpdate(...args)
        return {
          eq: (...eqArgs: unknown[]) => {
            mockEq(...eqArgs)
            return Promise.resolve({ error: null })
          },
        }
      },
    }),
  },
}))

import { activateSubscription, updateSubscription, cancelSubscription } from '../subscription-service'

describe('subscription-service', () => {
  beforeEach(() => {
    mockUpsert.mockClear()
    mockUpdate.mockClear()
    mockEq.mockClear()
  })

  describe('activateSubscription', () => {
    const mockSession = {
      id: 'cs_test_123',
      customer_email: 'user@example.com',
      subscription: 'sub_123',
      metadata: { plan: 'premium' },
    } as unknown as Stripe.Checkout.Session

    it('should upsert subscription with correct data', async () => {
      await activateSubscription(mockSession)
      expect(mockUpsert).toHaveBeenCalledOnce()
      const upsertData = mockUpsert.mock.calls[0][0]
      expect(upsertData.email).toBe('user@example.com')
      expect(upsertData.plan).toBe('premium')
      expect(upsertData.stripe_session_id).toBe('cs_test_123')
      expect(upsertData.status).toBe('active')
    })

    it('should handle subscription as string', async () => {
      await activateSubscription(mockSession)
      const upsertData = mockUpsert.mock.calls[0][0]
      expect(upsertData.stripe_subscription_id).toBe('sub_123')
    })

    it('should handle subscription as object with id', async () => {
      const sessionWithObj = {
        ...mockSession,
        subscription: { id: 'sub_456' },
      } as unknown as Stripe.Checkout.Session
      await activateSubscription(sessionWithObj)
      const upsertData = mockUpsert.mock.calls[0][0]
      expect(upsertData.stripe_subscription_id).toBe('sub_456')
    })

    it('should skip upsert when email is missing', async () => {
      const noEmail = { ...mockSession, customer_email: null } as unknown as Stripe.Checkout.Session
      await activateSubscription(noEmail)
      expect(mockUpsert).not.toHaveBeenCalled()
    })

    it('should skip upsert when plan is missing', async () => {
      const noPlan = { ...mockSession, metadata: {} } as unknown as Stripe.Checkout.Session
      await activateSubscription(noPlan)
      expect(mockUpsert).not.toHaveBeenCalled()
    })

    it('should include activated_at timestamp', async () => {
      await activateSubscription(mockSession)
      const upsertData = mockUpsert.mock.calls[0][0]
      expect(upsertData.activated_at).toBeDefined()
      expect(() => new Date(upsertData.activated_at)).not.toThrow()
    })
  })

  describe('updateSubscription', () => {
    const mockSub = {
      id: 'sub_123',
      status: 'active',
      metadata: { plan: 'professional' },
    } as unknown as Stripe.Subscription

    it('should update subscription with correct data', async () => {
      await updateSubscription(mockSub)
      expect(mockUpdate).toHaveBeenCalledOnce()
      const updateData = mockUpdate.mock.calls[0][0]
      expect(updateData.plan).toBe('professional')
      expect(updateData.status).toBe('active')
    })

    it('should filter by stripe_subscription_id', async () => {
      await updateSubscription(mockSub)
      expect(mockEq).toHaveBeenCalledWith('stripe_subscription_id', 'sub_123')
    })

    it('should include updated_at timestamp', async () => {
      await updateSubscription(mockSub)
      const updateData = mockUpdate.mock.calls[0][0]
      expect(updateData.updated_at).toBeDefined()
    })
  })

  describe('cancelSubscription', () => {
    const mockSub = {
      id: 'sub_cancel_123',
    } as unknown as Stripe.Subscription

    it('should set status to cancelled', async () => {
      await cancelSubscription(mockSub)
      expect(mockUpdate).toHaveBeenCalledOnce()
      const updateData = mockUpdate.mock.calls[0][0]
      expect(updateData.status).toBe('cancelled')
    })

    it('should filter by stripe_subscription_id', async () => {
      await cancelSubscription(mockSub)
      expect(mockEq).toHaveBeenCalledWith('stripe_subscription_id', 'sub_cancel_123')
    })

    it('should include cancelled_at timestamp', async () => {
      await cancelSubscription(mockSub)
      const updateData = mockUpdate.mock.calls[0][0]
      expect(updateData.cancelled_at).toBeDefined()
    })
  })
})
