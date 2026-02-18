#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════
// Market Radar RLS有効化スクリプト (Simple版)
// ═══════════════════════════════════════════════════════════════

const { createClient } = require('@supabase/supabase-js')

// 環境変数（.env.local から手動設定）
const SUPABASE_URL = 'https://zualceyvwvvijxcbfsco.supabase.co'
const SUPABASE_SERVICE_KEY = 'REDACTED_JWT_TOKEN'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
})

async function enableRLS() {
  console.log('🔒 Market Radar RLS Setup Starting...')
  
  // RLSを有効化するSQL
  const rlsQueries = [
    'ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;',
    'ALTER TABLE trends ENABLE ROW LEVEL SECURITY;',
    'ALTER TABLE categories ENABLE ROW LEVEL SECURITY;',
    'ALTER TABLE collected_data ENABLE ROW LEVEL SECURITY;',
    'ALTER TABLE collection_logs ENABLE ROW LEVEL SECURITY;'
  ]
  
  // ポリシー作成SQL
  const policyQueries = [
    `CREATE POLICY "service_all_opportunities" ON opportunities FOR ALL TO service_role USING (true) WITH CHECK (true);`,
    `CREATE POLICY "auth_read_opportunities" ON opportunities FOR SELECT TO authenticated USING (true);`,
    `CREATE POLICY "service_all_trends" ON trends FOR ALL TO service_role USING (true) WITH CHECK (true);`,
    `CREATE POLICY "auth_read_trends" ON trends FOR SELECT TO authenticated USING (true);`,
    `CREATE POLICY "service_all_categories" ON categories FOR ALL TO service_role USING (true) WITH CHECK (true);`,
    `CREATE POLICY "auth_read_categories" ON categories FOR SELECT TO authenticated USING (true);`,
    `CREATE POLICY "service_all_collected" ON collected_data FOR ALL TO service_role USING (true) WITH CHECK (true);`,
    `CREATE POLICY "service_all_logs" ON collection_logs FOR ALL TO service_role USING (true) WITH CHECK (true);`
  ]
  
  try {
    // テスト接続
    console.log('🔗 Testing Supabase connection...')
    const { data, error } = await supabase.from('opportunities').select('count').limit(1)
    
    if (error) {
      console.error('❌ Connection failed:', error.message)
      console.log('🔧 Manual RLS setup required via Supabase Dashboard')
      console.log('   → https://supabase.com/dashboard/project/zualceyvwvvijxcbfsco/editor')
      console.log('   → SQL Editor → Execute the SQL in supabase/migrations/20260218_enable_rls.sql')
      return
    }
    
    console.log('✅ Connection successful!')
    console.log('📝 RLS policies should be set manually via Supabase Dashboard SQL Editor')
    console.log('')
    console.log('🎯 Quick Manual Setup:')
    console.log('1. Visit: https://supabase.com/dashboard/project/zualceyvwvvijxcbfsco/editor')
    console.log('2. Go to SQL Editor')
    console.log('3. Execute: supabase/migrations/20260218_enable_rls.sql')
    console.log('')
    console.log('✅ Expected Result: Security Department Score F(15) → B(75)')
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message)
  }
}

enableRLS()