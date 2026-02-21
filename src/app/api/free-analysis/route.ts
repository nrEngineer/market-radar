import { NextRequest, NextResponse } from 'next/server'
import { runFreeAnalysis } from '@/usecases/run-free-analysis'
import { freeAnalysisParamsSchema } from '@/server/validation/schemas'
import { notifyError } from '@/server/discord-notify'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const parsed = freeAnalysisParamsSchema.safeParse({
    type: searchParams.get('type') ?? undefined,
    timeframe: searchParams.get('timeframe') ?? undefined,
  })

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid request parameters' },
      { status: 400 }
    )
  }

  const { type: analysisType, timeframe } = parsed.data

  try {
    const analysis = await runFreeAnalysis(analysisType, timeframe)

    return NextResponse.json(analysis, {
      headers: {
        'Cache-Control': 'public, max-age=300',
        'X-Analysis-Type': analysisType,
      }
    })
  } catch (error) {
    console.error('Free analysis error:', error)
    notifyError('free-analysis', error instanceof Error ? error.message : 'Unknown error').catch(() => {})
    return NextResponse.json(
      { error: 'Analysis failed', timestamp: new Date().toISOString() },
      { status: 500 }
    )
  }
}
