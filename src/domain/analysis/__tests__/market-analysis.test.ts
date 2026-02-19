import { describe, it, expect } from 'vitest'
import {
  classifyRepoCategory,
  analyzeSentiment,
  classifyRedditPost,
  calculateTrendMomentum,
  calculateTrendConfidence,
  identifyOpportunities,
  assessRisks,
  predictTimeframe,
  categorizeImpact,
  calculateConfidence,
  analyzeGitHubTrends,
  analyzeRedditSignals,
  generateRecommendations,
  type GitHubRepo,
  type RedditPost,
  type MarketSignal,
  type MarketSignalMap,
} from '../market-analysis'

// Helper to create GitHubRepo with required fields
const repo = (overrides: Partial<GitHubRepo> & { name: string; stargazers_count: number }): GitHubRepo => ({
  description: null,
  language: null,
  ...overrides,
})

// ── classifyRepoCategory ──────────────────────────────────────

describe('classifyRepoCategory', () => {
  it('should classify AI/ML repos', () => {
    expect(classifyRepoCategory(repo({ name: 'gpt-agent', description: 'AI tool', stargazers_count: 100 }))).toBe('AI/ML')
    expect(classifyRepoCategory(repo({ name: 'test', description: 'machine learning lib', stargazers_count: 1 }))).toBe('AI/ML')
    expect(classifyRepoCategory(repo({ name: 'llm-runner', stargazers_count: 1 }))).toBe('AI/ML')
  })

  it('should classify Developer Tools', () => {
    expect(classifyRepoCategory(repo({ name: 'my-sdk', description: 'a developer toolkit', stargazers_count: 1 }))).toBe('Developer Tools')
    expect(classifyRepoCategory(repo({ name: 'cli-helper', description: 'command line', stargazers_count: 1 }))).toBe('Developer Tools')
  })

  it('should classify Web Development', () => {
    expect(classifyRepoCategory(repo({ name: 'app', description: 'react frontend app', stargazers_count: 1 }))).toBe('Web Development')
    expect(classifyRepoCategory(repo({ name: 'vue-app', stargazers_count: 1 }))).toBe('Web Development')
  })

  it('should classify Data & Analytics', () => {
    expect(classifyRepoCategory(repo({ name: 'dashboard', description: 'data visualization', stargazers_count: 1 }))).toBe('Data & Analytics')
  })

  it('should classify DevOps/Infrastructure', () => {
    expect(classifyRepoCategory(repo({ name: 'deploy', description: 'kubernetes setup', stargazers_count: 1 }))).toBe('DevOps/Infrastructure')
    expect(classifyRepoCategory(repo({ name: 'docker-compose', stargazers_count: 1 }))).toBe('DevOps/Infrastructure')
  })

  it('should return "Other" for unmatched repos', () => {
    expect(classifyRepoCategory(repo({ name: 'myproject', description: 'a nice thing', stargazers_count: 1 }))).toBe('Other')
  })

  it('should use topics for classification', () => {
    expect(classifyRepoCategory(repo({ name: 'x', stargazers_count: 1, topics: ['neural-network'] }))).toBe('AI/ML')
  })

  it('should prioritize AI/ML over other categories', () => {
    // "ai" matches AI/ML, "framework" matches Developer Tools — AI/ML comes first
    expect(classifyRepoCategory(repo({ name: 'ai-framework', stargazers_count: 1 }))).toBe('AI/ML')
  })
})

// ── analyzeSentiment ──────────────────────────────────────────

describe('analyzeSentiment', () => {
  it('should return positive when positive words dominate', () => {
    const post: RedditPost = { title: 'great amazing growth', selftext: '', score: 10, num_comments: 5, subreddit: 'test' }
    expect(analyzeSentiment(post)).toBe('positive')
  })

  it('should return negative when negative words dominate', () => {
    const post: RedditPost = { title: 'failed problem issue', selftext: '', score: 10, num_comments: 5, subreddit: 'test' }
    expect(analyzeSentiment(post)).toBe('negative')
  })

  it('should return neutral when counts are equal', () => {
    const post: RedditPost = { title: 'great but failed', selftext: '', score: 10, num_comments: 5, subreddit: 'test' }
    expect(analyzeSentiment(post)).toBe('neutral')
  })

  it('should be case insensitive', () => {
    const post: RedditPost = { title: 'GREAT AMAZING', selftext: '', score: 10, num_comments: 5, subreddit: 'test' }
    expect(analyzeSentiment(post)).toBe('positive')
  })

  it('should consider selftext as well', () => {
    const post: RedditPost = { title: '', selftext: 'opportunity for growth', score: 10, num_comments: 5, subreddit: 'test' }
    expect(analyzeSentiment(post)).toBe('positive')
  })
})

