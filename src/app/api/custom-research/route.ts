import { NextRequest, NextResponse } from 'next/server'
import { runCustomResearch } from '@/usecases/run-custom-research'
import { customResearchSchema } from '@/server/validation/schemas'
import { notifyError } from '@/server/discord-notify'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = customResearchSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', issues: parsed.error.issues },
        { status: 400 }
      )
    }

    const { query, type, timestamp } = parsed.data
    const results = runCustomResearch(query, type, timestamp || new Date().toISOString())

    return NextResponse.json(results)
  } catch (error) {
    console.error('Custom research failed:', error)
    notifyError('custom-research', error instanceof Error ? error.message : 'Unknown error').catch(() => {})
    return NextResponse.json(
      { error: 'Research execution failed' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const action = searchParams.get('action')

  if (action === 'templates') {
    return NextResponse.json({
      templates: [
        {
          id: 'saas-competitor',
          name: 'SaaS競合分析テンプレート',
          query: '月額5,000円のSaaS競合を調べて、価格戦略、機能比較、市場シェアを分析してください。',
          type: 'competitor'
        },
        {
          id: 'market-entry',
          name: '市場参入分析テンプレート',
          query: '○○市場への参入可能性、市場規模、競合状況、参入障壁を調査してください。',
          type: 'market'
        },
        {
          id: 'pricing-strategy',
          name: '価格戦略テンプレート',
          query: '○○業界の価格帯分析、顧客の価格感応度、最適価格設定を調査してください。',
          type: 'pricing'
        }
      ]
    })
  }

  return NextResponse.json({ message: 'Custom Research API Ready' })
}
