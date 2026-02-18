// Test Real Data Collection
async function testDataCollection() {
  console.log('🔍 Testing real data collection...\n')
  
  try {
    // Test GitHub API
    console.log('📊 GitHub Trending Repositories:')
    const githubResponse = await fetch('https://api.github.com/search/repositories?q=created:>2026-02-15&sort=stars&order=desc&per_page=10')
    const githubData = await githubResponse.json()
    
    if (githubData.items) {
      githubData.items.slice(0, 5).forEach((repo, i) => {
        console.log(`${i+1}. ${repo.name} (${repo.stargazers_count}⭐)`)
        console.log(`   ${repo.description || 'No description'}`)
        console.log(`   Language: ${repo.language || 'N/A'}, Topics: ${repo.topics?.join(', ') || 'N/A'}`)
        console.log('')
      })
    }
    
    // Test Reddit API  
    console.log('💬 Reddit Hot Posts (r/startups):')
    const redditResponse = await fetch('https://www.reddit.com/r/startups/hot.json?limit=5', {
      headers: {
        'User-Agent': 'MarketRadar/1.0 (Educational Research)'
      }
    })
    const redditData = await redditResponse.json()
    
    if (redditData.data?.children) {
      redditData.data.children.slice(0, 3).forEach((item, i) => {
        const post = item.data
        console.log(`${i+1}. ${post.title}`)
        console.log(`   Score: ${post.score}, Comments: ${post.num_comments}`)
        console.log(`   Author: ${post.author}`)
        console.log('')
      })
    }
    
    console.log('✅ Data collection test completed successfully!')
    
    // Summary
    console.log('\n📈 Data Summary:')
    console.log(`GitHub repos found: ${githubData.total_count || 0}`)
    console.log(`Reddit posts analyzed: ${redditData.data?.children?.length || 0}`)
    console.log('Total cost: ¥0 (All free APIs)')
    
  } catch (error) {
    console.error('❌ Data collection test failed:', error.message)
  }
}

testDataCollection()