// ── classifyRedditPost ────────────────────────────────────────

describe('classifyRedditPost', () => {
  const makePost = (title: string): RedditPost => ({ title, selftext: '', score: 10, num_comments: 5, subreddit: 'test' })

  it('should classify Funding posts', () => {
    expect(classifyRedditPost(makePost('Series A funding round'))).toBe('Funding')
    expect(classifyRedditPost(makePost('seed investment news'))).toBe('Funding')
  })

  it('should classify Product Launch posts', () => {
    expect(classifyRedditPost(makePost('Just launched my startup MVP'))).toBe('Product Launch')
  })

  it('should classify M&A posts', () => {
    expect(classifyRedditPost(makePost('Company acquired by Big Corp'))).toBe('M&A')
  })

  it('should classify AI/Tech posts', () => {
    expect(classifyRedditPost(makePost('New GPT automation tool'))).toBe('AI/Tech')
  })

  it('should classify SaaS posts', () => {
    expect(classifyRedditPost(makePost('Best SaaS platform for teams'))).toBe('SaaS')
  })

  it('should return General for unmatched posts', () => {
    expect(classifyRedditPost(makePost('Random discussion about weather'))).toBe('General')
  })

  it('should prioritize Funding over AI/Tech', () => {
    expect(classifyRedditPost(makePost('AI startup raises series B funding'))).toBe('Funding')
  })
})

// ── calculateTrendMomentum ────────────────────────────────────

describe('calculateTrendMomentum', () => {
  it('should return 0 for empty signal', () => {
    const signal: MarketSignal = { category: 'test', sources: [] }
    expect(calculateTrendMomentum(signal)).toBe(0)
  })

  it('should add techMomentum component (max 40)', () => {
    const signal: MarketSignal = { category: 'test', techMomentum: 40000, sources: ['github'] }
    expect(calculateTrendMomentum(signal)).toBe(40)
  })

  it('should cap techMomentum contribution at 40', () => {
    const signal: MarketSignal = { category: 'test', techMomentum: 999999, sources: ['github'] }
    expect(calculateTrendMomentum(signal)).toBe(40)
  })

  it('should add socialMomentum component (max 30)', () => {
    const signal: MarketSignal = { category: 'test', socialMomentum: 300, sources: ['reddit'] }
    expect(calculateTrendMomentum(signal)).toBe(30)
  })

  it('should add 20 for positive sentiment', () => {
    const signal: MarketSignal = { category: 'test', marketSentiment: 'positive', sources: ['reddit'] }
    expect(calculateTrendMomentum(signal)).toBe(20)
  })

  it('should add 10 for multi-source', () => {
    const signal: MarketSignal = { category: 'test', sources: ['github', 'reddit'] }
    expect(calculateTrendMomentum(signal)).toBe(10)
  })

  it('should cap total at 100', () => {
    const signal: MarketSignal = {
      category: 'test',
      techMomentum: 999999,
      socialMomentum: 999999,
      marketSentiment: 'positive',
      sources: ['github', 'reddit'],
    }
    expect(calculateTrendMomentum(signal)).toBe(100)
  })

  it('should not add sentiment bonus for negative sentiment', () => {
    const signal: MarketSignal = { category: 'test', marketSentiment: 'negative', sources: ['x'] }
    expect(calculateTrendMomentum(signal)).toBe(0)
  })
})

// ── calculateTrendConfidence ──────────────────────────────────

describe('calculateTrendConfidence', () => {
  it('should start at base confidence of 60', () => {
    const signal: MarketSignal = { category: 'test', sources: ['github'] }
    expect(calculateTrendConfidence(signal)).toBe(60)
  })

  it('should add 20 for multi-source', () => {
    const signal: MarketSignal = { category: 'test', sources: ['github', 'reddit'] }
    expect(calculateTrendConfidence(signal)).toBe(80)
  })

  it('should add 15 for both tech and social momentum', () => {
    const signal: MarketSignal = { category: 'test', techMomentum: 100, socialMomentum: 50, sources: ['x'] }
    expect(calculateTrendConfidence(signal)).toBe(75)
  })

  it('should add 5 for positive sentiment', () => {
    const signal: MarketSignal = { category: 'test', marketSentiment: 'positive', sources: ['x'] }
    expect(calculateTrendConfidence(signal)).toBe(65)
  })

  it('should cap at 95', () => {
    const signal: MarketSignal = {
      category: 'test',
      techMomentum: 100,
      socialMomentum: 50,
      marketSentiment: 'positive',
      sources: ['github', 'reddit'],
    }
    // 60 + 20 + 15 + 5 = 100 → capped at 95
    expect(calculateTrendConfidence(signal)).toBe(95)
  })
})

