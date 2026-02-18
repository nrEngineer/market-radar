// Automated schema setup using Supabase client
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

// Environment variables
const supabaseUrl = 'https://zualceyvwvvijxcbfsco.supabase.co'
const serviceKey = 'REDACTED_JWT_TOKEN'

console.log('🏗️  Setting up Market Radar database schema...')

// Admin client with service role
const supabase = createClient(supabaseUrl, serviceKey, {
  auth: {
    persistSession: false,
  },
})

// Read schema file
const schema = readFileSync('./supabase/schema.sql', 'utf8')

// Split schema into individual statements (basic approach)
const statements = schema
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--'))

console.log(`📊 Found ${statements.length} SQL statements to execute`)

// Execute schema statements one by one
async function executeSchema() {
  let successCount = 0
  let errorCount = 0
  
  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i].trim() + ';'
    
    if (statement.length < 10) continue // Skip very short statements
    
    try {
      console.log(`\n[${i + 1}/${statements.length}] Executing:`, statement.substring(0, 80) + '...')
      
      const { data, error } = await supabase.rpc('exec_sql', { sql: statement })
      
      if (error) {
        // Try alternative method for DDL statements
        const { error: altError } = await supabase
          .from('_supabase_migrations')  // This won't work but will give us the actual error
          .select('*')
        
        console.log(`⚠️  Warning on statement ${i + 1}:`, error.message)
        if (error.message.includes('already exists')) {
          console.log('✅ (Already exists - OK)')
          successCount++
        } else {
          errorCount++
        }
      } else {
        console.log('✅ Success')
        successCount++
      }
      
      // Small delay between statements
      await new Promise(resolve => setTimeout(resolve, 100))
      
    } catch (err) {
      console.error(`❌ Error on statement ${i + 1}:`, err.message)
      errorCount++
    }
  }
  
  console.log(`\n📊 Schema execution summary:`)
  console.log(`✅ Successful: ${successCount}`)
  console.log(`❌ Errors: ${errorCount}`)
  console.log(`📋 Total: ${statements.length}`)
  
  if (errorCount === 0) {
    console.log('\n🎉 Schema setup completed successfully!')
    return true
  } else if (successCount > errorCount) {
    console.log('\n⚠️  Schema setup completed with some warnings (likely OK)')
    return true
  } else {
    console.log('\n💥 Schema setup failed')
    return false
  }
}

// Alternative: Simple table creation test
async function testBasicTables() {
  try {
    console.log('\n🔍 Testing basic table creation...')
    
    // Test basic table existence
    const { data, error } = await supabase.from('opportunities').select('count').limit(1)
    
    if (error) {
      console.log('⚠️  Tables do not exist yet, schema execution needed')
      return false
    } else {
      console.log('✅ Tables exist and accessible!')
      return true
    }
  } catch (err) {
    console.error('❌ Basic table test failed:', err.message)
    return false
  }
}

// Execute setup
async function main() {
  // First test if tables already exist
  const tablesExist = await testBasicTables()
  
  if (tablesExist) {
    console.log('\n🎉 Database schema already exists!')
    console.log('📋 Ready for seeding data')
    return true
  }
  
  console.log('\n⚠️  Manual schema execution needed')
  console.log('📋 Please execute the schema.sql in Supabase dashboard:')
  console.log('1. Go to https://supabase.com/dashboard')
  console.log('2. Select market-radar project')  
  console.log('3. Go to SQL Editor')
  console.log('4. Execute the schema.sql file')
  console.log('\n📋 After that, run: npm run db:seed')
  
  return false
}

main().catch(console.error)