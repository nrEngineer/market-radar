/* ═══════════════════════════════════════════════════════════════
   Market Radar Database Seed Script
   Populates Supabase with mock data from data.ts
   ═══════════════════════════════════════════════════════════════ */

import { createClient } from '@supabase/supabase-js'
import { opportunities, trends, categories } from '../src/lib/data'

// Environment variables validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

// Admin client for seeding
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Convert opportunities to database format
function convertOpportunityToDB(opp: any) {
  return {
    id: opp.id,
    title: opp.title,
    subtitle: opp.subtitle,
    category: opp.category,
    subcategory: opp.subcategory,
    status: opp.status,
    five_w1h: opp.fiveW1H,
    scores: opp.scores,
    risks: opp.risks,
    revenue: opp.revenue,
    market: opp.market,
    implementation: opp.implementation,
    competitors: opp.competitors,
    target_segments: opp.targetSegments,
    evidence: opp.evidence,
    provenance: opp.provenance,
    next_steps: opp.nextSteps,
    tags: opp.tags || [],
    created_at: opp.createdAt,
    updated_at: opp.updatedAt,
  }
}

// Convert trends to database format
function convertTrendToDB(trend: any) {
  return {
    id: trend.id,
    name: trend.name,
    category: trend.category,
    status: trend.status,
    momentum: trend.momentum,
    search_volume: trend.searchVolume,
    adoption_curve: trend.adoptionCurve,
    impact: trend.impact,
    timeframe: trend.timeframe,
    related_trends: trend.relatedTrends || [],
    signals: trend.signals,
    prediction: trend.prediction,
    five_w1h: trend.fiveW1H,
    provenance: trend.provenance,
    created_at: trend.createdAt,
    updated_at: trend.updatedAt,
  }
}

// Convert categories to database format  
function convertCategoryToDB(cat: any) {
  return {
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    description: cat.description,
    icon: cat.icon,
    color: cat.color,
    total_apps: cat.totalApps,
    total_revenue: cat.totalRevenue,
    avg_revenue: cat.avgRevenue,
    median_revenue: cat.medianRevenue,
    growth: cat.growth,
    yoy_growth: cat.yoyGrowth,
    sizing: cat.sizing,
    monthly_data: cat.monthlyData,
    top_apps: cat.topApps,
    subcategories: cat.subcategories,
    regions: cat.regions,
    five_w1h: cat.fiveW1H,
    provenance: cat.provenance,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
}

async function seedDatabase() {
  console.log('🌱 Starting database seed...')

  try {
    // 1. Clear existing data
    console.log('🗑️  Clearing existing data...')
    await supabase.from('opportunities').delete().neq('id', '')
    await supabase.from('trends').delete().neq('id', '')
    await supabase.from('categories').delete().neq('id', '')
    await supabase.from('collected_data').delete().neq('id', '')
    await supabase.from('collection_logs').delete().neq('id', '')

    // 2. Seed opportunities
    console.log('📊 Seeding opportunities...')
    const dbOpportunities = opportunities.map(convertOpportunityToDB)
    const { error: oppError } = await supabase
      .from('opportunities')
      .insert(dbOpportunities)
    
    if (oppError) {
      console.error('Error seeding opportunities:', oppError)
    } else {
      console.log(`✅ Seeded ${dbOpportunities.length} opportunities`)
    }

    // 3. Seed trends
    console.log('📈 Seeding trends...')
    const dbTrends = trends.map(convertTrendToDB)
    const { error: trendError } = await supabase
      .from('trends')
      .insert(dbTrends)
    
    if (trendError) {
      console.error('Error seeding trends:', trendError)
    } else {
      console.log(`✅ Seeded ${dbTrends.length} trends`)
    }

    // 4. Seed categories
    console.log('📱 Seeding categories...')
    const dbCategories = categories.map(convertCategoryToDB)
    const { error: catError } = await supabase
      .from('categories')
      .insert(dbCategories)
    
    if (catError) {
      console.error('Error seeding categories:', catError)
    } else {
      console.log(`✅ Seeded ${dbCategories.length} categories`)
    }

    // 5. Add some sample collected data
    console.log('🔄 Adding sample collected data...')
    const sampleCollectedData = [
      {
        source: 'appstore',
        raw_data: {
          category: 'productivity',
          apps: [
            { name: 'Sample App 1', price: 0, rating: 4.5 },
            { name: 'Sample App 2', price: 299, rating: 4.2 },
          ],
        },
        data_count: 2,
        status: 'success',
        collected_at: new Date().toISOString(),
        metadata: { api_version: '1.0', country: 'JP' },
      },
      {
        source: 'hackernews',
        raw_data: {
          stories: [
            { title: 'New AI Tool Announcement', score: 150, url: 'https://example.com' },
            { title: 'Startup Funding News', score: 89, url: 'https://example2.com' },
          ],
        },
        data_count: 2,
        status: 'success',
        collected_at: new Date().toISOString(),
        metadata: { api_version: '1.0' },
      },
    ]

    const { error: dataError } = await supabase
      .from('collected_data')
      .insert(sampleCollectedData)
    
    if (dataError) {
      console.error('Error seeding collected data:', dataError)
    } else {
      console.log(`✅ Seeded ${sampleCollectedData.length} collected data records`)
    }

    // 6. Add sample collection logs
    console.log('📝 Adding sample collection logs...')
    const sampleLogs = [
      {
        source: 'appstore',
        status: 'success',
        data_count: 25,
        execution_time_ms: 1500,
        timestamp: new Date().toISOString(),
        metadata: { categories_processed: 5 },
      },
      {
        source: 'hackernews',
        status: 'success', 
        data_count: 30,
        execution_time_ms: 800,
        timestamp: new Date().toISOString(),
        metadata: { stories_filtered: 'tech_startup' },
      },
      {
        source: 'producthunt',
        status: 'error',
        data_count: 0,
        execution_time_ms: 200,
        error: 'API rate limit exceeded',
        timestamp: new Date().toISOString(),
        metadata: { retry_after: 3600 },
      },
    ]

    const { error: logError } = await supabase
      .from('collection_logs')
      .insert(sampleLogs)
    
    if (logError) {
      console.error('Error seeding collection logs:', logError)
    } else {
      console.log(`✅ Seeded ${sampleLogs.length} collection log records`)
    }

    console.log('\n🎉 Database seeding completed successfully!')
    console.log('📊 Summary:')
    console.log(`   - ${dbOpportunities.length} opportunities`)
    console.log(`   - ${dbTrends.length} trends`)
    console.log(`   - ${dbCategories.length} categories`)
    console.log(`   - ${sampleCollectedData.length} collected data records`)
    console.log(`   - ${sampleLogs.length} collection log records`)

  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

// Run the seeding
if (require.main === module) {
  seedDatabase()
}

export default seedDatabase