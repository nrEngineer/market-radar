// Simple Supabase connection test without external dependencies
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

// Read .env.local manually
console.log('🔌 Testing Supabase Connection...')

// Environment variables
const supabaseUrl = 'https://zualceyvwvvijxcbfsco.supabase.co'
const supabaseKey = 'REDACTED_JWT_TOKEN'

console.log(`URL: ${supabaseUrl}`)
console.log(`Key: ${supabaseKey.slice(0, 20)}...`)

const supabase = createClient(supabaseUrl, supabaseKey)

// Test connection
async function testConnection() {
  try {
    console.log('\n🔍 Testing basic connection...')
    const { data, error } = await supabase.from('opportunities').select('count').limit(1)
    
    if (error) {
      if (error.message.includes('relation "opportunities" does not exist')) {
        console.log('⚠️  Tables not created yet - this is expected for fresh DB')
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
    console.log('\n🎉 Supabase connection test PASSED!')
    console.log('📋 Next step: Execute schema.sql in Supabase dashboard')
  } else {
    console.log('\n💥 Supabase connection test FAILED')
    process.exit(1)
  }
})