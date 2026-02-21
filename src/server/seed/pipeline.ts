/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
/* ═══════════════════════════════════════════════════════════════
   Real Data Seeder - Transform free data into structured database
   ═══════════════════════════════════════════════════════════════ */

import { supabaseAdmin as supabase } from '@/server/db/client'
import { freeDataCollector } from '@/integrations/free-sources/collector'

interface ProcessedOpportunity {
  title: string
  subtitle: string
  category: string
  subcategory: string
  status: 'validated' | 'hypothesis' | 'researching' | 'archived'
  five_w1h: any
  scores: any
  risks: any
  revenue: any
  market: any
  implementation: any
  competitors: any[]
  tags: string[]
  created_at: string
  updated_at: string
}

interface ProcessedTrend {
  name: string
  description: string
  category: string
  momentum: number
  adoption_stage: 'emerging' | 'growing' | 'mature' | 'declining'
  impact_level: 'low' | 'medium' | 'high' | 'transformative'
  evidence: any[]
  prediction: any
  timeframe: string
  confidence_score: number
  created_at: string
  updated_at: string
}

interface ProcessedCategory {
  name: string
  parent_category: string
  description: string
  total_apps: number
  growth: string
  market_size: string
  key_players: string[]
  trends: string[]
  created_at: string
  updated_at: string
}

export class RealDataSeeder {
  async seedAllData(): Promise<{ 
    opportunities: number, 
    trends: number, 
    categories: number 
  }> {
    console.log('🌱 Starting real data seeding process...')
    
    try {
      // Step 1: Collect fresh data from all free sources
      const rawData = await freeDataCollector.collectAllMarketData()
      
      // Step 2: Process and structure the data
      const opportunities = await this.processOpportunities(rawData)
      const trends = await this.processTrends(rawData)
      const categories = await this.processCategories(rawData)
      
      // Step 3: Clear existing mock data
      await this.clearMockData()
      
      // Step 4: Insert real data
      const [oppResult, trendResult, catResult] = await Promise.all([
        this.insertOpportunities(opportunities),
        this.insertTrends(trends), 
        this.insertCategories(categories)
      ])
      
      // Step 5: Log collection metadata
      await this.logCollection(rawData.summary)
      
      console.log('✅ Real data seeding completed successfully')
      
      return {
        opportunities: oppResult.length,
        trends: trendResult.length,
        categories: catResult.length
      }
      
    } catch (error) {
      console.error('❌ Real data seeding failed:', error)
      throw error
    }
  }
  
