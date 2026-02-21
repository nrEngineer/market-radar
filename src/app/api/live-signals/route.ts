import { NextResponse } from 'next/server'
import { fetchLiveSignals } from '@/usecases/fetch-live-signals'
import { notifyError } from '@/server/discord-notify'

// Public API: ライブ市場シグナルを無認証で取得
// HN, iTunes App Store から直接データ収集し、分析結果を返す
export async function GET() {
  try {
    const result = await fetchLiveSignals()

    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'public, max-age=300' }
    })
  } catch (error) {
    console.error('Live signals error:', error)
    notifyError('live-signals', error instanceof Error ? error.message : 'Unknown error').catch(() => {})
    return NextResponse.json(
      { error: 'Live signal collection failed', timestamp: new Date().toISOString() },
      { status: 500 }
    )
  }
}
