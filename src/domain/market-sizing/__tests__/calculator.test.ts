import { describe, it, expect } from 'vitest'
import {
  calculateProductivityAppMarket,
  calculateCreativeToolsMarket,
  calculateHealthcareIoTMarket,
  marketSizingCalculations,
} from '../calculator'

describe('calculateProductivityAppMarket', () => {
  const result = calculateProductivityAppMarket()

  it('should have TAM/SAM/SOM structure', () => {
    expect(result).toHaveProperty('tam')
    expect(result).toHaveProperty('sam')
    expect(result).toHaveProperty('som')
    expect(result).toHaveProperty('crossValidation')
    expect(result).toHaveProperty('cagr')
  })

  it('should have TAM > SAM > SOM', () => {
    expect(result.tam.value).toBeGreaterThan(result.sam.value)
    expect(result.sam.value).toBeGreaterThan(result.som.value)
  })

  it('should have steps with sources in TAM', () => {
    expect(result.tam.steps.length).toBeGreaterThan(0)
    for (const step of result.tam.steps) {
      expect(step.sources.length).toBeGreaterThan(0)
      expect(step.confidence).toBeGreaterThan(0)
      expect(step.confidence).toBeLessThanOrEqual(100)
    }
  })

  it('should use top-down methodology for TAM', () => {
    expect(result.tam.methodology).toBe('top-down')
  })

  it('should use bottom-up methodology for SOM', () => {
    expect(result.som.methodology).toBe('bottom-up')
  })

  it('should have confidence between 0 and 100', () => {
    expect(result.tam.confidence).toBeGreaterThan(0)
    expect(result.tam.confidence).toBeLessThanOrEqual(100)
    expect(result.sam.confidence).toBeGreaterThan(0)
    expect(result.som.confidence).toBeGreaterThan(0)
  })

  it('should have valid CAGR value', () => {
    // Compound: (1.132 * 1.102) - 1 ≈ 0.2475 → 24.7%
    expect(result.cagr.value).toBeCloseTo(24.7, 0)
    expect(result.cagr.period).toBe('2024-2028')
  })

  it('should have cross-validation with low divergence', () => {
    expect(result.crossValidation.divergencePercent).toBeLessThan(10)
  })
})

describe('calculateCreativeToolsMarket', () => {
  const result = calculateCreativeToolsMarket()

  it('should have TAM > SAM > SOM', () => {
    expect(result.tam.value).toBeGreaterThan(result.sam.value)
    expect(result.sam.value).toBeGreaterThan(result.som.value)
  })

  it('should have valid CAGR value', () => {
    // Compound: (1.174 * 1.138) - 1 ≈ 0.336 → 33.6%
    expect(result.cagr.value).toBeCloseTo(33.6, 0)
  })

  it('should use top-down for TAM and SAM', () => {
    expect(result.tam.methodology).toBe('top-down')
    expect(result.sam.methodology).toBe('top-down')
  })
})

describe('calculateHealthcareIoTMarket', () => {
  const result = calculateHealthcareIoTMarket()

  it('should have TAM > SAM > SOM', () => {
    expect(result.tam.value).toBeGreaterThan(result.sam.value)
    expect(result.sam.value).toBeGreaterThan(result.som.value)
  })

  it('should have CAGR of 18.7%', () => {
    expect(result.cagr.value).toBe(18.7)
  })

  it('should have single step for TAM', () => {
    expect(result.tam.steps.length).toBe(1)
  })
})

describe('marketSizingCalculations', () => {
  it('should contain opp-001, opp-002, opp-003', () => {
    expect(marketSizingCalculations).toHaveProperty('opp-001')
    expect(marketSizingCalculations).toHaveProperty('opp-002')
    expect(marketSizingCalculations).toHaveProperty('opp-003')
  })

  it('should match individual function results', () => {
    expect(marketSizingCalculations['opp-001'].tam.value).toBe(calculateProductivityAppMarket().tam.value)
    expect(marketSizingCalculations['opp-002'].tam.value).toBe(calculateCreativeToolsMarket().tam.value)
    expect(marketSizingCalculations['opp-003'].tam.value).toBe(calculateHealthcareIoTMarket().tam.value)
  })
})
