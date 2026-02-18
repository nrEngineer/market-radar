/* ═══════════════════════════════════════════════════════════════
   Free Data Sources Integration - Zero Cost Market Intelligence
   ROI-focused approach using only free/low-cost APIs
   ═══════════════════════════════════════════════════════════════ */

// ── GitHub Trending API (Completely Free) ──
interface GitHubRepo {
  name: string;
  full_name: string;
  description: string;
  stargazers_count: number;
  language: string;
  created_at: string;
  updated_at: string;
  topics: string[];
  homepage: string;
}

export class GitHubTrendingAPI {
  private baseUrl = 'https://api.github.com';
  
  async getTrendingRepos(timeframe: '24h' | '7d' | '30d' = '7d'): Promise<GitHubRepo[]> {
    const dateThreshold = this.getDateThreshold(timeframe);
    
    try {
      const response = await fetch(
        `${this.baseUrl}/search/repositories?q=created:>${dateThreshold}&sort=stars&order=desc&per_page=100`,
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'MarketRadar/1.0',
            // Optional: Add GitHub token for higher rate limits
            ...(process.env.GITHUB_TOKEN && {
              'Authorization': `token ${process.env.GITHUB_TOKEN}`
            })
          }
        }
      );
      
      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error('GitHub Trending API error:', error);
      return [];
    }
  }
  
  async getTrendingTopics(): Promise<string[]> {
    const repos = await this.getTrendingRepos('7d');
    const topicCounts: Record<string, number> = {};
    
    repos.forEach(repo => {
      repo.topics?.forEach(topic => {
        topicCounts[topic] = (topicCounts[topic] || 0) + repo.stargazers_count;
      });
    });
    
    return Object.entries(topicCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 20)
      .map(([topic]) => topic);
  }
  
  private getDateThreshold(timeframe: string): string {
    const now = new Date();
    const days = timeframe === '24h' ? 1 : timeframe === '7d' ? 7 : 30;
    now.setDate(now.getDate() - days);
    return now.toISOString().split('T')[0];
  }
}

// ── Reddit API (Free Tier) ──
interface RedditPost {
  title: string;
  selftext: string;
  score: number;
  num_comments: number;
  author: string;
  created_utc: number;
  subreddit: string;
  url: string;
  permalink: string;
}

export class RedditMarketAPI {
  private baseUrl = 'https://www.reddit.com';
  private targetSubreddits = [
    'startups',
    'entrepreneur', 
    'SaaS',
    'ProductHunt',
    'IndieBiz',
    'technology',
    'artificial',
    'MachineLearning'
  ];
  
  async getMarketSignals(limit = 25): Promise<RedditPost[]> {
    const allPosts: RedditPost[] = [];
    
    for (const subreddit of this.targetSubreddits) {
      try {
        const posts = await this.getSubredditPosts(subreddit, limit);
        allPosts.push(...posts);
        
        // Rate limiting: 1 request per second
        await this.sleep(1000);
      } catch (error) {
        console.error(`Reddit API error for r/${subreddit}:`, error);
      }
    }
    
    return allPosts
      .filter(post => post.score > 10) // Filter quality posts
      .sort((a, b) => b.score - a.score)
      .slice(0, 100);
  }
  
  private async getSubredditPosts(subreddit: string, limit: number): Promise<RedditPost[]> {
    const response = await fetch(
      `${this.baseUrl}/r/${subreddit}/hot.json?limit=${limit}`,
      {
        headers: {
          'User-Agent': 'MarketRadar/1.0 (Educational Research)'
        }
      }
    );
    
    const data = await response.json();
    return data.data?.children?.map((child: any) => child.data) || [];
  }
  
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ── Google Trends Integration (Free) ──
interface TrendData {
  keyword: string;
  interest: number;
  relatedQueries: string[];
  risingQueries: string[];
  region: string;
}

export class GoogleTrendsAPI {
  // Note: Google Trends doesn't have official API, using trending search data
  // Alternative: Use Google Trends RSS feeds and search data
  
  async getTechTrends(): Promise<TrendData[]> {
    // Implementation would use Google Trends unofficial API or scraping
    // For now, return structured data format
    return [
      {
        keyword: 'AI agents',
        interest: 89,
        relatedQueries: ['autonomous agents', 'AI automation', 'agent frameworks'],
        risingQueries: ['LangGraph', 'CrewAI', 'AutoGPT alternatives'],
        region: 'JP'
      },
      {
        keyword: 'no code SaaS',
        interest: 67,
        relatedQueries: ['no code platforms', 'visual programming', 'citizen developer'],
        risingQueries: ['Bubble alternatives', 'Webflow apps', 'no code AI'],
        region: 'JP'
      }
    ];
  }
}

// ── SEC EDGAR API (Free) ──
interface SECFiling {
  company: string;
  cik: string;
  form: string;
  filingDate: string;
  reportDate: string;
  acceptanceDateTime: string;
  accessionNumber: string;
  filingHtml: string;
}

export class SECFilingsAPI {
  private baseUrl = 'https://data.sec.gov';
  
