import { z } from 'zod'

export const customResearchSchema = z.object({
  query: z.string().min(1).max(500),
  type: z.enum(['market', 'competitor', 'trend', 'technology', 'opportunity', 'pricing', 'custom']).optional().default('market'),
  timestamp: z.string().datetime().optional(),
})

export const stripeCheckoutSchema = z.object({
  plan: z.enum(['premium', 'professional', 'enterprise']),
  success_url: z.string().url().optional(),
  cancel_url: z.string().url().optional(),
  customer_email: z.string().email().optional(),
})

export const freeAnalysisParamsSchema = z.object({
  type: z.enum(['market-overview', 'trend-analysis', 'competitor-scan', 'opportunity-finder', 'risk-assessment', 'comprehensive']).optional().default('comprehensive'),
  timeframe: z.enum(['7d', '30d', '90d', '1y']).optional().default('30d'),
})

export const collectSourceSchema = z.object({
  source: z.enum(['github', 'hackernews', 'reddit', 'appstore', 'producthunt', 'all']).optional().default('all'),
})

export type CustomResearchInput = z.infer<typeof customResearchSchema>
export type StripeCheckoutInput = z.infer<typeof stripeCheckoutSchema>
export type FreeAnalysisParams = z.infer<typeof freeAnalysisParamsSchema>
export type CollectSourceInput = z.infer<typeof collectSourceSchema>
