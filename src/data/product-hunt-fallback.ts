// Fallback demo data for Product Hunt API failures

export const fallbackProducts = [
  {
    id: 'demo-1',
    name: 'AI Market Analyzer',
    tagline: 'Analyze any market with AI in seconds',
    description:
      'Revolutionary AI-powered market analysis tool that provides McKinsey-grade insights at fraction of the cost.',
    votes: 347,
    comments: 23,
    website: 'https://example.com',
    topics: ['AI Tools', 'SaaS', 'Analytics'],
    maker: 'Market Team',
    hunter: 'Tech Hunter',
    thumbnail: 'https://via.placeholder.com/240x180/3B82F6/FFFFFF?text=AI+Market',
  },
  {
    id: 'demo-2',
    name: 'NoCode Dashboard Builder',
    tagline: 'Build beautiful dashboards without coding',
    description:
      'Create stunning analytics dashboards for your business metrics without writing a single line of code.',
    votes: 289,
    comments: 18,
    website: 'https://example.com',
    topics: ['No Code', 'Analytics', 'SaaS'],
    maker: 'Dashboard Team',
    hunter: 'Product Hunter',
    thumbnail: 'https://via.placeholder.com/240x180/10B981/FFFFFF?text=NoCode',
  },
]

export const fallbackTopics = [
  {
    id: 'ai-tools',
    name: 'AI Tools',
    description: 'Artificial intelligence powered applications',
    postsCount: 2500,
    followersCount: 45000,
  },
  {
    id: 'saas',
    name: 'SaaS',
    description: 'Software as a Service products',
    postsCount: 4100,
    followersCount: 68000,
  },
]

export const fallbackAnalysis = {
  totalProducts: 2,
  categories: {
    'AI Tools': 1,
    SaaS: 2,
    Analytics: 2,
    'No Code': 1,
  },
  topKeywords: ['ai', 'market', 'dashboard', 'analytics', 'nocode'],
  averageVotes: 318,
  trendingTopics: ['SaaS', 'AI Tools', 'Analytics'],
  insights: [
    'SaaS products dominating with 2 launches',
    'Average votes per product: 318 (high engagement)',
    'AI and Analytics trending keywords',
    'Strong focus on business tools and productivity',
  ],
}
