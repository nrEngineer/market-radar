/* ═══════════════════════════════════════════════════════════════
   Market Radar — Transparent Scoring Engine
   Every score is reproducible with documented formulas
   ═══════════════════════════════════════════════════════════════ */

export interface ScoringInput {
  // Market Size inputs
  samValue: number          // SAM in JPY
  maxSamBenchmark?: number  // Max SAM for normalization (default: 50B JPY)
  
  // Growth inputs
  cagr: number              // CAGR in percentage
  yoyGrowth?: number        // Year-over-year growth %
  
  // Competition inputs
  herfindahlIndex: number   // HHI (0-10000)
  competitorCount: number   // Number of direct competitors
  topPlayerShare?: number   // Top player market share %
  
  // Feasibility inputs
  techComplexity: number    // 0-100 (100=simple)
  costFeasibility: number   // 0-100 (100=cheap)
  teamFit: number           // 0-100 (100=perfect fit)
  
  // Timing inputs
  adoptionStage: 'innovators' | 'early_adopters' | 'early_majority' | 'late_majority' | 'laggards'
  trendMomentum: number     // 0-100
  monthsSinceEmergence?: number
  
  // Moat inputs
  networkEffects: number    // 0-100
  switchingCosts: number    // 0-100
  dataAdvantage: number     // 0-100
  brandValue: number        // 0-100
}

export interface ScoringResult {
  overall: number
  marketSize: number
  growth: number
  competition: number
  feasibility: number
  timing: number
  moat: number
  breakdown: ScoringBreakdown
}

export interface ScoringBreakdown {
  marketSize: {
    score: number
    weight: number
    formula: string
    inputs: Record<string, number | string>
    calculation: string
  }
  growth: {
    score: number
    weight: number
    formula: string
    inputs: Record<string, number | string>
    calculation: string
  }
  competition: {
    score: number
    weight: number
    formula: string
    inputs: Record<string, number | string>
    calculation: string
  }
  feasibility: {
    score: number
    weight: number
    formula: string
    inputs: Record<string, number | string>
    calculation: string
  }
  timing: {
    score: number
    weight: number
    formula: string
    inputs: Record<string, number | string>
    calculation: string
  }
  moat: {
    score: number
    weight: number
    formula: string
    inputs: Record<string, number | string>
    calculation: string
  }
}

// Scoring weights (must sum to 1.0)
export const SCORING_WEIGHTS = {
  marketSize: 0.20,
  growth: 0.20,
  competition: 0.15,
  feasibility: 0.15,
  timing: 0.15,
  moat: 0.15,
} as const

// Adoption stage scores
const ADOPTION_SCORES: Record<string, number> = {
  innovators: 95,
  early_adopters: 90,
  early_majority: 70,
  late_majority: 40,
  laggards: 15,
}

/**
 * Calculate market size score
 * Formula: log10(SAM) / log10(maxSAM) * 100
 * Normalized to 0-100 using logarithmic scale
 */
function scoreMarketSize(samValue: number, maxSam: number = 50_000_000_000): { score: number; calculation: string } {
  if (samValue <= 0) return { score: 0, calculation: 'SAM=0 → score=0' }
  const logSam = Math.log10(samValue)
  const logMax = Math.log10(maxSam)
  const raw = (logSam / logMax) * 100
  const score = Math.min(Math.round(raw), 100)
  return {
    score,
    calculation: `log10(${(samValue / 1e9).toFixed(1)}B) / log10(${(maxSam / 1e9).toFixed(0)}B) × 100 = ${logSam.toFixed(2)} / ${logMax.toFixed(2)} × 100 = ${score}`,
  }
}

/**
 * Calculate growth score
 * Formula: min(CAGR / 50 * 100, 100) with YoY boost
 * CAGR of 50% = perfect score
 */
function scoreGrowth(cagr: number, yoyGrowth?: number): { score: number; calculation: string } {
  const baseScore = Math.min((cagr / 50) * 100, 100)
  const yoyBoost = yoyGrowth ? Math.min((yoyGrowth / 100) * 10, 10) : 0
  const score = Math.min(Math.round(baseScore + yoyBoost), 100)
  return {
    score,
    calculation: `min(${cagr}% / 50% × 100, 100) = ${baseScore.toFixed(1)}${yoyGrowth ? ` + YoY boost ${yoyBoost.toFixed(1)}` : ''} = ${score}`,
  }
}

/**
 * Calculate competition score
 * Formula: 100 - (HHI / 10000 * 100) with competitor count adjustment
 * Low HHI (fragmented) = high opportunity score
 */
function scoreCompetition(hhi: number, competitorCount: number, topPlayerShare?: number): { score: number; calculation: string } {
  const hhiScore = 100 - (hhi / 10000) * 100
  // Bonus for fragmented markets with many small players
  const fragBonus = competitorCount > 20 ? 5 : competitorCount > 10 ? 3 : 0
  // Penalty for dominant player
  const domPenalty = topPlayerShare && topPlayerShare > 50 ? -15 : topPlayerShare && topPlayerShare > 30 ? -8 : 0
  const score = Math.max(0, Math.min(Math.round(hhiScore + fragBonus + domPenalty), 100))
  return {
    score,
    calculation: `100 - (HHI ${hhi} / 10000 × 100) = ${hhiScore.toFixed(1)} + frag_bonus(${fragBonus}) + dom_penalty(${domPenalty}) = ${score}`,
  }
}

