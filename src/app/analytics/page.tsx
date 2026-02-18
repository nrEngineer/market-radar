'use client'

import { PageLayout } from '@/components/PageLayout'
import { MiniBarChart } from '@/components/MiniChart'
import { ScoreBar } from '@/components/ScoreBar'
import { AnimatedSection } from '@/components/motion'
import { analyticsSummary } from '@/lib/data'

export default function AnalyticsPage() {
  return (
    <PageLayout
      title="詳細分析ダッシュボード"
      subtitle={`${analyticsSummary.period} · ${analyticsSummary.dataPointsCollected.toLocaleString()}データポイント収集済み`}
      icon="📊"
      breadcrumbs={[{ label: '詳細分析' }]}
    >
      {/* Key KPIs */}
      <AnimatedSection className="mb-8">
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {[
            { label: '総機会数', value: analyticsSummary.totalOpportunities, sub: `新規 ${analyticsSummary.newOpportunities}件` },
            { label: '検証済み', value: analyticsSummary.validatedOpportunities, sub: `${Math.round(analyticsSummary.validatedOpportunities / analyticsSummary.totalOpportunities * 100)}%` },
            { label: '平均スコア', value: analyticsSummary.avgScore, sub: '/100' },
            { label: 'ソース稼働', value: `${analyticsSummary.sourcesActive}/4`, sub: '全ソース正常' },
          ].map((kpi) => (
            <div key={kpi.label} className="glass-card p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{kpi.label}</p>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{kpi.value}</p>
              <p className="mt-1 text-[12px] text-slate-400">{kpi.sub}</p>
            </div>
          ))}
        </div>
      </AnimatedSection>

      {/* Weekly Trend */}
      <AnimatedSection className="mb-8" delay={0.05}>
        <div className="glass-card overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-4">
            <h3 className="text-[15px] font-semibold text-slate-900">📈 週次推移</h3>
            <p className="text-[12px] text-slate-400">機会検出数と平均スコアの推移</p>
          </div>
          <div className="p-6">
            <MiniBarChart
              data={analyticsSummary.weeklyTrend.map(w => ({ label: w.week, value: w.opportunities }))}
              height={100}
              color="indigo"
            />
            <div className="mt-4 grid grid-cols-4 gap-4">
              {analyticsSummary.weeklyTrend.map((w) => (
                <div key={w.week} className="text-center">
                  <p className="text-[13px] font-semibold text-slate-900">{w.opportunities}件</p>
                  <p className="text-[11px] text-slate-400">Avg {w.avgScore}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Category Distribution */}
      <AnimatedSection className="mb-8" delay={0.1}>
        <div className="grid gap-4 sm:grid-cols-2">
          {/* By Category */}
          <div className="glass-card overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-4">
              <h3 className="text-[15px] font-semibold text-slate-900">🏷️ カテゴリ分布</h3>
            </div>
            <div className="p-6 space-y-4">
              {analyticsSummary.categoryDistribution.map((cat) => (
                <div key={cat.category}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[13px] font-medium text-slate-800">{cat.category}</span>
                    <span className="text-[12px] text-slate-400">{cat.count}件 · Avg {cat.avgScore}</span>
                  </div>
                  <ScoreBar score={cat.count} maxScore={40} showLabel={false} size="md" />
                </div>
              ))}
            </div>
          </div>

          {/* Risk Distribution */}
          <div className="glass-card overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-4">
              <h3 className="text-[15px] font-semibold text-slate-900">⚠️ リスク分布</h3>
            </div>
            <div className="p-6 space-y-4">
              {analyticsSummary.riskDistribution.map((risk) => (
                <div key={risk.level}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[13px] font-medium text-slate-800">{risk.level}</span>
                    <span className="text-[12px] text-slate-400">{risk.count}件 ({risk.percentage}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div
                      className={`h-2 rounded-full ${
                        risk.level === '低リスク' ? 'bg-emerald-500' :
                        risk.level === '中リスク' ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${risk.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="border-t border-slate-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3d5a99]/8 text-sm">📋</div>
                <div>
                  <p className="text-[13px] text-slate-800">ポートフォリオ健全性: <span className="font-semibold text-emerald-600">良好</span></p>
                  <p className="text-[11px] text-slate-400">低リスク機会が31%を占め、バランスの取れた分布</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Top Insights */}
      <AnimatedSection className="mb-8" delay={0.15}>
        <div className="glass-card overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-4">
            <h3 className="text-[15px] font-semibold text-slate-900">💡 今月のキーインサイト</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {analyticsSummary.marketInsights.map((insight, i) => (
              <div key={i} className="flex items-start gap-4 px-6 py-4">
                <div className={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-sm ${
                  insight.impact === 'positive' ? 'bg-emerald-50' :
                  insight.impact === 'negative' ? 'bg-rose-50' :
                  'bg-amber-50'
                }`}>
                  {insight.impact === 'positive' ? '📈' : insight.impact === 'negative' ? '📉' : '📊'}
                </div>
                <div className="flex-1">
                  <p className="text-[13px] leading-relaxed text-slate-700">{insight.insight}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] text-slate-400">信頼度:</span>
                      <span className={`text-[11px] font-semibold ${
                        insight.confidence >= 85 ? 'text-emerald-600' : 'text-amber-600'
                      }`}>{insight.confidence}%</span>
                    </div>
                    <span className="text-[11px] text-slate-300">·</span>
                    <span className="text-[11px] text-slate-400">{insight.source}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Performance Metrics */}
      <AnimatedSection delay={0.2}>
        <div className="glass-card overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-4">
            <h3 className="text-[15px] font-semibold text-slate-900">⚡ システムパフォーマンス</h3>
          </div>
          <div className="grid gap-px sm:grid-cols-3">
            <div className="p-5 border-r border-slate-50">
              <p className="text-[11px] text-slate-400">データポイント/日</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{analyticsSummary.dataPointsCollected.toLocaleString()}</p>
            </div>
            <div className="p-5 border-r border-slate-50">
              <p className="text-[11px] text-slate-400">成長トップカテゴリ</p>
              <p className="text-xl font-bold text-[#3d5a99] mt-1">{analyticsSummary.topGrowthArea}</p>
            </div>
            <div className="p-5">
              <p className="text-[11px] text-slate-400">トップカテゴリ</p>
              <p className="text-xl font-bold text-emerald-600 mt-1">{analyticsSummary.topCategory}</p>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </PageLayout>
  )
}
