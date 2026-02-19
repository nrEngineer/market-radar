import {
  fallbackProducts,
  fallbackTopics,
  fallbackAnalysis,
} from '@/data/product-hunt-fallback'

// Raw Product Hunt types (as returned by productHuntAPI)
interface RawProduct {
  id: string
  name: string
  tagline: string
  description: string
  votes_count: number
  comments_count: number
  featured_at: string
  website: string
  topics: { name: string }[]
  makers: { name: string }[]
  hunter: { name: string }
  thumbnail: { media_url: string }
}

interface RawTopic {
  id: string
  name: string
  description: string
  posts_count: number
  followers_count: number
}

interface RawAnalysis {
  categories: Record<string, number>
  topKeywords: string[]
  averageVotes: number
  trendingTopics: string[]
  marketInsights: string[]
}

// Transformed types for frontend consumption
export interface TransformedProduct {
  id: string
  name: string
  tagline: string
  description: string
  votes: number
  comments: number
  date: string
  website: string
  topics: string[]
  maker: string
  hunter: string
  thumbnail: string
}

export interface TransformedTopic {
  id: string
  name: string
  description: string
  postsCount: number
  followersCount: number
}

export interface TransformedAnalysis {
  totalProducts: number
  categories: Record<string, number>
  topKeywords: string[]
  averageVotes: number
  trendingTopics: string[]
  insights: string[]
}

export interface ProductHuntResponse {
  products: TransformedProduct[]
  topics: TransformedTopic[]
  analysis: TransformedAnalysis
  metadata: {
    source: string
    timestamp: string
    cost: string
    freshness: string
  }
  fallback?: boolean
}

export function transformProductHuntData(
  products: RawProduct[],
  topics: RawTopic[],
  analysis: RawAnalysis
): ProductHuntResponse {
  return {
    products: products.map(product => ({
      id: product.id,
      name: product.name,
      tagline: product.tagline,
      description: product.description,
      votes: product.votes_count,
      comments: product.comments_count,
      date: product.featured_at,
      website: product.website,
      topics: product.topics.map(t => t.name),
      maker: product.makers[0]?.name || 'Unknown',
      hunter: product.hunter.name,
      thumbnail: product.thumbnail.media_url,
    })),
    topics: topics.map(topic => ({
      id: topic.id,
      name: topic.name,
      description: topic.description,
      postsCount: topic.posts_count,
      followersCount: topic.followers_count,
    })),
    analysis: {
      totalProducts: products.length,
      categories: analysis.categories,
      topKeywords: analysis.topKeywords,
      averageVotes: Math.round(analysis.averageVotes),
      trendingTopics: analysis.trendingTopics,
      insights: analysis.marketInsights,
    },
    metadata: {
      source: 'Product Hunt',
      timestamp: new Date().toISOString(),
      cost: '¥0 (Free RSS/Public API)',
      freshness: 'Real-time',
    },
  }
}

export function getFallbackData(): ProductHuntResponse {
  return {
    products: fallbackProducts.map(p => ({ ...p, date: new Date().toISOString() })),
    topics: fallbackTopics,
    analysis: fallbackAnalysis,
    metadata: {
      source: 'Product Hunt (Fallback Data)',
      timestamp: new Date().toISOString(),
      cost: '¥0 (Free System)',
      freshness: 'Demo Data',
    },
    fallback: true,
  }
}
