'use client'

import Link from 'next/link'
import { PageLayout } from '@/components/PageLayout'
import { Badge } from '@/components/Badge'
// ScoreBar available from '@/components/ScoreBar'
import { opportunities } from '@/lib/data'
import { AnimatedSection } from '@/components/motion'

export default function OpportunitiesListPage() {
  return (
    <PageLayout
      title="市場機会一覧"
      subtitle="AI分析で検出・スコアリングされた全事業機会"
      icon="🎯"
      breadcrumbs={[{ label: '市場機会' }]}
    >
      <div className="space-y-4">
        {opportunities.map((opp, i) => (
          <AnimatedSection key={opp.id} delay={i * 0.05}>
            <Link href={`/opportunities/${opp.id}`} className="block group">
              <div className="premium-card relative overflow-hidden p-6 cursor-pointer">
                <div className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-sm font-semibold text-slate-400">
                  #{i + 1}
                </div>

                <div className="pr-12">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                    opp.status === 'validated' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' :
                    opp.status === 'researching' ? 'bg-[#3d5a99]/8 text-[#2c4377] border-[#3d5a99]/15' :
                    'bg-amber-50 text-amber-700 border-amber-200/60'
                  }`}>
                    {opp.status === 'validated' ? '✅ 検証済み' : opp.status === 'researching' ? '📊 調査中' : '🔍 仮説'}
                  </span>
                  <h3 className="mt-2 text-[17px] font-semibold text-slate-900 group-hover:text-[#3d5a99] transition-colors">
                    {opp.title}
                  </h3>
                  <p className="mt-1 text-[12px] text-slate-400">{opp.subtitle}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge variant="brand" size="md">{opp.category}</Badge>
                    <Badge variant={opp.risks.level === 'low' ? 'emerald' : opp.risks.level === 'medium' ? 'amber' : 'rose'} size="md" dot>
                      {opp.risks.level === 'low' ? '低リスク' : opp.risks.level === 'medium' ? '中リスク' : '高リスク'}
                    </Badge>
                    <Badge variant="ghost" size="md">⏱ {opp.implementation.timeframe}</Badge>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-5">
                  <div>
                    <p className="text-[11px] text-slate-400">収益</p>
                    <p className="text-lg font-semibold text-slate-900">{opp.revenue.estimated}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400">成長率</p>
                    <p className="text-lg font-semibold text-emerald-600">{opp.market.growth}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400">スコア</p>
                    <p className="text-lg font-semibold text-[#3d5a99]">{opp.scores.overall}/100</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400">CAGR</p>
                    <p className="text-lg font-semibold text-slate-900">{opp.market.sizing.cagr}%</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400">投資額</p>
                    <p className="text-lg font-semibold text-slate-900">{opp.implementation.totalCost}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-[12px] font-medium text-[#3d5a99] opacity-0 group-hover:opacity-100 transition-opacity">
                  詳細分析 →
                </div>
              </div>
            </Link>
          </AnimatedSection>
        ))}
      </div>
    </PageLayout>
  )
}
