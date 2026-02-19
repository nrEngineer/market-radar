import { freeDataCollector } from '@/integrations/free-sources/collector'
import { performClaudeAnalysis } from '@/domain/analysis/market-analysis'
import type { MarketAnalysis } from '@/domain/analysis/types'

export async function runFreeAnalysis(
  analysisType: string,
  timeframe: string
): Promise<MarketAnalysis> {
  const rawData = await freeDataCollector.collectAllMarketData()
  const analysis = performClaudeAnalysis(rawData, analysisType, timeframe, new Date().toISOString())
  return analysis
}
