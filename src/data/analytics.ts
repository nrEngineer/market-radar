import type { AnalyticsSummary } from '@/domain/types'

export const analyticsSummary: AnalyticsSummary = {
  period: '2026年2月',
  totalOpportunities: 89,
  newOpportunities: 12,
  validatedOpportunities: 23,
  avgScore: 76,
  topCategory: 'AI Tools',
  topGrowthArea: 'AIエージェント',
  dataPointsCollected: 15847,
  sourcesActive: 4,
  marketInsights: [
    { insight: 'AIエージェント関連プロダクトのPH投稿数が前月比+65%。早期参入の窓が開いている', impact: 'positive', confidence: 88, source: 'Product Hunt API' },
    { insight: '生産性アプリのApp Store課金額が前年比+23%増。日本市場の成長が加速', impact: 'positive', confidence: 92, source: 'App Store Connect' },
    { insight: '汎用チャットボットのユーザー評価が低下傾向（4.2→3.8）。品質差別化の余地あり', impact: 'neutral', confidence: 75, source: 'App Store Reviews分析' },
    { insight: 'ノーコード/ローコード市場の成長が鈍化（+12%→+8%）。成熟フェーズ突入', impact: 'negative', confidence: 80, source: 'Hacker News/PH複合分析' },
  ],
  weeklyTrend: [
    { week: 'W1', opportunities: 18, avgScore: 72 },
    { week: 'W2', opportunities: 22, avgScore: 75 },
    { week: 'W3', opportunities: 25, avgScore: 78 },
    { week: 'W4', opportunities: 24, avgScore: 76 },
  ],
  categoryDistribution: [
    { category: 'AI Tools', count: 34, avgScore: 82 },
    { category: 'Productivity', count: 22, avgScore: 75 },
    { category: 'Health & Fitness', count: 15, avgScore: 70 },
    { category: 'Finance', count: 10, avgScore: 68 },
    { category: 'Education', count: 8, avgScore: 72 },
  ],
  riskDistribution: [
    { level: '低リスク', count: 28, percentage: 31 },
    { level: '中リスク', count: 42, percentage: 47 },
    { level: '高リスク', count: 19, percentage: 22 },
  ],
}