// ── predictTimeframe & categorizeImpact ───────────────────────

describe('predictTimeframe', () => {
  it('should return immediate for momentum > 80', () => {
    expect(predictTimeframe(85)).toContain('immediate')
  })

  it('should return near-term for momentum 61-80', () => {
    expect(predictTimeframe(65)).toContain('near-term')
  })

  it('should return medium-term for momentum 41-60', () => {
    expect(predictTimeframe(50)).toContain('medium-term')
  })

  it('should return long-term for momentum <= 40', () => {
    expect(predictTimeframe(30)).toContain('long-term')
  })
})

describe('categorizeImpact', () => {
  it('should return transformative for momentum > 85', () => {
    expect(categorizeImpact(90)).toBe('transformative')
  })

  it('should return high for momentum 71-85', () => {
    expect(categorizeImpact(75)).toBe('high')
  })

  it('should return medium for momentum 51-70', () => {
    expect(categorizeImpact(55)).toBe('medium')
  })

  it('should return low for momentum <= 50', () => {
    expect(categorizeImpact(40)).toBe('low')
  })
})

// ── calculateConfidence ───────────────────────────────────────

describe('calculateConfidence', () => {
  it('should return 85 for > 200 data points', () => {
    expect(calculateConfidence(250)).toBe(85)
  })

  it('should return 75 for > 100 data points', () => {
    expect(calculateConfidence(150)).toBe(75)
  })

  it('should return 65 for > 50 data points', () => {
    expect(calculateConfidence(60)).toBe(65)
  })

  it('should return 55 for <= 50 data points', () => {
    expect(calculateConfidence(30)).toBe(55)
  })
})

// ── identifyOpportunities ─────────────────────────────────────

describe('identifyOpportunities', () => {
  it('should filter signals with momentum > 40', () => {
    const signals: MarketSignalMap = {
      strong: { category: 'AI/ML', techMomentum: 50000, sources: ['github', 'reddit'], marketSentiment: 'positive' },
      weak: { category: 'Other', sources: ['github'] },
    }
    const opps = identifyOpportunities(signals)
    expect(opps.length).toBe(1)
    expect(opps[0].category).toBe('AI/ML')
  })

  it('should sort by score descending', () => {
    const signals: MarketSignalMap = {
      a: { category: 'A', techMomentum: 20000, sources: ['github'] },
      b: { category: 'B', techMomentum: 40000, sources: ['github', 'reddit'], marketSentiment: 'positive' },
    }
    const opps = identifyOpportunities(signals)
    expect(opps[0].category).toBe('B')
  })

  it('should limit to 5 results', () => {
    const signals: MarketSignalMap = {}
    for (let i = 0; i < 10; i++) {
      signals[`cat${i}`] = { category: `Cat${i}`, techMomentum: 30000, sources: ['github', 'reddit'], marketSentiment: 'positive' }
    }
    expect(identifyOpportunities(signals).length).toBeLessThanOrEqual(5)
  })

  it('should set competition level based on momentum', () => {
    const signals: MarketSignalMap = {
      high: { category: 'High', techMomentum: 40000, socialMomentum: 300, marketSentiment: 'positive', sources: ['a', 'b'] },
    }
    const opps = identifyOpportunities(signals)
    expect(opps[0].competitionLevel).toBe('high')
  })
})

// ── assessRisks ───────────────────────────────────────────────

