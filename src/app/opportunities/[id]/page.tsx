'use client'

import { use } from 'react'
import { notFound } from 'next/navigation'
import { PageLayout } from '@/components/PageLayout'
import { FiveW1HCard } from '@/components/FiveW1HCard'
import { ProvenanceCard } from '@/components/ProvenanceCard'
import { MarketSizingCard } from '@/components/MarketSizingCard'
import { RiskMatrix, ScenarioAnalysis } from '@/components/RiskMatrix'
import { ScoreBar } from '@/components/ScoreBar'
// Badge component available from '@/components/Badge'
import { MiniBarChart } from '@/components/MiniChart'
import { AnimatedSection } from '@/components/motion'
import { opportunities } from '@/lib/data'
import { formatCurrency } from '@/lib/utils'

export default function OpportunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const opp = opportunities.find((o) => o.id === id)

  if (!opp) {
    notFound()
  }

  return (
    <PageLayout
      title={opp.title}
      subtitle={opp.subtitle}
      icon="🎯"
      breadcrumbs={[
        { label: '市場機会', href: '/opportunities' },
        { label: opp.title },
      ]}
      actions={
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-3 py-1 text-[12px] font-semibold border ${
            opp.status === 'validated' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' :
            opp.status === 'researching' ? 'bg-[#3d5a99]/8 text-[#2c4377] border-[#3d5a99]/15' :
            'bg-amber-50 text-amber-700 border-amber-200/60'
          }`}>
            {opp.status === 'validated' ? '✅ 検証済み' : opp.status === 'researching' ? '📊 調査中' : '🔍 仮説'}
          </span>
        </div>
      }
    >
      {/* ═══ Overall Score & Key Metrics ═══ */}
      <AnimatedSection className="mb-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="glass-card p-5 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">総合スコア</p>
            <p className="mt-2 text-4xl font-bold text-[#3d5a99] tabular-nums">{opp.scores.overall}</p>
            <p className="mt-1 text-[11px] text-slate-400">/100</p>
          </div>
          <div className="glass-card p-5 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">予想収益</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{opp.revenue.estimated}</p>
            <p className="mt-1 text-[11px] text-slate-400">
              range: {formatCurrency(opp.revenue.range.min)} - {formatCurrency(opp.revenue.range.max)}
            </p>
          </div>
          <div className="glass-card p-5 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">成長率 / CAGR</p>
            <p className="mt-2 text-2xl font-bold text-emerald-600">{opp.market.growth}</p>
            <p className="mt-1 text-[11px] text-slate-400">CAGR {opp.market.sizing.cagr}%</p>
          </div>
          <div className="glass-card p-5 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">BEP / 投資額</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{opp.revenue.breakEven}</p>
            <p className="mt-1 text-[11px] text-slate-400">初期投資 {opp.implementation.totalCost}</p>
          </div>
        </div>
      </AnimatedSection>

      {/* ═══ Scoring Radar ═══ */}
      <AnimatedSection className="mb-8" delay={0.05}>
        <div className="glass-card overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-4">
            <h3 className="text-[15px] font-semibold text-slate-900">📊 多次元スコアリング</h3>
            <p className="text-[12px] text-slate-400">6つの評価軸で機会を定量化</p>
          </div>
          <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: '市場規模', value: opp.scores.marketSize, desc: 'TAM/SAMの大きさ' },
              { label: '成長性', value: opp.scores.growth, desc: '市場成長率・CAGR' },
              { label: '競合環境', value: opp.scores.competition, desc: '参入障壁・競争強度（低=激戦）' },
              { label: '実現可能性', value: opp.scores.feasibility, desc: '技術・リソースの準備度' },
              { label: 'タイミング', value: opp.scores.timing, desc: '市場参入の最適度' },
              { label: 'モート（堀）', value: opp.scores.moat, desc: '持続的競争優位の構築度' },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <span className="text-[13px] font-medium text-slate-800">{s.label}</span>
                    <p className="text-[10px] text-slate-400">{s.desc}</p>
                  </div>
                  <span className={`text-lg font-bold tabular-nums ${
                    s.value >= 90 ? 'text-emerald-600' : s.value >= 75 ? 'text-[#3d5a99]' : s.value >= 60 ? 'text-amber-600' : 'text-rose-600'
                  }`}>{s.value}</span>
                </div>
                <ScoreBar score={s.value} showLabel={false} size="md" variant={s.value >= 75 ? 'emerald' : 'brand'} />
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ═══ 5W1H ═══ */}
      <AnimatedSection className="mb-8" delay={0.08}>
        <FiveW1HCard data={opp.fiveW1H} />
      </AnimatedSection>

      {/* ═══ TAM/SAM/SOM ═══ */}
      <AnimatedSection className="mb-8" delay={0.1}>
        <MarketSizingCard data={opp.market.sizing} />
      </AnimatedSection>

      {/* ═══ Revenue Projections ═══ */}
      <AnimatedSection className="mb-8" delay={0.12}>
        <div className="glass-card overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-4">
            <h3 className="text-[15px] font-semibold text-slate-900">💰 収益予測</h3>
            <p className="text-[12px] text-slate-400">モデル: {opp.revenue.model} · 粗利率 {opp.revenue.margins.gross}% · 純利率 {opp.revenue.margins.net}%</p>
          </div>
          <div className="p-6">
            <MiniBarChart
              data={opp.revenue.projections.map(p => ({
                label: p.month.slice(5),
                value: p.value,
              }))}
              height={120}
              color="emerald"
            />
            <div className="mt-4 grid grid-cols-3 gap-4 sm:grid-cols-5">
              {opp.revenue.projections.slice(0, 5).map((p) => (
                <div key={p.month} className="text-center">
                  <p className="text-[11px] text-slate-400">{p.month.slice(5)}月</p>
                  <p className="text-[13px] font-semibold text-slate-900">{formatCurrency(p.value, true)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* ═══ Risk Assessment ═══ */}
      <AnimatedSection className="mb-8" delay={0.14}>
        <RiskMatrix factors={opp.risks.factors} />
      </AnimatedSection>

      {/* ═══ Scenario Analysis ═══ */}
      <AnimatedSection className="mb-8" delay={0.15}>
        <ScenarioAnalysis scenarios={opp.risks.scenarios} />
      </AnimatedSection>

      {/* ═══ Evidence & Signals ═══ */}
      <AnimatedSection className="mb-8" delay={0.16}>
        <div className="glass-card overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-4">
            <h3 className="text-[15px] font-semibold text-slate-900">📡 エビデンス・市場シグナル</h3>
            <p className="text-[12px] text-slate-400">データソースごとの裏付け情報</p>
          </div>
          <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Product Hunt', icon: '🚀', data: opp.evidence.productHunt, render: (d: typeof opp.evidence.productHunt) => d ? `#${d.rank} (${d.upvotes} votes)` : 'N/A' },
              { label: 'App Store', icon: '📱', data: opp.evidence.appStore, render: (d: typeof opp.evidence.appStore) => d ? `★${d.rating} (${d.reviews.toLocaleString()} reviews)` : 'N/A' },
              { label: '検索トレンド', icon: '🔍', data: opp.evidence.searchTrend, render: (d: typeof opp.evidence.searchTrend) => d ? `${d.volume.toLocaleString()}/月 ${d.growth}` : 'N/A' },
              { label: 'ソーシャル', icon: '💬', data: opp.evidence.socialSignals, render: (d: typeof opp.evidence.socialSignals) => d ? `${d.mentions.toLocaleString()} mentions (感情${d.sentiment}%)` : 'N/A' },
            ].map((item) => (
              <div key={item.label} className="p-5 border-r border-b border-slate-50">
                <p className="text-[11px] text-slate-400 mb-1">{item.icon} {item.label}</p>
                <p className={`text-[14px] font-semibold ${item.data ? 'text-slate-900' : 'text-slate-300'}`}>
                  {item.render(item.data as never)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ═══ Implementation Plan ═══ */}
      <AnimatedSection className="mb-8" delay={0.18}>
        <div className="glass-card overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[15px] font-semibold text-slate-900">🗺️ 実装ロードマップ</h3>
                <p className="text-[12px] text-slate-400">期間 {opp.implementation.timeframe} · チーム {opp.implementation.teamSize}</p>
              </div>
              <div className="flex flex-wrap gap-1">
                {opp.implementation.techStack.map((t) => (
                  <span key={t} className="rounded-full bg-[#3d5a99]/8 px-2 py-0.5 text-[10px] font-medium text-[#2c4377] border border-[#3d5a99]/15">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-[#3d5a99]/40 via-[#3d5a99]/20 to-transparent" />
              
              <div className="space-y-6">
                {opp.implementation.phases.map((phase, i) => (
                  <div key={i} className="relative ml-10">
                    {/* Dot */}
                    <div className="absolute -left-[1.65rem] top-1 h-3 w-3 rounded-full border-2 border-[#3d5a99] bg-white" />
                    
                    <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-[14px] font-semibold text-slate-900">Phase {i + 1}: {phase.name}</h4>
                        <div className="flex items-center gap-3">
                          <span className="text-[12px] text-slate-400">📅 {phase.duration}</span>
                          <span className="text-[12px] font-semibold text-amber-600">{phase.cost}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {phase.tasks.map((task, ti) => (
                          <span key={ti} className="rounded-lg bg-white px-2.5 py-1 text-[12px] text-slate-500 border border-slate-100">
                            {task}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* ═══ Competitors ═══ */}
      {opp.competitors.length > 0 && (
        <AnimatedSection className="mb-8" delay={0.2}>
          <div className="glass-card overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-4">
              <h3 className="text-[15px] font-semibold text-slate-900">🏢 競合分析</h3>
              <p className="text-[12px] text-slate-400">{opp.competitors.length}社の主要競合</p>
            </div>
            <div className="divide-y divide-slate-50">
              {opp.competitors.map((comp) => (
                <div key={comp.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-[15px] font-semibold text-slate-900">{comp.name}</h4>
                      <p className="text-[12px] text-slate-400">{comp.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] text-slate-400">市場シェア</p>
                      <p className="text-lg font-bold text-[#3d5a99]">{comp.marketShare}%</p>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-4 mb-4">
                    <div><p className="text-[11px] text-slate-400">設立</p><p className="text-[13px] text-slate-800">{comp.founded}年</p></div>
                    <div><p className="text-[11px] text-slate-400">資金調達</p><p className="text-[13px] text-slate-800">{comp.funding}</p></div>
                    <div><p className="text-[11px] text-slate-400">従業員</p><p className="text-[13px] text-slate-800">{comp.employees}</p></div>
                    <div><p className="text-[11px] text-slate-400">売上</p><p className="text-[13px] text-slate-800">{comp.revenue}</p></div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-[11px] font-semibold text-emerald-600 mb-1.5">💪 強み</p>
                      <div className="flex flex-wrap gap-1">
                        {comp.strengths.map((s, i) => (
                          <span key={i} className="rounded bg-emerald-50 px-2 py-0.5 text-[11px] text-emerald-700">{s}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-rose-600 mb-1.5">⚡ 弱み</p>
                      <div className="flex flex-wrap gap-1">
                        {comp.weaknesses.map((w, i) => (
                          <span key={i} className="rounded bg-rose-50 px-2 py-0.5 text-[11px] text-rose-700">{w}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* ═══ Target Segments & Personas ═══ */}
      {opp.targetSegments.length > 0 && (
        <AnimatedSection className="mb-8" delay={0.22}>
          <div className="glass-card overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-4">
              <h3 className="text-[15px] font-semibold text-slate-900">👥 ターゲットセグメント & ペルソナ</h3>
            </div>
            <div className="divide-y divide-slate-50">
              {opp.targetSegments.map((seg) => (
                <div key={seg.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-[15px] font-semibold text-slate-900">{seg.name}</h4>
                      <p className="text-[12px] text-slate-400">{seg.size} · 市場の{seg.percentage}%</p>
                    </div>
                  </div>
                  
                  <div className="grid gap-4 sm:grid-cols-3 mb-4">
                    <div><p className="text-[11px] text-slate-400">CAC</p><p className="text-[13px] font-semibold text-slate-900">{seg.acquisitionCost}</p></div>
                    <div><p className="text-[11px] text-slate-400">LTV</p><p className="text-[13px] font-semibold text-emerald-600">{seg.ltv}</p></div>
                    <div><p className="text-[11px] text-slate-400">支払意欲</p><p className="text-[13px] font-semibold text-[#3d5a99]">{seg.willingness}%</p></div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 mb-4">
                    <div>
                      <p className="text-[11px] font-semibold text-slate-500 mb-1">特徴</p>
                      <div className="flex flex-wrap gap-1">
                        {seg.characteristics.map((c, i) => (
                          <span key={i} className="rounded bg-slate-50 px-2 py-0.5 text-[11px] text-slate-600 border border-slate-100">{c}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-rose-600 mb-1">ペインポイント</p>
                      <div className="flex flex-wrap gap-1">
                        {seg.painPoints.map((p, i) => (
                          <span key={i} className="rounded bg-rose-50 px-2 py-0.5 text-[11px] text-rose-700">{p}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Persona Card */}
                  <div className="rounded-xl bg-[#3d5a99]/5 border border-[#3d5a99]/10 p-4">
                    <p className="text-[11px] font-semibold text-[#3d5a99] mb-2">🎭 ペルソナ</p>
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3d5a99]/15 text-lg flex-shrink-0 text-[#2c4377]">
                        {seg.persona.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-slate-900">{seg.persona.name}（{seg.persona.age}）</p>
                        <p className="text-[12px] text-slate-500">{seg.persona.role}</p>
                        <p className="mt-2 text-[12px] italic text-[#2c4377]/80">{seg.persona.quote}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {seg.persona.goals.map((g, i) => (
                            <span key={i} className="text-[10px] text-emerald-600">🎯 {g}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* ═══ Next Steps ═══ */}
      <AnimatedSection className="mb-8" delay={0.24}>
        <div className="glass-card overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-4">
            <h3 className="text-[15px] font-semibold text-slate-900">✅ アクションプラン</h3>
            <p className="text-[12px] text-slate-400">優先度順の次ステップ</p>
          </div>
          <div className="divide-y divide-slate-50">
            {opp.nextSteps.map((step, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-[12px] font-bold ${
                  step.priority === 1 ? 'bg-rose-50 text-rose-600' :
                  step.priority === 2 ? 'bg-amber-50 text-amber-600' :
                  'bg-slate-100 text-slate-500'
                }`}>
                  P{step.priority}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-slate-800">{step.action}</p>
                  <p className="text-[11px] text-slate-400">{step.owner}</p>
                </div>
                <span className="text-[12px] text-slate-400 flex-shrink-0">{step.deadline}</span>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ═══ Data Provenance ═══ */}
      <AnimatedSection delay={0.26}>
        <ProvenanceCard data={opp.provenance} />
      </AnimatedSection>

      {/* Tags */}
      <div className="mt-6 flex flex-wrap gap-2">
        {opp.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-slate-50 px-3 py-1 text-[11px] text-slate-500 border border-slate-200/60">
            #{tag}
          </span>
        ))}
      </div>
    </PageLayout>
  )
}
