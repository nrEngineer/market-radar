import { NextRequest, NextResponse } from 'next/server'
import { productHuntAPI } from '@/integrations/product-hunt/client'
import { notifyError } from '@/server/discord-notify'

// Product Hunt Data Collection API
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Collecting Product Hunt data...')
    
    // Collect data from Product Hunt
    const [products, topics] = await Promise.all([
      productHuntAPI.getTodaysFeatured(),
      productHuntAPI.getTrendingTopics()
    ])
    
    // Analyze trends
    const analysis = await productHuntAPI.analyzeProductTrends(products)
    
    // Transform for frontend consumption
    const responseData = {
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
        thumbnail: product.thumbnail.media_url
      })),
      topics: topics.map(topic => ({
        id: topic.id,
        name: topic.name,
        description: topic.description,
        postsCount: topic.posts_count,
        followersCount: topic.followers_count
      })),
      analysis: {
        totalProducts: products.length,
        categories: analysis.categories,
        topKeywords: analysis.topKeywords,
        averageVotes: Math.round(analysis.averageVotes),
        trendingTopics: analysis.trendingTopics,
        insights: analysis.marketInsights
      },
      metadata: {
        source: 'Product Hunt',
        timestamp: new Date().toISOString(),
        cost: '¥0 (Free RSS/Public API)',
        freshness: 'Real-time'
      }
    }
    
    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': 'public, max-age=1800', // 30 min cache
        'X-Data-Source': 'Product Hunt RSS + Public API'
      }
    })
    
  } catch (error) {
    console.error('Product Hunt API error:', error)
    notifyError('product-hunt-data', error instanceof Error ? error.message : 'Unknown error').catch(() => {})
    
    // Return fallback data to ensure system reliability
    return NextResponse.json({
      products: [
        {
          id: 'demo-1',
          name: 'AI Market Analyzer',
          tagline: 'Analyze any market with AI in seconds',
          description: 'Revolutionary AI-powered market analysis tool that provides McKinsey-grade insights at fraction of the cost.',
          votes: 347,
          comments: 23,
          date: new Date().toISOString(),
          website: 'https://example.com',
          topics: ['AI Tools', 'SaaS', 'Analytics'],
          maker: 'Market Team',
          hunter: 'Tech Hunter',
          thumbnail: 'https://via.placeholder.com/240x180/3B82F6/FFFFFF?text=AI+Market'
        },
        {
          id: 'demo-2', 
          name: 'NoCode Dashboard Builder',
          tagline: 'Build beautiful dashboards without coding',
          description: 'Create stunning analytics dashboards for your business metrics without writing a single line of code.',
          votes: 289,
          comments: 18,
          date: new Date().toISOString(),
          website: 'https://example.com',
          topics: ['No Code', 'Analytics', 'SaaS'],
          maker: 'Dashboard Team',
          hunter: 'Product Hunter',
          thumbnail: 'https://via.placeholder.com/240x180/10B981/FFFFFF?text=NoCode'
        }
      ],
      topics: [
        {
          id: 'ai-tools',
          name: 'AI Tools',
          description: 'Artificial intelligence powered applications',
          postsCount: 2500,
          followersCount: 45000
        },
        {
          id: 'saas',
          name: 'SaaS',
          description: 'Software as a Service products',
          postsCount: 4100,
          followersCount: 68000
        }
      ],
      analysis: {
        totalProducts: 2,
        categories: {
          'AI Tools': 1,
          'SaaS': 2,
          'Analytics': 2,
          'No Code': 1
        },
        topKeywords: ['ai', 'market', 'dashboard', 'analytics', 'nocode'],
        averageVotes: 318,
        trendingTopics: ['SaaS', 'AI Tools', 'Analytics'],
        insights: [
          'SaaS products dominating with 2 launches',
          'Average votes per product: 318 (high engagement)',
          'AI and Analytics trending keywords',
          'Strong focus on business tools and productivity'
        ]
      },
      metadata: {
        source: 'Product Hunt (Fallback Data)',
        timestamp: new Date().toISOString(),
        cost: '¥0 (Free System)',
        freshness: 'Demo Data'
      },
      fallback: true
    }, { 
      status: 200,
      headers: {
        'X-Fallback-Mode': 'true',
        'X-Data-Source': 'Fallback Demo Data'
      }
    })
  }
}