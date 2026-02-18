#!/usr/bin/env node
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

console.log('🔄 Supabase Connection Test...');
console.log('');

// Check environment variables
console.log('Environment check:');
console.log('  SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing');
console.log('  SERVICE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing');
console.log('  CRON_SECRET:', process.env.CRON_SECRET_TOKEN ? '✅ Set' : '❌ Missing');
console.log('');

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.log('❌ Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('opportunities')
      .select('id')
      .limit(1);
    
    if (error) {
      console.log('❌ Database query failed:', error.message);
      return false;
    }
    
    console.log('✅ Database connection successful!');
    console.log(`   Found ${data?.length || 0} records in opportunities table`);
    
    // Test other tables
    const tables = ['trends', 'categories', 'collection_logs'];
    for (const table of tables) {
      try {
        const { data: tableData, error: tableError } = await supabase
          .from(table)
          .select('id')
          .limit(1);
        
        if (tableError) {
          console.log(`⚠️  Table '${table}': ${tableError.message}`);
        } else {
          console.log(`✅ Table '${table}': ${tableData?.length || 0} records found`);
        }
      } catch (err) {
        console.log(`❌ Table '${table}': ${err.message}`);
      }
    }
    
    return true;
  } catch (err) {
    console.log('❌ Connection test failed:', err.message);
    return false;
  }
}

async function seedSampleData() {
  try {
    console.log('');
    console.log('🌱 Seeding sample data...');
    
    // Insert a sample opportunity
    const { data: oppData, error: oppError } = await supabase
      .from('opportunities')
      .insert([{
        id: 'test-opp-001',
        title: 'AI市場分析ツール',
        subtitle: 'McKinsey級の市場分析を自動化',
        category: 'AI Tools',
        subcategory: 'Market Analysis',
        status: 'validated',
        five_w1h: {
          what: 'AI駆動の市場分析プラットフォーム',
          who: '事業企画・投資担当者',
          when: '2026年Q1リリース',
          where: '日本・アジア市場',
          why: 'McKinsey級の分析を1/10のコストで提供',
          how: 'LLM + リアルタイムデータ収集'
        },
        scores: {
          overall: 85,
          market: 90,
          tech: 80,
          competition: 75,
          timing: 95,
          execution: 80
        },
        risks: { technical: 'medium', market: 'low', regulatory: 'low' },
        revenue: { model: 'SaaS', estimate: 50000000 },
        market: { tam: 100000000000, sam: 10000000000, som: 1000000000 },
        implementation: { complexity: 'high', timeline: '6 months' },
        competitors: ['McKinsey', 'BCG', 'Deloitte'],
        target_segments: ['Enterprise', 'VC', 'Consulting'],
        evidence: { strength: 'high', sources: 3 },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select();
    
    if (oppError) {
      console.log('⚠️  Sample opportunity insert:', oppError.message);
    } else {
      console.log('✅ Sample opportunity inserted');
    }
    
    // Insert a sample trend
    const { data: trendData, error: trendError } = await supabase
      .from('trends')
      .insert([{
        id: 'test-trend-001',
        name: 'AIエージェント市場急拡大',
        category: 'AI Tools',
        status: 'growing',
        momentum: 85,
        search_volume: [
          { month: '2026-01', value: 150000 },
          { month: '2026-02', value: 180000 }
        ],
        adoption_curve: 'early_adopters',
        impact: 'transformative',
        timeframe: '6-18 months',
        related_trends: ['OpenAI GPT', 'Claude AI'],
        signals: [
          {
            source: 'Product Hunt',
            signal: 'AI agent tools +200% launch rate',
            date: '2026-02-15',
            strength: 90
          }
        ],
        prediction: {
          shortTerm: 'Enterprise adoption accelerates',
          midTerm: 'Mass market penetration begins', 
          longTerm: 'Industry standard technology'
        },
        five_w1h: {
          what: 'AI agents that automate business processes',
          who: 'Enterprise software buyers',
          when: '2026-2027 peak adoption',
          where: 'Global, US/Japan leading',
          why: 'Productivity gains 3-5x',
          how: 'Large Language Models + workflow integration'
        },
        provenance: {
          sources: [
            {
              name: 'Product Hunt API',
              url: 'https://api.producthunt.com',
              type: 'api',
              reliability: 90,
              lastCollected: new Date().toISOString()
            }
          ],
          collectedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          confidenceScore: 85
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select();
    
    if (trendError) {
      console.log('⚠️  Sample trend insert:', trendError.message);
    } else {
      console.log('✅ Sample trend inserted');
    }
    
    console.log('✅ Sample data seeding completed');
    
  } catch (err) {
    console.log('❌ Seeding failed:', err.message);
  }
}

// Run tests
async function main() {
  const connected = await testConnection();
  
  if (connected) {
    await seedSampleData();
    console.log('');
    console.log('🎉 Database setup completed!');
    console.log('📊 Ready to test /api/data endpoint');
  } else {
    console.log('');
    console.log('❌ Database setup failed');
    console.log('Check your environment variables and Supabase configuration');
  }
}

main();