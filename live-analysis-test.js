// Live Analysis Test - Claude Processing Real Data
async function performLiveAnalysis() {
  console.log('🧠 Claude Analysis Engine - Real Data Processing\n')
  
  try {
    // Step 1: Get real data
    console.log('📊 Collecting real market data...')
    const githubResponse = await fetch('https://api.github.com/search/repositories?q=created:>2026-02-15&sort=stars&order=desc&per_page=10')
    const githubData = await githubResponse.json()
    
    const redditResponse = await fetch('https://www.reddit.com/r/startups/hot.json?limit=10', {
      headers: { 'User-Agent': 'MarketRadar/1.0' }
    })
    const redditData = await redditResponse.json()
    
    // Step 2: Claude Analysis (Simulating what our actual system would do)
    console.log('🔍 Analyzing market signals with Claude-level intelligence...\n')
    
    // Analyze GitHub trends
    const githubInsights = analyzeGitHubData(githubData.items || [])
    console.log('🚀 GitHub Market Intelligence:')
    githubInsights.forEach(insight => {
      console.log(`• ${insight.trend} (Momentum: ${insight.momentum}/100)`)
      console.log(`  Evidence: ${insight.evidence}`)
      console.log(`  Market Impact: ${insight.impact}`)
      console.log('')
    })
    
    // Analyze Reddit sentiment
    const redditInsights = analyzeRedditData(redditData.data?.children || [])
    console.log('💬 Reddit Market Sentiment:')
    redditInsights.forEach(insight => {
      console.log(`• ${insight.topic} (Engagement: ${insight.engagement})`)
      console.log(`  Signal: ${insight.signal}`)
      console.log('')
    })
    
    // Generate strategic recommendations
    console.log('🎯 Strategic Market Recommendations:')
    const recommendations = generateRecommendations(githubInsights, redditInsights)
    recommendations.forEach((rec, i) => {
      console.log(`${i+1}. ${rec.action}`)
      console.log(`   Rationale: ${rec.rationale}`)
      console.log(`   Timeline: ${rec.timeline}`)
      console.log(`   ROI Potential: ${rec.roi}`)
      console.log('')
    })
    
  } catch (error) {
    console.error('❌ Analysis failed:', error.message)
  }
}

function analyzeGitHubData(repos) {
  const insights = []
  
  // Trend 1: AI Agent Infrastructure
  const aiAgentRepos = repos.filter(r => 
    (r.name + (r.description || '')).toLowerCase().includes('agent') ||
    (r.name + (r.description || '')).toLowerCase().includes('ai assistant')
  )
  
  if (aiAgentRepos.length > 0) {
    const totalStars = aiAgentRepos.reduce((sum, r) => sum + r.stargazers_count, 0)
    insights.push({
      trend: 'AI Agent Infrastructure Boom',
      momentum: Math.min(100, 60 + totalStars / 20),
      evidence: `${aiAgentRepos.length} projects, ${totalStars} total stars`,
      impact: totalStars > 500 ? 'High - Early market formation' : 'Medium - Emerging trend',
      timeframe: '3-6 months',
      examples: aiAgentRepos.map(r => r.name).join(', ')
    })
  }
  
  // Trend 2: CUDA/GPU Computing
  const gpuRepos = repos.filter(r => 
    (r.name + (r.description || '')).toLowerCase().includes('cuda') ||
    (r.name + (r.description || '')).toLowerCase().includes('gpu')
  )
  
  if (gpuRepos.length > 0) {
    const totalStars = gpuRepos.reduce((sum, r) => sum + r.stargazers_count, 0)
    insights.push({
      trend: 'GPU Computing Diversification', 
      momentum: Math.min(100, 50 + totalStars / 15),
      evidence: `${gpuRepos.length} projects, ${totalStars} total stars`,
      impact: 'High - Breaking NVIDIA monopoly',
      timeframe: '6-12 months',
      examples: gpuRepos.map(r => r.name).join(', ')
    })
  }
  
  // Trend 3: Low-level AI Systems
  const lowLevelRepos = repos.filter(r => 
    ['C', 'Rust', 'Zig', 'Go'].includes(r.language)
  )
  
  if (lowLevelRepos.length > 2) {
    const totalStars = lowLevelRepos.reduce((sum, r) => sum + r.stargazers_count, 0)
    insights.push({
      trend: 'Performance-First AI Systems',
      momentum: Math.min(100, 40 + totalStars / 30),
      evidence: `${lowLevelRepos.length} low-level projects`,
      impact: 'Medium-High - Efficiency over convenience',
      timeframe: '6-18 months', 
      examples: lowLevelRepos.map(r => `${r.name} (${r.language})`).join(', ')
    })
  }
  
  return insights
}

