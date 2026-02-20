import type { DataProvenance } from '@/domain/types'

export const defaultProvenance: DataProvenance = {
  sources: [
    { name: 'Product Hunt API', url: 'https://api.producthunt.com', type: 'api', lastCollected: '2026-02-18T08:00:00Z', frequency: '毎日', reliability: 92, sampleSize: 500, methodology: 'GraphQL API経由で新着・人気プロダクトを自動収集' },
    { name: 'App Store Search API', url: 'https://itunes.apple.com', type: 'api', lastCollected: '2026-02-18T07:30:00Z', frequency: '毎日', reliability: 95, sampleSize: 1200, methodology: 'iTunes Search APIで主要カテゴリのアプリを収集・分析' },
    { name: 'Hacker News Firebase API', url: 'https://hacker-news.firebaseio.com', type: 'api', lastCollected: '2026-02-18T08:15:00Z', frequency: '毎時', reliability: 98, sampleSize: 200, methodology: 'Top/New storiesを毎時取得し、テック関連を抽出' },
    { name: 'スコアリングエンジン', url: '#', type: 'ai-analysis', lastCollected: '2026-02-18T08:30:00Z', frequency: '毎日', reliability: 78, methodology: 'キーワードマッチング + 多次元重み付けスコアリング' },
  ],
  collectedAt: '2026-02-18T08:30:00Z',
  updatedAt: '2026-02-18T08:30:00Z',
  confidenceScore: 82,
  qualityIndicators: { completeness: 85, accuracy: 80, timeliness: 90, consistency: 78 },
}
