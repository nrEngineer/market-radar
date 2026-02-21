import { NextRequest, NextResponse } from 'next/server'
import { validateCronToken } from '@/server/auth-utils'
import { notifyError } from '@/server/discord-notify'
import { fetchDashboardData } from '@/usecases/fetch-dashboard-data'

type DashboardType = 'stats' | 'highlights' | 'categories' | 'collection-status' | null

const VALID_TYPES = new Set(['stats', 'highlights', 'categories', 'collection-status'])

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const rawType = searchParams.get('type')
    const type: DashboardType = rawType && VALID_TYPES.has(rawType)
      ? rawType as DashboardType
      : null

    const data = await fetchDashboardData(type)

    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, max-age=300' },
    })
  } catch (error) {
    console.error('Data API error:', error)
    notifyError('data', error instanceof Error ? error.message : 'Unknown error').catch(() => {})
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authToken = request.headers.get('Authorization')
    if (!validateCronToken(authToken)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const updates = await request.json()
    return NextResponse.json({
      success: true,
      updated: Object.keys(updates),
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Data update error:', error)
    notifyError('data-update', error instanceof Error ? error.message : 'Unknown error').catch(() => {})
    return NextResponse.json({ error: 'Failed to update data' }, { status: 500 })
  }
}
