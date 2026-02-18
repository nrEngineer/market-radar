// Quick Supabase connection test
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔌 Testing Supabase Connection...')
console.log(`URL: ${supabaseUrl}`)
console.log(`Key: ${supabaseKey?.slice(0, 20)}...`)

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Test connection
async function testConnection() {
  try {
    console.log('\n🔍 Testing basic connection...')
    const { data, error } = await supabase.from('opportunities').select('count').limit(1)
    
    if (error) {
      if (error.message.includes('relation "opportunities" does not exist')) {
        console.log('⚠️  Tables not created yet - this is expected')
        console.log('✅ Connection successful! Ready for schema creation')
        return true
      } else {
        console.error('❌ Connection error:', error.message)
        return false
      }
    } else {
      console.log('✅ Connection successful! Database ready')
      console.log('📊 Query result:', data)
      return true
    }
  } catch (err) {
    console.error('❌ Connection failed:', err.message)
    return false
  }
}

testConnection().then(success => {
  if (success) {
    console.log('\n🎉 Supabase connection test completed successfully!')
  } else {
    console.log('\n💥 Supabase connection test failed')
    process.exit(1)
  }
})