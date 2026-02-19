import { executeCustomResearch, generateAnalysisId, type ResearchResult, type ResearchContext } from '@/domain/research/research-engine'

export interface CustomResearchOutput extends ResearchResult {
  timestamp: string
  query: string
  type: string
  status: 'success'
}

export function runCustomResearch(
  query: string,
  type: string,
  timestamp: string
): CustomResearchOutput {
  if (!query || !type) {
    throw new Error('Query and type required')
  }

  const startTime = performance.now()
  const analysisId = generateAnalysisId(crypto.randomUUID(), Date.now())

  const context: ResearchContext = {
    analysisId,
    executionTimeMs: Math.round(performance.now() - startTime),
    confidence: 85,
  }

  const results = executeCustomResearch(query, type, context)

  return {
    ...results,
    timestamp,
    query,
    type,
    status: 'success'
  }
}
