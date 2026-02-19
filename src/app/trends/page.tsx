'use client'

import { PageLayout } from '@/components/PageLayout'
import { FiveW1HCard } from '@/components/FiveW1HCard'
import { ProvenanceCard } from '@/components/ProvenanceCard'
import { MiniBarChart } from '@/components/MiniChart'
import { AnimatedSection } from '@/components/motion'
import { trends } from '@/data'
import { getAdoptionLabel } from '@/domain/formatting'

export default function TrendsPage() {
  return (
    <PageLayout
      title="トレンド分析 & 予測"
      subtitle="市場シグナルの検出・分類・将来予測。データソースからの複合分析"
      icon="📈"
      breadcrumbs={[{ label: 'トレンド分析' }]}
    >
      {/* Trend Cards */}
      {trends.map((trend, idx) => (
        <AnimatedSection key={trend.id} className="mb-8" delay={idx * 0.05}>
          <div className="glass-card overflow-hidden">
            {/* Header */}
            <div className="border-b border-slate-100 px-6 py-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${
                      trend.status === 'emerging' ? 'bg-violet-50 text-violet-700 border-violet-200/60' :
                      trend.status === 'growing' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' :
                      'bg-amber-50 text-amber-700 border-amber-200/60'
                    }`}>
                      {trend.status === 'emerging' ? '🌱 新興' : trend.status === 'growing' ? '📈 成長中' : '🏛️ 成熟'}
                    </span>
                    <span className="text-[11px] text-slate-400">{trend.category}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">{trend.name}</h3>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-slate-400">モメンタム</p>
                  <p className={`text-3xl font-bold tabular-nums ${
                    trend.momentum >= 80 ? 'text-emerald-600' : trend.momentum >= 50 ? 'text-[#3d5a99]' : 'text-amber-600'
                  }`}>{trend.momentum}</p>
                </div>
              </div>
            </div>

            {/* Search Volume Chart */}
            <div className="border-b border-slate-100 p-6">
              <p className="text-[12px] font-semibold text-slate-500 mb-3">📊 検索ボリューム推移（月次）</p>
              <MiniBarChart
                data={trend.searchVolume.map(sv => ({
                  label: sv.month.slice(5),
                  value: sv.value,
                }))}
                height={100}
                color={trend.momentum >= 80 ? 'emerald' : 'indigo'}
              />
            </div>

            {/* Key Metrics Row */}
            <div className="grid gap-px sm:grid-cols-4 border-b border-slate-100">
              <div className="p-4">
                <p className="text-[11px] text-slate-400">採用段階</p>
                <p className="text-[13px] font-semibold text-slate-800 mt-1">{getAdoptionLabel(trend.adoptionCurve)}</p>
              </div>
              <div className="p-4">
                <p className="text-[11px] text-slate-400">インパクト</p>
                <p className={`text-[13px] font-semibold mt-1 ${
                  trend.impact === 'transformative' ? 'text-violet-600' : trend.impact === 'high' ? 'text-[#3d5a99]' : 'text-amber-600'
                }`}>
                  {trend.impact === 'transformative' ? '🔮 変革的' : trend.impact === 'high' ? '🔥 高' : '📊 中'}
                </p>
              </div>
              <div className="p-4">
                <p className="text-[11px] text-slate-400">タイムフレーム</p>
                <p className="text-[13px] font-semibold text-slate-800 mt-1">{trend.timeframe}</p>
              </div>
              <div className="p-4">
                <p className="text-[11px] text-slate-400">関連トレンド</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {trend.relatedTrends.map(t => (
                    <span key={t} className="rounded bg-slate-50 px-1.5 py-0.5 text-[10px] text-slate-500">{t}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Signals */}
            <div className="border-b border-slate-100 p-6">
              <p className="text-[12px] font-semibold text-slate-500 mb-3">📡 検出シグナル</p>
              <div className="space-y-2">
                {trend.signals.map((signal, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-lg bg-slate-50 p-3 border border-slate-100">
                    <div className={`flex h-6 w-6 items-center justify-center rounded text-[10px] font-bold flex-shrink-0 ${
                      signal.strength >= 85 ? 'bg-emerald-50 text-emerald-700' : 'bg-[#3d5a99]/8 text-[#3d5a99]'
                    }`}>
                      {signal.strength}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] text-slate-700">{signal.signal}</p>
                      <p className="text-[10px] text-slate-400">{signal.source} · {signal.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Predictions */}
            <div className="border-b border-slate-100 p-6">
              <p className="text-[12px] font-semibold text-slate-500 mb-3">🔮 予測</p>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { label: '短期（3-6ヶ月）', text: trend.prediction.shortTerm, bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200/60', textColor: 'text-emerald-700' },
                  { label: '中期（6-18ヶ月）', text: trend.prediction.midTerm, bgColor: 'bg-[#3d5a99]/5', borderColor: 'border-[#3d5a99]/10', textColor: 'text-[#2c4377]' },
                  { label: '長期（18-36ヶ月）', text: trend.prediction.longTerm, bgColor: 'bg-violet-50', borderColor: 'border-violet-200/60', textColor: 'text-violet-700' },
                ].map((p) => (
                  <div key={p.label} className={`rounded-xl border ${p.borderColor} ${p.bgColor} p-4`}>
                    <p className={`text-[11px] font-semibold ${p.textColor} mb-1.5`}>{p.label}</p>
                    <p className="text-[12px] leading-relaxed text-slate-600">{p.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 5W1H */}
            <div className="p-6">
              <FiveW1HCard data={trend.fiveW1H} />
            </div>
          </div>
        </AnimatedSection>
      ))}

      {/* Data Provenance */}
      <AnimatedSection delay={0.3}>
        <ProvenanceCard data={trends[0].provenance} />
      </AnimatedSection>
    </PageLayout>
  )
}
