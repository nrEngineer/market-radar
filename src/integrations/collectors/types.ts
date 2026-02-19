// Shared types and configuration for all data collectors

export const COLLECTION_SOURCES = {
  productHunt: {
    enabled: true,
    url: 'https://api.producthunt.com/v2/api/graphql',
    description: 'Product Hunt新着・話題の製品'
  },
  appStore: {
    enabled: true,
    url: 'https://itunes.apple.com/search',
    description: 'App Store検索・ランキング'
  },
  playStore: {
    enabled: true,
    url: 'https://serpapi.com/search',
    description: 'Google Play Store検索'
  },
  hackernews: {
    enabled: true,
    url: 'https://hacker-news.firebaseio.com/v0',
    description: 'Hacker News話題'
  }
} as const

export interface CollectionResult {
  source: string
  status: 'success' | 'error'
  dataCount: number
  timestamp: string
  data?: Record<string, unknown>[]
  error?: string
}
