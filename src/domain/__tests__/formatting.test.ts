import { describe, it, expect } from 'vitest'
import {
  formatCurrency,
  formatNumber,
  getScoreColor,
  getScoreLabel,
  getRiskColor,
  getAdoptionLabel,
} from '../formatting'

describe('formatCurrency', () => {
  it('should format small numbers without compact', () => {
    expect(formatCurrency(500)).toBe('¥500')
  })

  it('should format with locale separators', () => {
    expect(formatCurrency(1500000)).toContain('¥')
  })

  it('should format billions in compact mode', () => {
    expect(formatCurrency(5_000_000_000, true)).toBe('¥5.0B')
  })

  it('should format millions in compact mode', () => {
    expect(formatCurrency(2_500_000, true)).toBe('¥2.5M')
  })

  it('should format thousands in compact mode', () => {
    expect(formatCurrency(1500, true)).toBe('¥2K')
  })

  it('should not compact values below 1000', () => {
    expect(formatCurrency(999, true)).toBe('¥999')
  })
})

describe('formatNumber', () => {
  it('should format millions in compact mode', () => {
    expect(formatNumber(1_500_000, true)).toBe('1.5M')
  })

  it('should format thousands in compact mode', () => {
    expect(formatNumber(2500, true)).toBe('2.5K')
  })

  it('should not compact values below 1000', () => {
    expect(formatNumber(999, true)).toBe('999')
  })
})

describe('getScoreColor', () => {
  it('should return emerald for score >= 90', () => {
    expect(getScoreColor(90)).toContain('emerald')
    expect(getScoreColor(100)).toContain('emerald')
  })

  it('should return indigo for score 75-89', () => {
    expect(getScoreColor(75)).toContain('indigo')
    expect(getScoreColor(89)).toContain('indigo')
  })

  it('should return amber for score 60-74', () => {
    expect(getScoreColor(60)).toContain('amber')
    expect(getScoreColor(74)).toContain('amber')
  })

  it('should return rose for score < 60', () => {
    expect(getScoreColor(59)).toContain('rose')
    expect(getScoreColor(0)).toContain('rose')
  })
})

describe('getScoreLabel', () => {
  it('should return correct labels for each tier', () => {
    expect(getScoreLabel(95)).toBe('非常に高い')
    expect(getScoreLabel(80)).toBe('高い')
    expect(getScoreLabel(65)).toBe('中程度')
    expect(getScoreLabel(45)).toBe('低い')
    expect(getScoreLabel(30)).toBe('非常に低い')
  })

  it('should handle boundary values', () => {
    expect(getScoreLabel(90)).toBe('非常に高い')
    expect(getScoreLabel(89)).toBe('高い')
    expect(getScoreLabel(75)).toBe('高い')
    expect(getScoreLabel(74)).toBe('中程度')
    expect(getScoreLabel(60)).toBe('中程度')
    expect(getScoreLabel(59)).toBe('低い')
    expect(getScoreLabel(40)).toBe('低い')
    expect(getScoreLabel(39)).toBe('非常に低い')
  })
})

describe('getRiskColor', () => {
  it('should return correct colors for each level', () => {
    expect(getRiskColor('low')).toContain('emerald')
    expect(getRiskColor('medium')).toContain('amber')
    expect(getRiskColor('high')).toContain('rose')
    expect(getRiskColor('unknown')).toContain('slate')
  })
})

describe('getAdoptionLabel', () => {
  it('should return Japanese labels for each stage', () => {
    expect(getAdoptionLabel('innovators')).toContain('イノベーター')
    expect(getAdoptionLabel('early_adopters')).toContain('アーリーアダプター')
    expect(getAdoptionLabel('early_majority')).toContain('アーリーマジョリティ')
    expect(getAdoptionLabel('late_majority')).toContain('レイトマジョリティ')
    expect(getAdoptionLabel('laggards')).toContain('ラガード')
  })

  it('should return raw string for unknown stage', () => {
    expect(getAdoptionLabel('custom_stage')).toBe('custom_stage')
  })
})
