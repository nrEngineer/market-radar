'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { PageLayout } from '@/components/PageLayout'
import { Badge } from '@/components/Badge'
import { FilterBar } from '@/components/FilterBar'
import { WatchlistButton } from '@/components/WatchlistButton'
import { ExportButton } from '@/components/ExportButton'
import { opportunities as allOpportunities } from '@/data'
import { AnimatedSection } from '@/components/motion'
import { useWatchlist } from '@/hooks/useWatchlist'
import type { OpportunityDetail } from '@/domain/types'

export default function OpportunitiesListPage() {
  const [filtered, setFiltered] = useState<OpportunityDetail[]>(allOpportunities)
  const [compareIds, setCompareIds] = useState<string[]>([])
  const { isWatched, toggle: toggleWatch } = useWatchlist()
  const router = useRouter()

  const toggleCompare = (id: string) => {
    setCompareIds(prev =>
      prev.includes(id)
        ? prev.filter(c => c !== id)
        : prev.length < 2 ? [...prev, id] : [prev[1], id]
    )
  }

  return (
    <PageLayout
      title="市場機会一覧"
      subtitle="多次元スコアリングで評価された全20件の事業機会"
      icon="🎯"
      breadcrumbs={[{ label: '市場機会' }]}
      actions={
        <div className="flex items-center gap-2">
          <ExportButton filename="market-radar-opportunities" />
          <Link
            href="/opportunities/compare"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-medium text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition-all"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            比較モード
          </Link>
        </div>
      }
    >
      <FilterBar opportunities={allOpportunities} onFiltered={setFiltered} />

      {/* Compare floating bar */}
      {compareIds.length > 0 && (
        <div className="sticky top-16 z-40 mb-4 rounded-xl border border-[#3d5a99]/20 bg-[#3d5a99]/5 backdrop-blur-sm px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[12px] text-[#2c4377]">
            <span className="font-semibold">{compareIds.length}/2 選択中</span>
            {compareIds.map(id => {
              const opp = allOpportunities.find(o => o.id === id)
              return opp ? (
                <Badge key={id} variant="brand" size="md">
                  {opp.title}
                  <button onClick={() => toggleCompare(id)} className="ml-1 text-[#3d5a99]/60 hover:text-[#3d5a99]">&times;</button>
                </Badge>
              ) : null
            })}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setCompareIds([])} className="text-[12px] text-slate-400 hover:text-slate-600">
              クリア
            </button>
            {compareIds.length === 2 && (
              <button
                onClick={() => router.push(`/opportunities/compare?ids=${compareIds.join(',')}`)}
                className="rounded-lg bg-[#3d5a99] px-4 py-1.5 text-[12px] font-medium text-white hover:bg-[#2c4377] transition-colors"
              >
                比較する →
              </button>
            )}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {filtered.map((opp, i) => (
          <AnimatedSection key={opp.id} delay={i * 0.05}>
            <div className="premium-card relative overflow-hidden p-6 group">
              {/* Actions: top right */}
              <div className="absolute right-4 top-4 flex items-center gap-2 z-10">
                <WatchlistButton isWatched={isWatched(opp.id)} onToggle={() => toggleWatch(opp.id)} />
                <button
                  onClick={(e) => { e.preventDefault(); toggleCompare(opp.id) }}
                  className={`inline-flex items-center justify-center h-7 w-7 rounded-full border transition-all ${
                    compareIds.includes(opp.id)
                      ? 'bg-[#3d5a99]/10 text-[#3d5a99] border-[#3d5a99]/30'
                      : 'bg-white/80 text-slate-300 border-slate-200/60 hover:text-[#3d5a99] hover:border-[#3d5a99]/30'
                  }`}
                  title="比較に追加"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </button>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-50 text-[11px] font-semibold text-slate-400">
                  #{i + 1}
                </span>
              </div>

              <Link href={`/opportunities/${opp.id}`} className="block">
                <div className="pr-28">
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
              </Link>
            </div>
          </AnimatedSection>
        ))}

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-[15px] font-medium text-slate-400">条件に合う機会が見つかりません</p>
            <p className="mt-1 text-[12px] text-slate-300">フィルターを調整してください</p>
          </div>
        )}
      </div>
    </PageLayout>
  )
}