  async getRecentAcquisitions(days = 30): Promise<SECFiling[]> {
    try {
      // Search for 8-K forms (current reports) that often contain M&A announcements
      const response = await fetch(
        `${this.baseUrl}/api/xbrl/companyfacts.zip`, // Simplified for example
        {
          headers: {
            'User-Agent': 'MarketRadar research@marketradar.com',
            'Accept-Encoding': 'gzip, deflate',
            'Host': 'data.sec.gov'
          }
        }
      );
      
      // Process SEC data (implementation would parse XBRL/JSON data)
      return this.processSecData(await response.text());
    } catch (error) {
      console.error('SEC API error:', error);
      return [];
    }
  }
  
  private processSecData(rawData: string): SECFiling[] {
    // Implementation would parse actual SEC filings
    // Return structured data for now
    return [];
  }
}

// ── Press Release Scanner (Free) ──
interface PressRelease {
  title: string;
  content: string;
  company: string;
  date: string;
  source: string;
  url: string;
  category: 'acquisition' | 'funding' | 'partnership' | 'product' | 'other';
}

export class PressReleaseScanner {
  private sources = [
    'https://www.prnewswire.com/news-releases/',
    'https://prtimes.jp/main/action.php?run=html&page=ReleaseList',
    'https://kyodonewsprwire.jp/release/'
  ];
  
  async scanForMAActivity(): Promise<PressRelease[]> {
    const releases: PressRelease[] = [];
    
    for (const source of this.sources) {
      try {
        const sourceReleases = await this.scanSource(source);
        releases.push(...sourceReleases);
        
        // Rate limiting
        await this.sleep(2000);
      } catch (error) {
        console.error(`Press release scanning error for ${source}:`, error);
      }
    }
    
    return releases.filter(r => this.isMARelated(r));
  }
  
  private async scanSource(sourceUrl: string): Promise<PressRelease[]> {
    // Implementation would scrape press release sites
    // Return mock data for structure
    return [
      {
        title: 'Tech Company A Acquires Startup B for Strategic Expansion',
        content: 'Technology company announces acquisition to strengthen AI capabilities...',
        company: 'Tech Company A',
        date: new Date().toISOString(),
        source: sourceUrl,
        url: 'https://example.com/press-release',
        category: 'acquisition'
      }
    ];
  }
  
  private isMARelated(release: PressRelease): boolean {
    const maKeywords = [
      'acquisition', 'acquire', 'merger', 'merge',
      'investment', 'funding', 'strategic partnership',
      '買収', '統合', '資金調達', '出資', '戦略的提携'
    ];
    
    const text = `${release.title} ${release.content}`.toLowerCase();
    return maKeywords.some(keyword => text.includes(keyword.toLowerCase()));
  }
  
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ── Unified Free Data Collector ──
export class FreeDataCollector {
  private github = new GitHubTrendingAPI();
  private reddit = new RedditMarketAPI();
  private trends = new GoogleTrendsAPI();
  private sec = new SECFilingsAPI();
  private pressScanner = new PressReleaseScanner();
  
  async collectAllMarketData() {
    console.log('🔄 Starting free data collection...');
    
    const [
      githubRepos,
      redditPosts, 
      trendingTopics,
      techTrends,
      secFilings,
      pressReleases
    ] = await Promise.allSettled([
      this.github.getTrendingRepos('7d'),
      this.reddit.getMarketSignals(25),
      this.github.getTrendingTopics(),
      this.trends.getTechTrends(),
      this.sec.getRecentAcquisitions(30),
      this.pressScanner.scanForMAActivity()
    ]);
    
    const collectionSummary = {
      timestamp: new Date().toISOString(),
      sources: {
        github: githubRepos.status === 'fulfilled' ? githubRepos.value.length : 0,
        reddit: redditPosts.status === 'fulfilled' ? redditPosts.value.length : 0,
        trends: techTrends.status === 'fulfilled' ? techTrends.value.length : 0,
        sec: secFilings.status === 'fulfilled' ? secFilings.value.length : 0,
        press: pressReleases.status === 'fulfilled' ? pressReleases.value.length : 0
      },
      totalDataPoints: Object.values({
        github: githubRepos.status === 'fulfilled' ? githubRepos.value.length : 0,
        reddit: redditPosts.status === 'fulfilled' ? redditPosts.value.length : 0,
        trends: techTrends.status === 'fulfilled' ? techTrends.value.length : 0,
        sec: secFilings.status === 'fulfilled' ? secFilings.value.length : 0,
        press: pressReleases.status === 'fulfilled' ? pressReleases.value.length : 0
      }).reduce((sum, count) => sum + count, 0)
    };
    
    console.log('✅ Free data collection completed:', collectionSummary);
    
    return {
      github: githubRepos.status === 'fulfilled' ? githubRepos.value : [],
      reddit: redditPosts.status === 'fulfilled' ? redditPosts.value : [],
      trends: techTrends.status === 'fulfilled' ? techTrends.value : [],
      sec: secFilings.status === 'fulfilled' ? secFilings.value : [],
      press: pressReleases.status === 'fulfilled' ? pressReleases.value : [],
      summary: collectionSummary
    };
  }
}

// Export for use in API routes
export const freeDataCollector = new FreeDataCollector();