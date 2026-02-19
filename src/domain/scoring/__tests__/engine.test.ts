import { describe, it, expect } from 'vitest'
import { calculateScore, SCORING_WEIGHTS, type ScoringInput } from '../engine'

const baseInput: ScoringInput = {
  samValue: 5_000_000_000,
  cagr: 25,
  herfindahlIndex: 1500,
  competitorCount: 15,
  techComplexity: 70,
  costFeasibility: 60,
  teamFit: 80,
  adoptionStage: 'early_adopters',
  trendMomentum: 75,
  networkEffects: 50,
  switchingCosts: 40,
  dataAdvantage: 60,
  brandValue: 30,
}

describe('SCORING_WEIGHTS', () => {
  it('should sum to exactly 1.0', () => {
    const sum = Object.values(SCORING_WEIGHTS).reduce((a, b) => a + b, 0)
    expect(sum).toBeCloseTo(1.0, 10)
  })

  it('should have 6 scoring dimensions', () => {
    expect(Object.keys(SCORING_WEIGHTS)).toHaveLength(6)
  })
})

describe('calculateScore', () => {
  it('should return overall score between 0 and 100', () => {
    const result = calculateScore(baseInput)
    expect(result.overall).toBeGreaterThanOrEqual(0)
    expect(result.overall).toBeLessThanOrEqual(100)
  })

  it('should return all 6 sub-scores', () => {
    const result = calculateScore(baseInput)
    expect(result).toHaveProperty('marketSize')
    expect(result).toHaveProperty('growth')
    expect(result).toHaveProperty('competition')
    expect(result).toHaveProperty('feasibility')
    expect(result).toHaveProperty('timing')
    expect(result).toHaveProperty('moat')
  })

  it('should include breakdown with formulas', () => {
    const result = calculateScore(baseInput)
    for (const key of Object.keys(SCORING_WEIGHTS) as (keyof typeof SCORING_WEIGHTS)[]) {
      expect(result.breakdown[key]).toHaveProperty('score')
      expect(result.breakdown[key]).toHaveProperty('weight')
      expect(result.breakdown[key]).toHaveProperty('formula')
      expect(result.breakdown[key]).toHaveProperty('calculation')
    }
  })

  it('should return marketSize=0 when SAM=0', () => {
    const result = calculateScore({ ...baseInput, samValue: 0 })
    expect(result.marketSize).toBe(0)
  })

  it('should return growth=100 when CAGR=50', () => {
    const result = calculateScore({ ...baseInput, cagr: 50 })
    expect(result.growth).toBe(100)
  })

  it('should return growth=0 when CAGR=0', () => {
    const result = calculateScore({ ...baseInput, cagr: 0 })
    expect(result.growth).toBe(0)
  })

  it('should cap growth at 100 even with high CAGR', () => {
    const result = calculateScore({ ...baseInput, cagr: 200 })
    expect(result.growth).toBeLessThanOrEqual(100)
  })

  it('should return low competition score for monopoly (HHI=10000)', () => {
    const result = calculateScore({ ...baseInput, herfindahlIndex: 10000, competitorCount: 1 })
    expect(result.competition).toBeLessThanOrEqual(5)
  })

  it('should return high competition score for fragmented market (HHI=100)', () => {
    const result = calculateScore({ ...baseInput, herfindahlIndex: 100, competitorCount: 50 })
    expect(result.competition).toBeGreaterThanOrEqual(90)
  })

  it('should score timing high for early_adopters with high momentum', () => {
    const result = calculateScore({
      ...baseInput,
      adoptionStage: 'early_adopters',
      trendMomentum: 100,
    })
    expect(result.timing).toBe(90)
  })

  it('should score timing low for laggards with low momentum', () => {
    const result = calculateScore({
      ...baseInput,
      adoptionStage: 'laggards',
      trendMomentum: 10,
    })
    expect(result.timing).toBeLessThanOrEqual(5)
  })

  it('should calculate overall as weighted sum of sub-scores', () => {
    const result = calculateScore(baseInput)
    const expectedOverall = Math.round(
      result.marketSize * SCORING_WEIGHTS.marketSize +
      result.growth * SCORING_WEIGHTS.growth +
      result.competition * SCORING_WEIGHTS.competition +
      result.feasibility * SCORING_WEIGHTS.feasibility +
      result.timing * SCORING_WEIGHTS.timing +
      result.moat * SCORING_WEIGHTS.moat
    )
    expect(result.overall).toBe(expectedOverall)
  })

  it('should apply dominant player penalty to competition score', () => {
    const withoutDominant = calculateScore({ ...baseInput, topPlayerShare: 10 })
    const withDominant = calculateScore({ ...baseInput, topPlayerShare: 60 })
    expect(withDominant.competition).toBeLessThan(withoutDominant.competition)
  })

  it('should add YoY boost to growth score', () => {
    const withoutYoy = calculateScore({ ...baseInput, cagr: 20 })
    const withYoy = calculateScore({ ...baseInput, cagr: 20, yoyGrowth: 50 })
    expect(withYoy.growth).toBeGreaterThan(withoutYoy.growth)
  })
})
