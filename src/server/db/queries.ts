import { supabase } from './client'
import { convertToOpportunity, convertToTrend } from './mappers'
import type { DatabaseCategory, DatabaseCollectedData, DatabaseCollectionLog } from './types'

export async function getOpportunitiesFromDB(): Promise<Record<string, unknown>[]> {
  const { data, error } = await supabase
    .from('opportunities')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(200)

  if (error) {
    console.error('Error fetching opportunities from DB:', error)
    return []
  }

  return (data || []).map(convertToOpportunity)
}

export async function getTrendsFromDB(): Promise<Record<string, unknown>[]> {
  const { data, error } = await supabase
    .from('trends')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(200)

  if (error) {
    console.error('Error fetching trends from DB:', error)
    return []
  }

  return (data || []).map(convertToTrend)
}

export async function getCategoriesFromDB(): Promise<DatabaseCategory[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')
    .limit(200)

  if (error) {
    console.error('Error fetching categories from DB:', error)
    return []
  }

  return data || []
}

export async function getLatestCollectedData(source?: string): Promise<DatabaseCollectedData[]> {
  let query = supabase
    .from('collected_data')
    .select('*')
    .order('collected_at', { ascending: false })

  if (source) {
    query = query.eq('source', source)
  }

  const { data, error } = await query.limit(100)

  if (error) {
    console.error('Error fetching collected data:', error)
    return []
  }

  return data || []
}

export async function getCollectionLogs(source?: string, limit = 50): Promise<DatabaseCollectionLog[]> {
  let query = supabase
    .from('collection_logs')
    .select('*')
    .order('timestamp', { ascending: false })

  if (source) {
    query = query.eq('source', source)
  }

  const { data, error } = await query.limit(limit)

  if (error) {
    console.error('Error fetching collection logs:', error)
    return []
  }

  return data || []
}
