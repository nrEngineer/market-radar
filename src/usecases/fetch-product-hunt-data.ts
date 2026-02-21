import { productHuntAPI } from '@/integrations/product-hunt/client'

export interface ProductHuntProduct {
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

export interface ProductHuntTopic {
  id: string
  name: string
  description: string
  postsCount: number
  followersCount: number
}

export interface ProductHuntAnalysis {
  totalProducts: number
  categories: Record<string, number>
  topKeywords: string[]
  averageVotes: number
  trendingTopics: string[]
  insights: string[]
}

export interface ProductHuntDataResult {
  products: ProductHuntProduct[]
  topics: ProductHuntTopic[]
  analysis: ProductHuntAnalysis
  metadata: {
    source: string
    timestamp: string
    cost: string
    freshness: string
  }
}

export async function fetchProductHuntData(): Promise<ProductHuntDataResult> {
  const [products, topics] = await Promise.all([
    productHuntAPI.getTodaysFeatured(),
    productHuntAPI.getTrendingTopics()
  ])

  const analysis = await productHuntAPI.analyzeProductTrends(products)

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
