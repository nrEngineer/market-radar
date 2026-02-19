import { NextRequest, NextResponse } from 'next/server'
import { collectMarketData } from '@/usecases/collect-market-data'
import { validateCronToken } from '@/server/auth-utils'
import { collectSourceSchema } from '@/server/validation/schemas'
import { notifyError } from '@/server/discord-notify'

export async function GET(request: NextRequest) {
  const authToken = request.headers.get('Authorization')

  if (!validateCronToken(authToken)) {
    console.error('[Security] Unauthorized collect API access attempt')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const sourceParam = searchParams.get('source')

    const parsed = collectSourceSchema.safeParse({ source: sourceParam || 'all' })
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid source' }, { status: 400 })
    }

    const source = parsed.data.source === 'all' ? null : parsed.data.source
    const summary = await collectMarketData(source)

    return NextResponse.json(summary)
  } catch (error) {
    console.error('Collection error:', error)
    notifyError('collect', error instanceof Error ? error.message : 'Unknown error').catch(() => {})
    return NextResponse.json(
      { error: 'Collection failed' },
      { status: 500 }
    )
  }
}

export async function POST() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