describe('assessRisks', () => {
  it('should detect high competition risk when >3 signals have momentum >70', () => {
    const signals: MarketSignalMap = {}
    for (let i = 0; i < 5; i++) {
      signals[`cat${i}`] = {
        category: `Cat${i}`,
        techMomentum: 40000,
        socialMomentum: 300,
        marketSentiment: 'positive',
        sources: ['a', 'b'],
      }
    }
    const risks = assessRisks(signals)
    expect(risks.some(r => r.risk.includes('competition'))).toBe(true)
  })

  it('should detect market concentration risk when techMomentum > 10000', () => {
    const signals: MarketSignalMap = {
      big: { category: 'Big', techMomentum: 20000, sources: ['github'] },
    }
    const risks = assessRisks(signals)
    expect(risks.some(r => r.risk.includes('dominated'))).toBe(true)
  })

  it('should detect negative sentiment risk', () => {
    const signals: MarketSignalMap = {
      neg: { category: 'Neg', marketSentiment: 'negative', sources: ['reddit'] },
    }
    const risks = assessRisks(signals)
    expect(risks.some(r => r.risk.includes('Negative'))).toBe(true)
  })

  it('should detect data sparsity risk when most signals have single source', () => {
    const signals: MarketSignalMap = {
      a: { category: 'A', sources: ['github'] },
      b: { category: 'B', sources: ['reddit'] },
      c: { category: 'C', sources: ['github'] },
    }
    const risks = assessRisks(signals)
    expect(risks.some(r => r.risk.includes('Limited data'))).toBe(true)
  })

  it('should sort risks by probability * impact descending', () => {
    const signals: MarketSignalMap = {
      big: { category: 'Big', techMomentum: 20000, marketSentiment: 'negative', sources: ['github'] },
      a: { category: 'A', sources: ['github'] },
      b: { category: 'B', sources: ['reddit'] },
      c: { category: 'C', sources: ['github'] },
    }
    const risks = assessRisks(signals)
    for (let i = 1; i < risks.length; i++) {
      const prevScore = risks[i - 1].probability * risks[i - 1].impact
      const currScore = risks[i].probability * risks[i].impact
      expect(prevScore).toBeGreaterThanOrEqual(currScore)
    }
  })

  it('should return empty array for benign signals', () => {
    const signals: MarketSignalMap = {
      a: { category: 'A', techMomentum: 100, sources: ['github', 'reddit'] },
    }
    const risks = assessRisks(signals)
    expect(risks.length).toBe(0)
  })
})

// ── analyzeGitHubTrends ───────────────────────────────────────

describe('analyzeGitHubTrends', () => {
  it('should aggregate stars by category', () => {
    const repos: GitHubRepo[] = [
      repo({ name: 'ai-tool', description: 'machine learning', stargazers_count: 1000 }),
      repo({ name: 'ai-bot', description: 'neural network', stargazers_count: 2000 }),
    ]
    const trends = analyzeGitHubTrends(repos)
    expect(trends[0].category).toBe('AI/ML')
    expect(trends[0].momentum).toBe(3000)
    expect(trends[0].source).toBe('github')
  })

  it('should sort by momentum descending and limit to 10', () => {
    const repos: GitHubRepo[] = Array.from({ length: 15 }, (_, i) =>
      repo({ name: `project-${i}`, stargazers_count: i * 100 })
    )
    const trends = analyzeGitHubTrends(repos)
    expect(trends.length).toBeLessThanOrEqual(10)
  })

  it('should handle empty repos array', () => {
    expect(analyzeGitHubTrends([])).toEqual([])
  })
})

// ── analyzeRedditSignals ──────────────────────────────────────

describe('analyzeRedditSignals', () => {
  it('should filter posts with engagement > 50', () => {
    const posts: RedditPost[] = [
      { title: 'Great AI startup launch', selftext: '', score: 100, num_comments: 50, subreddit: 'startups' },
      { title: 'Low engagement', selftext: '', score: 10, num_comments: 5, subreddit: 'test' },
    ]
    const signals = analyzeRedditSignals(posts)
    expect(signals.length).toBe(1)
    expect(signals[0].engagement).toBe(150)
  })

  it('should sort by engagement descending and limit to 20', () => {
    const posts: RedditPost[] = Array.from({ length: 30 }, (_, i) => ({
      title: `Post ${i} about great funding`,
      selftext: '',
      score: 100 + i * 10,
      num_comments: 50 + i,
      subreddit: 'startups',
    }))
    const signals = analyzeRedditSignals(posts)
    expect(signals.length).toBeLessThanOrEqual(20)
    for (let i = 1; i < signals.length; i++) {
      expect(signals[i - 1].engagement).toBeGreaterThanOrEqual(signals[i].engagement)
    }
  })
})

// ── generateRecommendations ───────────────────────────────────

describe('generateRecommendations', () => {
  it('should generate top opportunity recommendation when momentum > 60', () => {
    const signals: MarketSignalMap = {
      ai: { category: 'AI/ML', techMomentum: 40000, sources: ['github', 'reddit'], marketSentiment: 'positive' },
    }
    const recs = generateRecommendations(signals)
    expect(recs.some(r => r.priority === 'high' && r.action.includes('AI/ML'))).toBe(true)
  })

  it('should return empty recommendations for empty signals', () => {
    expect(generateRecommendations({})).toEqual([])
  })
})
