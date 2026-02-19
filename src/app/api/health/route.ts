import { NextResponse } from 'next/server'
import { supabase, isSupabaseConfigured } from '@/server/db/client'
import { notifyAPIHealth } from '@/server/discord-notify'

interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  version: string
  checks: {
    database: { status: string; latencyMs: number }
    api: { status: string }
  }
  responseTimeMs: number
}

export async function GET(): Promise<NextResponse<HealthCheck>> {
  const startTime = Date.now()

  const checks = {
    database: { status: 'unknown', latencyMs: 0 },
    api: { status: 'ok' },
  }

  // Database connectivity check
  try {
    if (!isSupabaseConfigured()) {
      checks.database = { status: 'not_configured', latencyMs: 0 }
    } else {
      const dbStart = Date.now()
      const { error } = await supabase
        .from('collection_logs')
        .select('id')
        .limit(1)
      checks.database = {
        status: error ? 'error' : 'ok',
        latencyMs: Date.now() - dbStart,
      }
    }
  } catch {
    checks.database = { status: 'error', latencyMs: -1 }
  }

  const allOk = checks.database.status === 'ok' && checks.api.status === 'ok'

  const response: HealthCheck = {
    status: allOk ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    version: '0.1.0',
    checks,
    responseTimeMs: Date.now() - startTime,
  }

  if (!allOk) {
    notifyAPIHealth({
      healthy: false,
      dbLatency: checks.database.latencyMs,
      details: `Database: ${checks.database.status}, API: ${checks.api.status}`,
    }).catch(() => {})
  }

  return NextResponse.json(response, { status: allOk ? 200 : 503 })
}
