import { describe, it, expect, vi, beforeEach } from 'vitest'
import { checkHealth } from '../health-service'

// Mock dependencies
vi.mock('@/server/db/client', () => ({
  isSupabaseConfigured: vi.fn(),
  supabase: {
    from: vi.fn(),
  },
}))

vi.mock('@/server/discord-notify', () => ({
  notifyAPIHealth: vi.fn().mockResolvedValue(undefined),
}))

import { isSupabaseConfigured, supabase } from '@/server/db/client'
import { notifyAPIHealth } from '@/server/discord-notify'

const mockIsConfigured = vi.mocked(isSupabaseConfigured)
const mockSupabase = vi.mocked(supabase)
const mockNotifyHealth = vi.mocked(notifyAPIHealth)

beforeEach(() => {
  vi.clearAllMocks()
})

describe('checkHealth', () => {
  // ── UC-2: 正常系 ─────────────────────────────────────────
  describe('when everything is healthy', () => {
    it('should return healthy status with all checks ok', async () => {
      mockIsConfigured.mockReturnValue(true)
      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue({ error: null }),
        }),
      } as never)

      const result = await checkHealth()

      expect(result.status).toBe('healthy')
      expect(result.checks.database.status).toBe('ok')
      expect(result.checks.api.status).toBe('ok')
      expect(result.version).toBe('0.1.0')
      expect(result).toHaveProperty('timestamp')
      expect(result).toHaveProperty('responseTimeMs')
    })

    it('should NOT notify Discord when healthy', async () => {
      mockIsConfigured.mockReturnValue(true)
      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue({ error: null }),
        }),
      } as never)

      await checkHealth()

      expect(mockNotifyHealth).not.toHaveBeenCalled()
    })
  })

  // ── S-1: DB 未設定 ─────────────────────────────────────
  describe('when Supabase is not configured', () => {
    it('should return degraded with database not_configured', async () => {
      mockIsConfigured.mockReturnValue(false)

      const result = await checkHealth()

      expect(result.status).toBe('degraded')
      expect(result.checks.database.status).toBe('not_configured')
      expect(result.checks.database.latencyMs).toBe(0)
    })

    it('should notify Discord on degraded status', async () => {
      mockIsConfigured.mockReturnValue(false)

      await checkHealth()

      expect(mockNotifyHealth).toHaveBeenCalledOnce()
      expect(mockNotifyHealth).toHaveBeenCalledWith(
        expect.objectContaining({ healthy: false })
      )
    })
  })

  // ── S-2: DB エラー ─────────────────────────────────────
  describe('when database query fails', () => {
    it('should return degraded with database error', async () => {
      mockIsConfigured.mockReturnValue(true)
      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue({ error: new Error('connection refused') }),
        }),
      } as never)

      const result = await checkHealth()

      expect(result.status).toBe('degraded')
      expect(result.checks.database.status).toBe('error')
    })
  })

  // ── S-3: DB 例外スロー ──────────────────────────────────
  describe('when database throws exception', () => {
    it('should catch and return error status with latencyMs=-1', async () => {
      mockIsConfigured.mockReturnValue(true)
      mockSupabase.from.mockImplementation(() => {
        throw new Error('unexpected')
      })

      const result = await checkHealth()

      expect(result.status).toBe('degraded')
      expect(result.checks.database.status).toBe('error')
      expect(result.checks.database.latencyMs).toBe(-1)
    })
  })

  // ── レスポンスタイム計測 ──────────────────────────────────
  describe('response time measurement', () => {
    it('should include responseTimeMs >= 0', async () => {
      mockIsConfigured.mockReturnValue(false)

      const result = await checkHealth()

      expect(result.responseTimeMs).toBeGreaterThanOrEqual(0)
    })
  })
})