/**
 * Calculate feasibility score
 * Formula: techComplexity * 0.4 + costFeasibility * 0.3 + teamFit * 0.3
 */
function scoreFeasibility(tech: number, cost: number, team: number): { score: number; calculation: string } {
  const score = Math.round(tech * 0.4 + cost * 0.3 + team * 0.3)
  return {
    score,
    calculation: `tech(${tech}) × 0.4 + cost(${cost}) × 0.3 + team(${team}) × 0.3 = ${score}`,
  }
}

/**
 * Calculate timing score
 * Formula: adoptionStageScore * trendMomentum / 100
 * Peak score at early_adopters with high momentum
 */
function scoreTiming(adoptionStage: string, momentum: number): { score: number; calculation: string } {
  const stageScore = ADOPTION_SCORES[adoptionStage] ?? 50
  const raw = (stageScore * momentum) / 100
  const score = Math.round(raw)
  return {
    score,
    calculation: `stage_score(${adoptionStage}=${stageScore}) × momentum(${momentum}) / 100 = ${score}`,
  }
}

/**
 * Calculate moat score
 * Formula: networkEffects * 0.3 + switchingCosts * 0.3 + dataAdvantage * 0.2 + brandValue * 0.2
 */
function scoreMoat(network: number, switching: number, data: number, brand: number): { score: number; calculation: string } {
  const score = Math.round(network * 0.3 + switching * 0.3 + data * 0.2 + brand * 0.2)
  return {
    score,
    calculation: `network(${network}) × 0.3 + switching(${switching}) × 0.3 + data(${data}) × 0.2 + brand(${brand}) × 0.2 = ${score}`,
  }
}

/**
 * Main scoring function — fully transparent and reproducible
 */
export function calculateScore(input: ScoringInput): ScoringResult {
  const ms = scoreMarketSize(input.samValue, input.maxSamBenchmark)
  const gr = scoreGrowth(input.cagr, input.yoyGrowth)
  const co = scoreCompetition(input.herfindahlIndex, input.competitorCount, input.topPlayerShare)
  const fe = scoreFeasibility(input.techComplexity, input.costFeasibility, input.teamFit)
  const ti = scoreTiming(input.adoptionStage, input.trendMomentum)
  const mo = scoreMoat(input.networkEffects, input.switchingCosts, input.dataAdvantage, input.brandValue)

  const overall = Math.round(
    ms.score * SCORING_WEIGHTS.marketSize +
    gr.score * SCORING_WEIGHTS.growth +
    co.score * SCORING_WEIGHTS.competition +
    fe.score * SCORING_WEIGHTS.feasibility +
    ti.score * SCORING_WEIGHTS.timing +
    mo.score * SCORING_WEIGHTS.moat
  )

  return {
    overall,
    marketSize: ms.score,
    growth: gr.score,
    competition: co.score,
    feasibility: fe.score,
    timing: ti.score,
    moat: mo.score,
    breakdown: {
      marketSize: {
        score: ms.score,
        weight: SCORING_WEIGHTS.marketSize,
        formula: 'log10(SAM) / log10(maxSAM) × 100',
        inputs: { samValue: input.samValue, maxSamBenchmark: input.maxSamBenchmark ?? 50_000_000_000 },
        calculation: ms.calculation,
      },
      growth: {
        score: gr.score,
        weight: SCORING_WEIGHTS.growth,
        formula: 'min(CAGR / 50 × 100, 100) + YoY boost',
        inputs: { cagr: input.cagr, yoyGrowth: input.yoyGrowth ?? 'N/A' },
        calculation: gr.calculation,
      },
      competition: {
        score: co.score,
        weight: SCORING_WEIGHTS.competition,
        formula: '100 - (HHI / 10000 × 100) + adjustments',
        inputs: { hhi: input.herfindahlIndex, competitors: input.competitorCount, topShare: input.topPlayerShare ?? 'N/A' },
        calculation: co.calculation,
      },
      feasibility: {
        score: fe.score,
        weight: SCORING_WEIGHTS.feasibility,
        formula: 'tech × 0.4 + cost × 0.3 + team × 0.3',
        inputs: { techComplexity: input.techComplexity, costFeasibility: input.costFeasibility, teamFit: input.teamFit },
        calculation: fe.calculation,
      },
      timing: {
        score: ti.score,
        weight: SCORING_WEIGHTS.timing,
        formula: 'adoptionStageScore × trendMomentum / 100',
        inputs: { adoptionStage: input.adoptionStage, trendMomentum: input.trendMomentum },
        calculation: ti.calculation,
      },
      moat: {
        score: mo.score,
        weight: SCORING_WEIGHTS.moat,
        formula: 'network × 0.3 + switching × 0.3 + data × 0.2 + brand × 0.2',
        inputs: { networkEffects: input.networkEffects, switchingCosts: input.switchingCosts, dataAdvantage: input.dataAdvantage, brandValue: input.brandValue },
        calculation: mo.calculation,
      },
    },
  }
}
