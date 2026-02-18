// Quick data test
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zualceyvwvvijxcbfsco.supabase.co'
const serviceKey = 'REDACTED_JWT_TOKEN'

const supabase = createClient(supabaseUrl, serviceKey)

async function testData() {
  console.log('🧪 Testing database data...')
  
  const tables = [
    'opportunities',
    'trends', 
    'categories',
    'collected_data',
    'collection_logs'
  ]
  
  for (const table of tables) {
    try {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact' })
        .limit(5)
      
      if (error) {
        console.log(`❌ ${table}: ${error.message}`)
      } else {
        console.log(`✅ ${table}: ${count} records, showing first ${data?.length || 0}`)
        if (data && data.length > 0) {
          console.log(`   Sample: ${JSON.stringify(Object.keys(data[0]))}`)
        }
      }
    } catch (err) {
      console.log(`❌ ${table}: ${err.message}`)
    }
  }
}

testData()