function analyzeRedditData(posts) {
  const insights = []
  
  // Analyze startup sentiment
  const businessPosts = posts.filter(p => {
    const text = (p.data.title + (p.data.selftext || '')).toLowerCase()
    return text.includes('startup') || text.includes('business') || text.includes('raise')
  })
  
  if (businessPosts.length > 0) {
    const avgScore = businessPosts.reduce((sum, p) => sum + p.data.score, 0) / businessPosts.length
    const totalComments = businessPosts.reduce((sum, p) => sum + p.data.num_comments, 0)
    
    insights.push({
      topic: 'Startup Ecosystem Health',
      engagement: Math.round(avgScore),
      signal: avgScore > 50 ? 'Positive - High community interest' : 
              avgScore > 20 ? 'Neutral - Moderate interest' : 
              'Negative - Low engagement',
      evidence: `${businessPosts.length} posts, ${totalComments} total comments`
    })
  }
  
  // Analyze funding sentiment
  const fundingPosts = posts.filter(p => {
    const text = (p.data.title + (p.data.selftext || '')).toLowerCase()
    return text.includes('funding') || text.includes('investment') || text.includes('raise')
  })
  
  if (fundingPosts.length > 0) {
    const avgScore = fundingPosts.reduce((sum, p) => sum + p.data.score, 0) / fundingPosts.length
    
    insights.push({
      topic: 'Funding Environment',
      engagement: Math.round(avgScore),
      signal: avgScore > 30 ? 'Favorable - Active funding discussions' :
              'Cautious - Limited funding activity',
      evidence: `${fundingPosts.length} funding-related posts`
    })
  }
  
  return insights
}

function generateRecommendations(githubInsights, redditInsights) {
  const recommendations = []
  
  // Based on AI Agent trend
  const aiAgentTrend = githubInsights.find(i => i.trend.includes('AI Agent'))
  if (aiAgentTrend && aiAgentTrend.momentum > 70) {
    recommendations.push({
      action: 'Accelerate AI Agent Infrastructure Investment',
      rationale: `${aiAgentTrend.momentum}/100 momentum detected. Early-stage market formation with ${aiAgentTrend.evidence}`,
      timeline: '次の3ヶ月以内',
      roi: '高 - First-mover advantage in emerging market',
      risk: '中 - 技術的複雑性、競合参入リスク'
    })
  }
  
  // Based on GPU computing trend
  const gpuTrend = githubInsights.find(i => i.trend.includes('GPU'))
  if (gpuTrend) {
    recommendations.push({
      action: 'Monitor GPU Computing Alternatives',
      rationale: `NVIDIA dependency reduction trend. ${gpuTrend.evidence}`,
      timeline: '6ヶ月以内の市場参入準備',
      roi: '非常に高 - 巨大市場の破壊的変化',
      risk: '高 - 技術的難易度、大手との競争'
    })
  }
  
  // Based on Reddit sentiment
  const startupSentiment = redditInsights.find(i => i.topic.includes('Startup'))
  if (startupSentiment) {
    if (startupSentiment.engagement > 50) {
      recommendations.push({
        action: 'Target SMB/Startup Market Aggressively', 
        rationale: `High community engagement (${startupSentiment.engagement} avg score). Strong demand signals`,
        timeline: '即座実行可能',
        roi: '中-高 - 高需要・競争激化前',
        risk: '低 - 既存需要に対応'
      })
    }
  }
  
  // Cross-analysis recommendation
  if (githubInsights.length >= 2 && redditInsights.length >= 1) {
    recommendations.push({
      action: 'Launch Technical Community-Focused Product',
      rationale: 'GitHub技術トレンドとRedditコミュニティ活動の両方で強いシグナル',
      timeline: '30-90日',
      roi: '中-高 - Technical early adopters + Community validation',
      risk: '中 - Market timing critical'
    })
  }
  
  return recommendations
}

performLiveAnalysis()