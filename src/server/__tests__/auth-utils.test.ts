import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { timingSafeCompare, validateCronToken } from '../auth-utils'

describe('timingSafeCompare', () => {
  it('should return true for identical strings', () => {
    expect(timingSafeCompare('secret-token', 'secret-token')).toBe(true)
  })

  it('should return false for different strings', () => {
    expect(timingSafeCompare('secret-a', 'secret-b')).toBe(false)
  })

  it('should return false for different length strings', () => {
    expect(timingSafeCompare('short', 'a-much-longer-string')).toBe(false)
  })

  it('should return true for empty strings', () => {
    expect(timingSafeCompare('', '')).toBe(true)
  })

  it('should handle unicode characters', () => {
    expect(timingSafeCompare('テスト', 'テスト')).toBe(true)
    expect(timingSafeCompare('テスト', 'テスタ')).toBe(false)
  })
})

describe('validateCronToken', () => {
  beforeEach(() => {
    vi.stubEnv('CRON_SECRET_TOKEN', 'my-cron-secret')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('should return true for valid Bearer token', () => {
    expect(validateCronToken('Bearer my-cron-secret')).toBe(true)
  })

  it('should return false for wrong token', () => {
    expect(validateCronToken('Bearer wrong-token')).toBe(false)
  })

  it('should return false for null header', () => {
    expect(validateCronToken(null)).toBe(false)
  })

  it('should return false for non-Bearer prefix', () => {
    expect(validateCronToken('Basic my-cron-secret')).toBe(false)
  })

  it('should return false for missing Bearer prefix', () => {
    expect(validateCronToken('my-cron-secret')).toBe(false)
  })

  it('should return false when CRON_SECRET_TOKEN is not set', () => {
    vi.stubEnv('CRON_SECRET_TOKEN', '')
    expect(validateCronToken('Bearer my-cron-secret')).toBe(false)
  })
})
