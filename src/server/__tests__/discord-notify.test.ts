import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { notifyError, notifyAPIHealth } from '../discord-notify'

describe('discord-notify', () => {
  const mockFetch = vi.fn()
  const originalFetch = global.fetch

  beforeEach(() => {
    global.fetch = mockFetch as unknown as typeof fetch
    mockFetch.mockResolvedValue({ ok: true } as Response)
    vi.stubEnv('DISCORD_WEBHOOK_URL', 'https://discord.com/api/webhooks/test/token')
  })

  afterEach(() => {
    global.fetch = originalFetch
    vi.unstubAllEnvs()
    mockFetch.mockReset()
  })

  describe('notifyError', () => {
    it('should send error embed with Error object', async () => {
      await notifyError(new Error('test error'))
      expect(mockFetch).toHaveBeenCalledOnce()
      const body = JSON.parse(mockFetch.mock.calls[0][1].body)
      expect(body.embeds[0].title).toContain('Error')
      expect(body.embeds[0].description).toBe('test error')
    })

    it('should send error embed with string error', async () => {
      await notifyError('string error message')
      const body = JSON.parse(mockFetch.mock.calls[0][1].body)
      expect(body.embeds[0].description).toBe('string error message')
    })

    it('should include stack trace in fields when Error has stack', async () => {
      const err = new Error('with stack')
      await notifyError(err)
      const body = JSON.parse(mockFetch.mock.calls[0][1].body)
      const stackField = body.embeds[0].fields.find((f: { name: string }) => f.name === 'Stack Trace')
      expect(stackField).toBeDefined()
    })

    it('should include context fields when provided', async () => {
      await notifyError(new Error('test'), { endpoint: '/api/test', userId: 'user-1' })
      const body = JSON.parse(mockFetch.mock.calls[0][1].body)
      const endpointField = body.embeds[0].fields.find((f: { name: string }) => f.name === 'Endpoint')
      expect(endpointField.value).toBe('/api/test')
    })

    it('should support (endpoint, message) overload', async () => {
      await notifyError('free-analysis', 'Something went wrong')
      const body = JSON.parse(mockFetch.mock.calls[0][1].body)
      expect(body.embeds[0].description).toBe('Something went wrong')
      const endpointField = body.embeds[0].fields.find((f: { name: string }) => f.name === 'Endpoint')
      expect(endpointField.value).toBe('free-analysis')
    })
  })

  describe('notifyAPIHealth', () => {
    it('should send info severity for healthy status', async () => {
      await notifyAPIHealth({ healthy: true })
      const body = JSON.parse(mockFetch.mock.calls[0][1].body)
      expect(body.embeds[0].title).toContain('OK')
      expect(body.embeds[0].color).toBe(0x3b82f6)
    })

    it('should send warning severity for unhealthy status', async () => {
      await notifyAPIHealth({ healthy: false, details: 'DB down' })
      const body = JSON.parse(mockFetch.mock.calls[0][1].body)
      expect(body.embeds[0].title).toContain('FAILED')
      expect(body.embeds[0].color).toBe(0xf59e0b)
    })
  })

  describe('when DISCORD_WEBHOOK_URL is not set', () => {
    it('should skip sending without throwing', async () => {
      vi.stubEnv('DISCORD_WEBHOOK_URL', '')
      await notifyError(new Error('test'))
      expect(mockFetch).not.toHaveBeenCalled()
    })
  })

  describe('when fetch fails', () => {
    it('should not throw and log error gracefully', async () => {
      mockFetch.mockRejectedValue(new Error('network failure'))
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      await expect(notifyError(new Error('test'))).resolves.not.toThrow()

      consoleSpy.mockRestore()
    })
  })
})
