// Execute schema via SQL statements using Supabase client
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const supabaseUrl = 'https://zualceyvwvvijxcbfsco.supabase.co'
const serviceKey = 'REDACTED_JWT_TOKEN'

console.log('🚀 Executing Market Radar schema via direct SQL...')

const supabase = createClient(supabaseUrl, serviceKey)

// Core table creation statements (simplified)
const coreStatements = [
  // Enable extensions
  `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`,
  
  // Opportunities table
  `CREATE TABLE IF NOT EXISTS opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    category TEXT NOT NULL,
    subcategory TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'hypothesis',
    five_w1h JSONB NOT NULL DEFAULT '{}',
    scores JSONB NOT NULL DEFAULT '{}',
    risks JSONB NOT NULL DEFAULT '{}',
    revenue JSONB NOT NULL DEFAULT '{}',
    market JSONB NOT NULL DEFAULT '{}',
    implementation JSONB NOT NULL DEFAULT '{}',
    competitors JSONB NOT NULL DEFAULT '[]',
    target_segments JSONB NOT NULL DEFAULT '[]',
    evidence JSONB NOT NULL DEFAULT '{}',
    provenance JSONB NOT NULL DEFAULT '{}',
    next_steps JSONB NOT NULL DEFAULT '[]',
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );`,
  
  // Trends table  
  `CREATE TABLE IF NOT EXISTS trends (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'emerging',
    momentum INTEGER NOT NULL DEFAULT 0,
    search_volume JSONB NOT NULL DEFAULT '[]',
    adoption_curve TEXT NOT NULL DEFAULT 'innovators',
    impact TEXT NOT NULL DEFAULT 'low',
    timeframe TEXT NOT NULL DEFAULT '',
    related_trends TEXT[] DEFAULT '{}',
    signals JSONB NOT NULL DEFAULT '[]',
    prediction JSONB NOT NULL DEFAULT '{}',
    five_w1h JSONB NOT NULL DEFAULT '{}',
    provenance JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );`,
  
  // Categories table
  `CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL DEFAULT '',
    icon TEXT NOT NULL DEFAULT '📱',
    color TEXT NOT NULL DEFAULT '#6366f1',
    total_apps INTEGER NOT NULL DEFAULT 0,
    total_revenue TEXT NOT NULL DEFAULT '¥0',
    avg_revenue TEXT NOT NULL DEFAULT '¥0',
    median_revenue TEXT NOT NULL DEFAULT '¥0',
    growth TEXT NOT NULL DEFAULT '0%',
    yoy_growth TEXT NOT NULL DEFAULT '0%',
    sizing JSONB NOT NULL DEFAULT '{}',
    monthly_data JSONB NOT NULL DEFAULT '[]',
    top_apps JSONB NOT NULL DEFAULT '[]',
    subcategories JSONB NOT NULL DEFAULT '[]',
    regions JSONB NOT NULL DEFAULT '[]',
    five_w1h JSONB NOT NULL DEFAULT '{}',
    provenance JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );`,
  
  // Collection tables
  `CREATE TABLE IF NOT EXISTS collected_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source TEXT NOT NULL,
    raw_data JSONB NOT NULL,
    processed_data JSONB DEFAULT NULL,
    collected_at TIMESTAMPTZ DEFAULT NOW(),
    data_count INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'success',
    error TEXT DEFAULT NULL,
    metadata JSONB DEFAULT '{}'
  );`,
  
  `CREATE TABLE IF NOT EXISTS collection_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source TEXT NOT NULL,
    status TEXT NOT NULL,
    data_count INTEGER NOT NULL DEFAULT 0,
    error TEXT DEFAULT NULL,
    execution_time_ms INTEGER NOT NULL DEFAULT 0,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
  );`
]

async function executeStatements() {
  let success = 0
  let errors = 0
  
  for (let i = 0; i < coreStatements.length; i++) {
    const statement = coreStatements[i]
    console.log(`\n[${i + 1}/${coreStatements.length}] Executing table creation...`)
    
    try {
      // Use raw SQL execution (this might not work with all Supabase plans)
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${serviceKey}`,
          'apikey': serviceKey
        },
        body: JSON.stringify({ query: statement })
      })
      
      if (response.ok) {
        console.log('✅ Success')
        success++
      } else {
        console.log(`⚠️  Response: ${response.status} - ${response.statusText}`)
        // This is expected for DDL statements, try alternative
        errors++
      }
    } catch (err) {
      console.log(`⚠️  Expected error: ${err.message}`)
      errors++
    }
  }
  
  console.log(`\n📊 Schema execution attempt completed`)
  console.log(`✅ Successful: ${success}`)
  console.log(`❌ Expected errors: ${errors}`)
  
  // Test if tables were created
  await testTables()
}

async function testTables() {
  console.log('\n🔍 Testing table creation...')
  
  const tables = ['opportunities', 'trends', 'categories', 'collected_data', 'collection_logs']
  let working = 0
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('count').limit(1)
      if (error) {
        console.log(`❌ ${table}: ${error.message}`)
      } else {
        console.log(`✅ ${table}: Working`)
        working++
      }
    } catch (err) {
      console.log(`❌ ${table}: ${err.message}`)
    }
  }
  
  if (working === tables.length) {
    console.log('\n🎉 All tables created successfully!')
    console.log('📋 Ready to execute: npm run db:seed')
    return true
  } else if (working > 0) {
    console.log(`\n⚠️  ${working}/${tables.length} tables working`)
    return false
  } else {
    console.log('\n❌ No tables created - manual schema execution needed')
    console.log('📋 Use Supabase dashboard SQL editor to execute schema.sql')
    return false
  }
}

executeStatements().catch(console.error)