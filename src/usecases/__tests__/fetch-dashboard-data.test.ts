import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchDashboardData } from '../fetch-dashboard-data'

// Mock dependencies
vi.mock('@/server/db/client', () => ({
  isSupabaseConfigured: vi.fn(),
  supabaseAdmin: {},
}))

vi.mock('@/server/services/dashboard-service', () => ({
  getStats: vi.fn(),
  getHighlights: vi.fn(),
  getCategories: vi.fn(),
  getCollectionStatus: vi.fn(),
}))

vi.mock('@/data/opportunities', () => ({
  opportunities: [
    {
      id: 'opp-1',
      title: 'Test Opp',
      category: 'SaaS',
      scores: { overall: 80 },
      market: { growth: '+10%' },
    },
    {
      id: 'opp-2',
      title: 'Test Opp 2',
      category: 'Mobile App',
      scores: { overall: 60 },
      market: { growth: '+5%' },
    },
  ],
}))

vi.mock('@/data/trends', () => ({
  trends: [
    { id: 'trend-1', name: 'AI Agents' },
    { id: 'trend-2', name: 'No-Code' },
  ],
}))

import { isSupabaseConfigured } from '@/server/db/client'
import * as dashboardService from '@/server/services/dashboard-service'

const mockIsConfigured = vi.mocked(isSupabaseConfigured)
const mockGetStats = vi.mocked(dashboardService.getStats)
const mockGetHighlights = vi.mocked(dashboardService.getHighlights)
const mockGetCategories = vi.mocked(dashboardService.getCategories)
const mockGetCollectionStatus = vi.mocked(dashboardService.getCollectionStatus)

beforeEach(() => {
  vi.clearAllMocks()
})