  private async processOpportunities(rawData: any): Promise<ProcessedOpportunity[]> {
    const opportunities: ProcessedOpportunity[] = []
    
    // Process GitHub trending repos as opportunities
    rawData.github.slice(0, 10).forEach((repo: any) => {
      const category = this.classifyGitHubCategory(repo)
      const marketAnalysis = this.analyzeGitHubMarket(repo)
      
      opportunities.push({
        title: `${repo.name} - ${category} ソリューション`,
        subtitle: repo.description || 'GitHub発の新技術トレンド',
        category: 'Developer Tools',
        subcategory: category,
        status: repo.stargazers_count > 1000 ? 'validated' : 'hypothesis',
        five_w1h: {
          what: repo.description,
          who: 'デベロッパー・技術者',
          when: repo.created_at,
          where: 'グローバル・オープンソース',
          why: `${repo.stargazers_count}★獲得の技術的優位性`,
          how: repo.language ? `${repo.language}による実装` : 'オープンソース開発'
        },
        scores: {
          overall: Math.min(90, 60 + (repo.stargazers_count / 100)),
          marketSize: marketAnalysis.marketSize,
          growth: marketAnalysis.growth,
          competition: marketAnalysis.competition,
          feasibility: 85,
          timing: 90,
          moat: marketAnalysis.moat
        },
        risks: {
          level: repo.stargazers_count > 5000 ? 'low' : 'medium',
          factors: [
            {
              name: 'オープンソース競争',
              probability: 60,
              impact: 40,
              mitigation: '差別化機能・商用サポート提供'
            }
          ]
        },
        revenue: marketAnalysis.revenue,
        market: marketAnalysis.market,
        implementation: {
          timeline: '3-6ヶ月',
          resources: 'エンジニア2-3名',
          costs: '¥200-500万',
          milestones: ['MVP開発', 'ベータテスト', '正式リリース']
        },
        competitors: this.findGitHubCompetitors(repo),
        tags: [...(repo.topics || []), category.toLowerCase()],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    })
    
    // Process Reddit signals as market opportunities
    rawData.reddit.slice(0, 5).forEach((post: any) => {
      if (this.isBusinessOpportunity(post)) {
        const category = this.classifyRedditOpportunity(post)
        
        opportunities.push({
          title: this.extractOpportunityTitle(post.title),
          subtitle: `Reddit発見: ${post.subreddit}コミュニティで話題`,
          category: 'Market Intelligence',
          subcategory: category,
          status: 'researching',
          five_w1h: {
            what: post.title,
            who: `${post.subreddit}コミュニティ`,
            when: new Date(post.created_utc * 1000).toISOString(),
            where: `Reddit r/${post.subreddit}`,
            why: `${post.score}ポイント・${post.num_comments}コメントの注目度`,
            how: 'コミュニティ議論・フィードバック'
          },
          scores: {
            overall: Math.min(85, 50 + (post.score / 10)),
            marketSize: this.estimateRedditMarketSize(post),
            growth: Math.min(90, 60 + (post.score / 20)),
            competition: 70,
            feasibility: 75,
            timing: 85,
            moat: 60
          },
          risks: {
            level: 'medium',
            factors: [
              {
                name: 'コミュニティ依存',
                probability: 50,
                impact: 60,
                mitigation: '複数チャネルでの検証'
              }
            ]
          },
          revenue: this.estimateRedditRevenue(post),
          market: this.analyzeRedditMarket(post),
          implementation: {
            timeline: '1-3ヶ月',
            resources: '調査・開発チーム',
            costs: '¥50-200万',
            milestones: ['市場調査', 'MVP開発', 'コミュニティテスト']
          },
          competitors: [],
          tags: [post.subreddit, category.toLowerCase(), 'community-driven'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      }
    })
    
    return opportunities
  }
  
  private async processTrends(rawData: any): Promise<ProcessedTrend[]> {
    const trends: ProcessedTrend[] = []
    
    // Analyze GitHub language trends
    const languageTrends = this.analyzeLanguageTrends(rawData.github)
    languageTrends.forEach(trend => {
      trends.push({
        name: `${trend.language} 技術トレンド`,
        description: `${trend.language}を使用したプロジェクトが急増中`,
        category: 'Programming Language',
        momentum: trend.momentum,
        adoption_stage: trend.momentum > 80 ? 'growing' : 'emerging',
        impact_level: trend.impact as 'low' | 'medium' | 'high' | 'transformative',
        evidence: [
          {
            source: 'GitHub',
            data: `${trend.count}件のプロジェクト`,
            stars: trend.totalStars
          }
        ],
        prediction: {
          timeframe: '6-12ヶ月',
          outcome: trend.prediction,
          confidence: trend.confidence
        },
        timeframe: '短期-中期 (6-12ヶ月)',
        confidence_score: trend.confidence,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    })
    
    // Analyze Reddit topic trends
    const redditTrends = this.analyzeRedditTrends(rawData.reddit)
    redditTrends.forEach(trend => {
      trends.push({
        name: trend.topic,
        description: trend.description,
        category: 'Market Sentiment', 
        momentum: trend.momentum,
        adoption_stage: 'emerging',
        impact_level: trend.impact as 'low' | 'medium' | 'high' | 'transformative',
        evidence: [
          {
            source: 'Reddit',
            data: `${trend.posts}件の投稿`,
            engagement: trend.totalEngagement
          }
        ],
        prediction: {
          timeframe: '3-6ヶ月',
          outcome: trend.prediction,
          confidence: trend.confidence
        },
        timeframe: '短期 (3-6ヶ月)',
        confidence_score: trend.confidence,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    })
    
    return trends
  }
  
  private async processCategories(rawData: any): Promise<ProcessedCategory[]> {
    const categories: ProcessedCategory[] = []
    const categoryMap = new Map<string, any>()
    
    // Aggregate GitHub data by category
    rawData.github.forEach((repo: any) => {
      const category = this.classifyGitHubCategory(repo)
      if (!categoryMap.has(category)) {
        categoryMap.set(category, {
          repos: [],
          totalStars: 0,
          languages: new Set()
        })
      }
      
      const catData = categoryMap.get(category)!
      catData.repos.push(repo)
      catData.totalStars += repo.stargazers_count || 0
      if (repo.language) catData.languages.add(repo.language)
    })
    
    // Convert to processed categories
    categoryMap.forEach((data, name) => {
      const growth = this.calculateCategoryGrowth(data)
      
      categories.push({
        name: name,
        parent_category: 'Technology',
        description: `${name}関連のツール・ライブラリ・フレームワーク`,
        total_apps: data.repos.length,
        growth: growth,
        market_size: this.estimateCategoryMarketSize(data),
        key_players: data.repos.slice(0, 5).map((r: any) => r.full_name),
        trends: Array.from(data.languages as Set<string>).slice(0, 3),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    })
    
    return categories
  }
  
  // Helper methods
  private classifyGitHubCategory(repo: any): string {
    const text = `${repo.name} ${repo.description || ''}`.toLowerCase()
    const topics = repo.topics || []
    const allText = `${text} ${topics.join(' ')}`
    
    if (/ai|artificial|intelligence|machine|learning|neural|gpt|llm/.test(allText)) {
      return 'AI/Machine Learning'
    }
    if (/web|frontend|backend|fullstack|react|vue|angular|next/.test(allText)) {
      return 'Web Development'
    }
    if (/mobile|ios|android|flutter|react-native/.test(allText)) {
      return 'Mobile Development'
    }
    if (/devops|docker|kubernetes|cloud|infrastructure/.test(allText)) {
      return 'DevOps/Infrastructure'
    }
    if (/data|analytics|visualization|database/.test(allText)) {
      return 'Data & Analytics'
    }
    if (/blockchain|crypto|web3|defi/.test(allText)) {
      return 'Blockchain/Web3'
    }
    if (/game|gaming|unity|unreal/.test(allText)) {
      return 'Gaming'
    }
    if (/security|crypto|encryption|auth/.test(allText)) {
      return 'Security'
    }
    
    return 'Developer Tools'
  }
  
  private analyzeGitHubMarket(repo: any) {
    const stars = repo.stargazers_count || 0
    const isNew = new Date(repo.created_at) > new Date(Date.now() - 180 * 24 * 60 * 60 * 1000) // 6 months
    
    return {
      marketSize: Math.min(90, 40 + (stars / 100)),
      growth: isNew ? Math.min(95, 70 + (stars / 50)) : Math.min(80, 50 + (stars / 200)),
      competition: stars > 10000 ? 80 : stars > 1000 ? 60 : 40,
      moat: repo.language ? 70 : 50,
      revenue: {
        model: 'Open Source + Commercial Support',
        potential: stars > 5000 ? '¥100-500万/月' : '¥10-100万/月',
        timeline: '6-12ヶ月'
      },
      market: {
        tam: '¥10-100億円',
        sam: '¥1-10億円', 
        som: '¥1000万-1億円'
      }
    }
  }
  
  private findGitHubCompetitors(repo: any): any[] {
    // Simplified competitor finding based on topics/language
    return []
  }
  
  private isBusinessOpportunity(post: any): boolean {
    const text = `${post.title} ${post.selftext}`.toLowerCase()
    const businessKeywords = [
      'startup', 'business', 'opportunity', 'market', 'demand',
      'customers', 'problem', 'solution', 'mvp', 'product',
      'saas', 'revenue', 'monetize', 'niche'
    ]
    
    return businessKeywords.some(keyword => text.includes(keyword)) && 
           post.score > 20 // Minimum engagement threshold
  }
  
  private classifyRedditOpportunity(post: any): string {
    const text = `${post.title} ${post.selftext}`.toLowerCase()
    
    if (/saas|software|platform/.test(text)) return 'SaaS'
    if (/ai|artificial|intelligence|automation/.test(text)) return 'AI/Automation'  
    if (/ecommerce|retail|marketplace/.test(text)) return 'E-commerce'
    if (/fintech|finance|payment|crypto/.test(text)) return 'FinTech'
    if (/health|medical|fitness/.test(text)) return 'HealthTech'
    if (/education|learning|course/.test(text)) return 'EdTech'
    
    return 'General Business'
  }
  
  private extractOpportunityTitle(title: string): string {
    // Clean and extract meaningful opportunity title
    return title.slice(0, 100).replace(/^\[.*?\]\s*/, '') + (title.length > 100 ? '...' : '')
  }
  
  private estimateRedditMarketSize(post: any): number {
    // Simple heuristic based on engagement and subreddit
    const baseScore = Math.min(80, 30 + (post.score / 10))
    const subredditBonus = this.getSubredditMarketMultiplier(post.subreddit)
    return Math.min(90, baseScore + subredditBonus)
  }
  
  private getSubredditMarketMultiplier(subreddit: string): number {
    const marketSizes = {
      'entrepreneur': 20,
      'startups': 15,
      'SaaS': 25,
      'technology': 10,
      'business': 15
    }
    return marketSizes[subreddit as keyof typeof marketSizes] || 5
  }
  
  private estimateRedditRevenue(post: any) {
    return {
      potential: '¥50-500万/月',
      model: 'Community-Validated Business',
      timeline: '3-9ヶ月'
    }
  }
  
  private analyzeRedditMarket(post: any) {
    return {
      tam: '¥1-50億円',
      sam: '¥1億-5億円',
      som: '¥1000万-5000万円'
    }
  }
  
  private analyzeLanguageTrends(repos: any[]) {
    const languageStats = new Map<string, any>()
    
    repos.forEach(repo => {
      if (!repo.language) return
      
      if (!languageStats.has(repo.language)) {
        languageStats.set(repo.language, {
          count: 0,
          totalStars: 0,
          repos: []
        })
      }
      
      const stats = languageStats.get(repo.language)!
      stats.count++
      stats.totalStars += repo.stargazers_count || 0
      stats.repos.push(repo)
    })
    
    return Array.from(languageStats.entries())
      .map(([language, stats]) => ({
        language,
        count: stats.count,
        totalStars: stats.totalStars,
        momentum: Math.min(100, 30 + (stats.totalStars / 100) + (stats.count * 5)),
        impact: stats.totalStars > 10000 ? 'high' : stats.totalStars > 1000 ? 'medium' : 'low',
        prediction: `${language}エコシステムの拡大継続`,
        confidence: Math.min(90, 60 + (stats.count * 5))
      }))
      .sort((a, b) => b.momentum - a.momentum)
      .slice(0, 10) // Top 10 languages
  }
  
  private analyzeRedditTrends(posts: any[]) {
    const topicStats = new Map<string, any>()
    
    posts.forEach(post => {
      const topics = this.extractTopics(post)
      topics.forEach(topic => {
        if (!topicStats.has(topic)) {
          topicStats.set(topic, {
            posts: 0,
            totalEngagement: 0,
            examples: []
          })
        }
        
        const stats = topicStats.get(topic)!
        stats.posts++
        stats.totalEngagement += post.score + post.num_comments
        if (stats.examples.length < 3) {
          stats.examples.push(post.title)
        }
      })
    })
    
    return Array.from(topicStats.entries())
      .map(([topic, stats]) => ({
        topic,
        posts: stats.posts,
        totalEngagement: stats.totalEngagement,
        momentum: Math.min(100, 20 + (stats.totalEngagement / 20) + (stats.posts * 10)),
        impact: stats.totalEngagement > 500 ? 'medium' : 'low',
        description: `${topic}関連の議論が活発化`,
        prediction: `${topic}分野での事業機会拡大`,
        confidence: Math.min(85, 50 + (stats.posts * 5))
      }))
      .filter(trend => trend.posts >= 2) // At least 2 posts
      .sort((a, b) => b.momentum - a.momentum)
      .slice(0, 10) // Top 10 topics
  }
  
  private extractTopics(post: any): string[] {
    const text = `${post.title} ${post.selftext}`.toLowerCase()
    const topics: string[] = []
    
    const topicPatterns = {
      'AI/ML': /ai|artificial|intelligence|machine learning|neural|deep learning/,
      'SaaS': /saas|software as a service|subscription|b2b software/,
      'E-commerce': /ecommerce|e-commerce|online store|marketplace|retail/,
      'FinTech': /fintech|finance|payment|banking|crypto|blockchain/,
      'Remote Work': /remote|work from home|distributed|async/,
      'No-Code': /no-code|nocode|low-code|visual programming/,
      'Creator Economy': /creator|content|influencer|monetization/,
      'Sustainability': /sustainability|green|climate|environment/
    }
    
    Object.entries(topicPatterns).forEach(([topic, pattern]) => {
      if (pattern.test(text)) {
        topics.push(topic)
      }
    })
    
    return topics.length > 0 ? topics : ['General']
  }
  
  private calculateCategoryGrowth(data: any): string {
    const avgStars = data.totalStars / data.repos.length
    if (avgStars > 1000) return '+25%'
    if (avgStars > 500) return '+18%'
    if (avgStars > 100) return '+12%'
    return '+8%'
  }
  
  private estimateCategoryMarketSize(data: any): string {
    const totalStars = data.totalStars
    if (totalStars > 50000) return '¥100億円+'
    if (totalStars > 10000) return '¥50億円+'
    if (totalStars > 1000) return '¥10億円+'
    return '¥1億円+'
  }
  
  private async clearMockData(): Promise<void> {
    await Promise.all([
      supabase.from('opportunities').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
      supabase.from('trends').delete().neq('id', '00000000-0000-0000-0000-000000000000'),
      supabase.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    ])
  }
  
  private async insertOpportunities(opportunities: ProcessedOpportunity[]): Promise<any[]> {
    const { data, error } = await supabase
      .from('opportunities')
      .insert(opportunities)
      .select()
    
    if (error) {
      console.error('Failed to insert opportunities:', error)
      throw error
    }
    
    return data || []
  }
  
  private async insertTrends(trends: ProcessedTrend[]): Promise<any[]> {
    const { data, error } = await supabase
      .from('trends')
      .insert(trends)
      .select()
    
    if (error) {
      console.error('Failed to insert trends:', error)
      throw error
    }
    
    return data || []
  }
  
  private async insertCategories(categories: ProcessedCategory[]): Promise<any[]> {
    const { data, error } = await supabase
      .from('categories')
      .insert(categories)
      .select()
    
    if (error) {
      console.error('Failed to insert categories:', error)
      throw error
    }
    
    return data || []
  }
  
  private async logCollection(summary: any): Promise<void> {
    await supabase
      .from('collection_logs')
      .insert({
        source: 'RealDataSeeder',
        status: 'success',
        data_count: summary.totalDataPoints,
        metadata: summary,
        created_at: new Date().toISOString()
      })
  }
}

// Export for CLI usage
export const realDataSeeder = new RealDataSeeder()