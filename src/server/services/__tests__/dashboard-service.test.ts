import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock supabase client before importing the service
const mockSelect = vi.fn()
const mockOrder = vi.fn()
const mockLimit = vi.fn()
const mockFrom = vi.fn()

vi.mock('@/server/db/client', () => ({
  supabaseAdmin: {
    from: (table: string) => {
      mockFrom(table)
      return {
        select: (...args: unknown[]) => {
          mockSelect(...args)
          return {
            limit: (n: number) => {
              mockLimit(n)
              return Promise.resolve({ data: [], count: 0, error: null })
            },
            order: (...orderArgs: unknown[]) => {
              mockOrder(...orderArgs)
              return {
                limit: (n: number) => {
                  mockLimit(n)
                  return Promise.resolve({ data: [], error: null })
                },
              }
            },
          }
        },
      }
    },
  },
  isSupabaseConfigured: () => true,
}))

import { getStats, getHighlights, getCategories, getCollectionStatus, getDashboardData, isDatabaseConfigured } from '../dashboard-service'

describe('dashboard-service', () => {
  beforeEach(() => {
    mockFrom.mockClear()
    mockSelect.mockClear()
    mockOrder.mockClear()
    mockLimit.mockClear()
  })

  describe('isDatabaseConfigured', () => {
    it('should return true when supabase is configured', () => {
      expect(isDatabaseConfigured()).toBe(true)
    })
  })

  describe('getStats', () => {
    it('should return stats object with correct shape', async () => {
      const result = await getStats()
      expect(result).toHaveProperty('totalOpportunities')
      expect(result).toHaveProperty('totalTrends')
      expect(result).toHaveProperty('totalCategories')
      expect(result).toHaveProperty('avgScore')
    })

    it('should return zero counts when no data', async () => {
      const result = await getStats()
      expect(result.totalOpportunities).toBe(0)
      expect(result.totalTrends).toBe(0)
      expect(result.totalCategories).toBe(0)
      expect(result.avgScore).toBe(0)
    })

    it('should query three tables', async () => {
      await getStats()
      expect(mockFrom).toHaveBeenCalledWith('opportunities')
      expect(mockFrom).toHaveBeenCalledWith('trends')
      expect(mockFrom).toHaveBeenCalledWith('categories')
    })

    it('should apply limit of 200 to queries', async () => {
      await getStats()
      expect(mockLimit).toHaveBeenCalledWith(200)
    })
  })

  describe('getHighlights', () => {
    it('should return an array', async () => {
      const result = await getHighlights()
      expect(Array.isArray(result)).toBe(true)
    })

    it('should query opportunities table', async () => {
      await getHighlights()
      expect(mockFrom).toHaveBeenCalledWith('opportunities')
    })

    it('should limit to 5 results', async () => {
      await getHighlights()
      expect(mockLimit).toHaveBeenCalledWith(5)
    })
  })

  describe('getCategories', () => {
    it('should return an array', async () => {
      const result = await getCategories()
      expect(Array.isArray(result)).toBe(true)
    })

    it('should query categories table', async () => {
      await getCategories()
      expect(mockFrom).toHaveBeenCalledWith('categories')
    })

    it('should limit to 6 results', async () => {
      await getCategories()
      expect(mockLimit).toHaveBeenCalledWith(6)
    })
  })

  describe('getCollectionStatus', () => {
    it('should return object with timestamp and sources', async () => {
      const result = await getCollectionStatus()
      expect(result).toHaveProperty('timestamp')
      expect(result).toHaveProperty('sources')
      expect(Array.isArray(result.sources)).toBe(true)
    })

    it('should query collection_logs table', async () => {
      await getCollectionStatus()
      expect(mockFrom).toHaveBeenCalledWith('collection_logs')
    })
  })

  describe('getDashboardData', () => {
    it('should aggregate all data sources', async () => {
      const result = await getDashboardData()
      expect(result).toHaveProperty('lastUpdate')
      expect(result).toHaveProperty('stats')
      expect(result).toHaveProperty('highlights')
      expect(result).toHaveProperty('categories')
      expect(result).toHaveProperty('recentCollection')
    })

    it('should have ISO timestamp in lastUpdate', async () => {
      const result = await getDashboardData()
      expect(() => new Date(result.lastUpdate)).not.toThrow()
      expect(new Date(result.lastUpdate).toISOString()).toBe(result.lastUpdate)
    })
  })
})