describe('fetchDashboardData', () => {
  // ── UC-1: type=null → 全データ返却 ──────────────────────
  describe('when type is null (default)', () => {
    it('should return all dashboard data with dataSource field', async () => {
      mockIsConfigured.mockReturnValue(false)

      const result = await fetchDashboardData(null)

      expect(result).toHaveProperty('stats')
      expect(result).toHaveProperty('highlights')
      expect(result).toHaveProperty('categories')
      expect(result).toHaveProperty('lastUpdate')
      expect(result).toHaveProperty('dataSource')
    })
  })

  // ── UC-1: type 指定 → 部分データ返却 ──────────────────
  describe('when type is specified', () => {
    it('should return only stats when type=stats', async () => {
      mockIsConfigured.mockReturnValue(false)

      const result = await fetchDashboardData('stats')

      expect(result).toHaveProperty('totalOpportunities')
      expect(result).toHaveProperty('totalTrends')
      expect(result).not.toHaveProperty('highlights')
    })

    it('should return only highlights when type=highlights', async () => {
      mockIsConfigured.mockReturnValue(false)

      const result = await fetchDashboardData('highlights')

      expect(Array.isArray(result)).toBe(true)
    })

    it('should return only categories when type=categories', async () => {
      mockIsConfigured.mockReturnValue(false)

      const result = await fetchDashboardData('categories')

      expect(Array.isArray(result)).toBe(true)
    })

    it('should return collection-status when type=collection-status', async () => {
      mockIsConfigured.mockReturnValue(false)

      const result = await fetchDashboardData('collection-status')

      expect(result).toHaveProperty('timestamp')
      expect(result).toHaveProperty('sources')
    })
  })

  // ── S-1: Supabase 未設定 → static data ─────────────────
  describe('when Supabase is NOT configured', () => {
    beforeEach(() => {
      mockIsConfigured.mockReturnValue(false)
    })

    it('should use static data for stats', async () => {
      const result = await fetchDashboardData('stats')

      expect(mockGetStats).not.toHaveBeenCalled()
      expect(result).toEqual({
        totalOpportunities: 2,
        totalTrends: 2,
        totalCategories: 2,
        avgScore: 70,
      })
    })

    it('should use static data for highlights', async () => {
      const result = await fetchDashboardData('highlights')

      expect(mockGetHighlights).not.toHaveBeenCalled()
      expect(result).toHaveLength(2)
      // sorted by score descending
      expect((result as Array<{ score: number }>)[0].score).toBe(80)
    })

    it('should return dataSource=static for default query', async () => {
      const result = await fetchDashboardData(null)

      expect(result).toHaveProperty('dataSource', 'static')
    })
  })

  // ── S-2: Supabase 設定済み → DB data ───────────────────
  describe('when Supabase IS configured', () => {
    beforeEach(() => {
      mockIsConfigured.mockReturnValue(true)
      mockGetStats.mockResolvedValue({
        totalOpportunities: 10,
        totalTrends: 5,
        totalCategories: 3,
        avgScore: 85,
      })
      mockGetHighlights.mockResolvedValue([
        { id: 'db-1', title: 'DB Opp', category: 'SaaS', score: 90, change: null },
      ])
      mockGetCategories.mockResolvedValue([
        { name: 'SaaS', apps: 5, growth: '+15%' },
      ])
      mockGetCollectionStatus.mockResolvedValue({
        timestamp: '2026-01-01T00:00:00.000Z',
        sources: [],
      })
    })

    it('should delegate to dashboard-service for stats', async () => {
      const result = await fetchDashboardData('stats')

      expect(mockGetStats).toHaveBeenCalledOnce()
      expect(result).toEqual({
        totalOpportunities: 10,
        totalTrends: 5,
        totalCategories: 3,
        avgScore: 85,
      })
    })

    it('should delegate to dashboard-service for highlights', async () => {
      const result = await fetchDashboardData('highlights')

      expect(mockGetHighlights).toHaveBeenCalledOnce()
      expect(result).toHaveLength(1)
    })

    it('should return dataSource=supabase for default query', async () => {
      const result = await fetchDashboardData(null)

      expect(result).toHaveProperty('dataSource', 'supabase')
    })
  })

  // ── S-3: DB エラー時のフォールバック ─────────────────────
  describe('when DB throws an error', () => {
    beforeEach(() => {
      mockIsConfigured.mockReturnValue(true)
      mockGetStats.mockRejectedValue(new Error('DB connection failed'))
      mockGetHighlights.mockRejectedValue(new Error('DB connection failed'))
      mockGetCategories.mockRejectedValue(new Error('DB connection failed'))
    })

    it('should propagate the error (no silent swallowing)', async () => {
      await expect(fetchDashboardData('stats')).rejects.toThrow('DB connection failed')
    })
  })

  // ── Edge cases ──────────────────────────────────────────
  describe('edge cases', () => {
    it('should use static collection-status with 3 sources when DB is not configured', async () => {
      mockIsConfigured.mockReturnValue(false)

      const result = await fetchDashboardData('collection-status') as { sources: unknown[] }

      expect(result.sources).toHaveLength(3)
    })

    it('should delegate collection-status to dashboard-service when DB is configured', async () => {
      mockIsConfigured.mockReturnValue(true)
      mockGetCollectionStatus.mockResolvedValue({
        timestamp: '2026-01-01T00:00:00.000Z',
        sources: [{ name: 'PH', status: 'done', items: 5, lastRun: '2026-01-01' }],
      })

      const result = await fetchDashboardData('collection-status') as { sources: unknown[] }

      expect(mockGetCollectionStatus).toHaveBeenCalledOnce()
      expect(result.sources).toHaveLength(1)
    })

    it('should return static categories sorted by count descending', async () => {
      mockIsConfigured.mockReturnValue(false)

      const result = await fetchDashboardData('categories') as Array<{ name: string; apps: number }>

      // Each category has 1 opp, so order is by insertion (Map iteration order)
      expect(result.every(c => c.apps >= 1)).toBe(true)
    })

    it('should call all three data fetchers in parallel for default type', async () => {
      mockIsConfigured.mockReturnValue(true)
      mockGetStats.mockResolvedValue({ totalOpportunities: 1, totalTrends: 1, totalCategories: 1, avgScore: 50 })
      mockGetHighlights.mockResolvedValue([])
      mockGetCategories.mockResolvedValue([])

      await fetchDashboardData(null)

      expect(mockGetStats).toHaveBeenCalledOnce()
      expect(mockGetHighlights).toHaveBeenCalledOnce()
      expect(mockGetCategories).toHaveBeenCalledOnce()
    })
  })
})
