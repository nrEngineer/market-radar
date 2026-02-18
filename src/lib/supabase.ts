/* ═══════════════════════════════════════════════════════════════
   Market Radar — Supabase Client Configuration
   Database connection and query utilities
   ═══════════════════════════════════════════════════════════════ */

import { createClient } from '@supabase/supabase-js'

// Environment variables validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Client for public operations (browser/client-side)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // We're not using auth for this project
  },
})

// Admin client for server operations (API routes)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
})

// Database Table Types
export interface DatabaseOpportunity {
  id: string
  title: string
  subtitle: string
  category: string
  subcategory: string
  status: 'validated' | 'hypothesis' | 'researching' | 'archived'
  five_w1h: Record<string, unknown> // JSONB
  scores: Record<string, unknown> // JSONB
  risks: Record<string, unknown> // JSONB
  revenue: Record<string, unknown> // JSONB
  market: Record<string, unknown> // JSONB
  implementation: Record<string, unknown> // JSONB
  competitors: Record<string, unknown> // JSONB
  target_segments: Record<string, unknown> // JSONB
  evidence: Record<string, unknown> // JSONB
  provenance: Record<string, unknown> // JSONB
  next_steps: Record<string, unknown> // JSONB
  tags: string[]
  created_at: string
  updated_at: string
}

export interface DatabaseTrend {
  id: string
  name: string
  category: string
  status: 'emerging' | 'growing' | 'mature' | 'declining'
  momentum: number
  search_volume: Record<string, unknown>[] // JSONB
  adoption_curve: string
  impact: 'low' | 'medium' | 'high' | 'transformative'
  timeframe: string
  related_trends: string[]
  signals: Record<string, unknown>[] // JSONB
  prediction: Record<string, unknown> // JSONB
  five_w1h: Record<string, unknown> // JSONB
  provenance: Record<string, unknown> // JSONB
  created_at: string
  updated_at: string
}

export interface DatabaseCategory {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  color: string
  total_apps: number
  total_revenue: string
  avg_revenue: string
  median_revenue: string
  growth: string
  yoy_growth: string
  sizing: Record<string, unknown> // JSONB
  monthly_data: Record<string, unknown>[] // JSONB
  top_apps: Record<string, unknown>[] // JSONB
  subcategories: Record<string, unknown>[] // JSONB
  regions: Record<string, unknown>[] // JSONB
  five_w1h: Record<string, unknown> // JSONB
  provenance: Record<string, unknown> // JSONB
  created_at: string
  updated_at: string
}

export interface DatabaseCollectedData {
  id: string
  source: string
  raw_data: Record<string, unknown> // JSONB
  processed_data?: Record<string, unknown> // JSONB
  collected_at: string
  data_count: number
  status: 'success' | 'error' | 'partial'
  error?: string
  metadata?: Record<string, unknown> // JSONB
}

export interface DatabaseCollectionLog {
  id: string
  source: string
  status: 'success' | 'error' | 'partial'
  data_count: number
  error?: string
  execution_time_ms: number
  timestamp: string
  metadata?: Record<string, unknown> // JSONB
}

// Utility functions for data conversion
export function convertToOpportunity(dbRecord: DatabaseOpportunity): Record<string, unknown> {
  return {
    id: dbRecord.id,
    title: dbRecord.title,
    subtitle: dbRecord.subtitle,
    category: dbRecord.category,
    subcategory: dbRecord.subcategory,
    status: dbRecord.status,
    fiveW1H: dbRecord.five_w1h,
    scores: dbRecord.scores,
    risks: dbRecord.risks,
    revenue: dbRecord.revenue,
    market: dbRecord.market,
    implementation: dbRecord.implementation,
    competitors: dbRecord.competitors,
    targetSegments: dbRecord.target_segments,
    evidence: dbRecord.evidence,
    provenance: dbRecord.provenance,
    nextSteps: dbRecord.next_steps,
    tags: dbRecord.tags,
    createdAt: dbRecord.created_at,
    updatedAt: dbRecord.updated_at,
  }
}

export function convertToTrend(dbRecord: DatabaseTrend): Record<string, unknown> {
  return {
    id: dbRecord.id,
    name: dbRecord.name,
    category: dbRecord.category,
    status: dbRecord.status,
    momentum: dbRecord.momentum,
    searchVolume: dbRecord.search_volume,
    adoptionCurve: dbRecord.adoption_curve,
    impact: dbRecord.impact,
    timeframe: dbRecord.timeframe,
    relatedTrends: dbRecord.related_trends,
    signals: dbRecord.signals,
    prediction: dbRecord.prediction,
    fiveW1H: dbRecord.five_w1h,
    provenance: dbRecord.provenance,
    createdAt: dbRecord.created_at,
    updatedAt: dbRecord.updated_at,
  }
}

// Database query functions
export async function getOpportunitiesFromDB(): Promise<Record<string, unknown>[]> {
  const { data, error } = await supabase
    .from('opportunities')
    .select('*')
    .order('updated_at', { ascending: false })

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