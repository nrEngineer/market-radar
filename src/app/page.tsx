'use client'

import Link from 'next/link'
import { useMarketData } from '@/hooks/useMarketData'
import { SectionHeader } from '@/components/SectionHeader'
import { StatCard } from '@/components/StatCard'
import { HighlightsTable } from '@/components/HighlightsTable'
import { CategoryCard } from '@/components/CategoryCard'
import { DataSourceCard } from '@/components/DataSourceCard'
import { FiveW1HCard } from '@/components/FiveW1HCard'
import { ProvenanceCard } from '@/components/ProvenanceCard'
import { AnimatedSection, StaggerGrid, StaggerItem } from '@/components/motion'
import { opportunities, analyticsSummary, defaultProvenance, trends } from '@/data'
import { SparkLine } from '@/components/MiniChart'
import { Badge } from '@/components/Badge'
import { ScoreBar } from '@/components/ScoreBar'

const dashboardFiveW1H = {
  what: '4つのデータソースから毎日収集する市場データの統合ダッシュボード。アプリ・Webサービスのトレンド、機会スコアリング、カテゴリ別成長率を一覧表示',
  who: '新規事業・プロダクト開発の意思決定者。市場参入タイミングを判断するファウンダー・PM・投資家',
  when: 'リアルタイム更新（3分間隔）。表示データは直近24時間〜6ヶ月の時系列。2026年2月18日時点',
  where: '日本市場を主軸に、グローバルトレンドも包含。App Store（日本）、Product Hunt（グローバル）、Hacker News（テック）',
  why: '意思決定スピードが競争優位に直結する時代。散在する市場情報を一箇所に集約し、機会の見逃しを防ぐ',
  how: '① ダッシュボードで全体傾向把握 → ② 注目トレンドからカテゴリに深掘り → ③ 機会詳細ページで事業判断 → ④ アクションプラン実行',
}

export default function MarketRadarDashboard() {
  const { data, loading, error, refetch } = useMarketData()

  const dataSources = [
    { name: 'Product Hunt', count: data?.highlights?.length ?? 3, active: true, icon: '🚀' },
    { name: 'App Store', count: data?.categories?.length ?? 4, active: true, icon: '📱' },
    { name: 'Hacker News', count: 15, active: true, icon: '🔶' },
    { name: '分析エンジン', count: 847, active: true, icon: '🧠' },
  ]

  return (
    <div>
      {/* ── Hero Section (Formal Light) ── */}
      <div className="relative overflow-hidden border-b border-slate-100 bg-white px-6 pb-10 pt-8 sm:px-8">
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-4 flex items-center gap-3 flex-wrap">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#3d5a99]/15 bg-[#3d5a99]/5 px-3 py-1">
              <span className="live-dot h-1.5 w-1.5 rounded-full bg-[#3d5a99]" />
              <span className="text-[12px] font-medium text-[#2c4377]">リアルタイム分析中</span>
              <span className="text-[12px] text-[#3d5a99]/30">·</span>
              <span className="text-[12px] text-[#3d5a99]/50">v3.0 Pro</span>
            </div>
            <button
              onClick={refetch}
              disabled={loading}
              className="btn-ghost flex items-center gap-2 rounded-lg px-3 py-1.5 text-[12px] font-medium text-slate-500 disabled:opacity-40"
            >
              <svg className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M3 12a9 9 0 019-9 9.75 9.75 0 016.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
              </svg>
              {loading ? '更新中…' : '更新'}
            </button>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            市場の脈動を<span className="gradient-text">プロ級精度</span>で捕捉
          </h1>
          <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-slate-500">
            4つのデータソースから毎日{analyticsSummary.dataPointsCollected.toLocaleString()}データポイントを収集・分析。
            TAM/SAM/SOM、競合マッピング、リスク評価まで — コンサルレポート不要の情報密度
          </p>
          {/* Quick Stats */}
          <div className="mt-6 flex flex-wrap gap-6">
            {[
              { value: `${analyticsSummary.dataPointsCollected.toLocaleString()}`, label: 'データポイント/日' },
              { value: `${analyticsSummary.sourcesActive}`, label: 'データソース' },
              { value: `${analyticsSummary.totalOpportunities}`, label: '検出機会' },
              { value: `${analyticsSummary.avgScore}`, label: '平均スコア' },
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-xl font-semibold tracking-tight text-slate-900">{stat.value}</p>
                <p className="text-[11px] font-medium text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="mx-auto max-w-7xl px-6 pb-12 pt-8 sm:px-8">

        {/* Error Banner */}
        {error && (
          <div className="mb-6 glass-card border-rose-200 bg-rose-50 p-4">
            <p className="text-sm font-medium text-rose-700">⚠️ {error}</p>
          </div>
        )}

        {/* ═══ 5W1H Information Architecture ═══ */}
        <AnimatedSection className="mb-10">
          <FiveW1HCard data={dashboardFiveW1H} />
        </AnimatedSection>

        {/* ═══ Key Metrics ═══ */}
        <AnimatedSection className="mb-10">
          <SectionHeader
            title="主要メトリクス"
            subtitle="リアルタイム市場概要"
            icon={<svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>}
          />
          <StaggerGrid className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StaggerItem>
              <StatCard label="アプリ数" value={data?.stats.totalApps.toLocaleString() ?? '—'} accentColor="brand"
                icon={<svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><rect x="5" y="2" width="14" height="20" rx="3" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>} />
            </StaggerItem>
            <StaggerItem>
              <StatCard label="Webサービス" value={data?.stats.totalWebServices.toLocaleString() ?? '—'} accentColor="cyan"
                icon={<svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></svg>} />
            </StaggerItem>
            <StaggerItem>
              <StatCard label="検出機会" value={data?.stats.opportunities ?? '—'} accentColor="emerald"
                icon={<svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>} />
            </StaggerItem>
            <StaggerItem>
              <StatCard label="平均収益" value={data?.stats.avgRevenue ? `¥${data.stats.avgRevenue.toLocaleString()}` : '—'} accentColor="amber"
                icon={<svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>} />
            </StaggerItem>
          </StaggerGrid>
        </AnimatedSection>

        {/* ═══ Market Insights (AI generated) ═══ */}
        <AnimatedSection className="mb-10" delay={0.05}>
          <SectionHeader
            title="マーケットインサイト"
            subtitle="AI分析による今月の重要発見"
            icon={<span className="text-base">💡</span>}
            action={
              <Link href="/analytics" className="text-[12px] font-medium text-[#3d5a99] hover:text-[#2c4377] transition-colors">
                詳細分析 →
              </Link>
            }
          />
          <div className="space-y-3">
            {analyticsSummary.marketInsights.map((insight, i) => (
              <div key={i} className="glass-card flex items-start gap-4 p-4 hover:border-slate-200 transition-colors">
                <div className={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-sm ${
                  insight.impact === 'positive' ? 'bg-emerald-50 text-emerald-600' :
                  insight.impact === 'negative' ? 'bg-rose-50 text-rose-600' :
                  'bg-amber-50 text-amber-600'
                }`}>
                  {insight.impact === 'positive' ? '📈' : insight.impact === 'negative' ? '📉' : '📊'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] leading-relaxed text-slate-700">{insight.insight}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <span className="text-[11px] text-slate-400">信頼度 {insight.confidence}%</span>
                    <span className="text-[11px] text-slate-300">·</span>
                    <span className="text-[11px] text-slate-400">Source: {insight.source}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* ═══ Trend Highlights ═══ */}
        <AnimatedSection className="mb-10" delay={0.1}>
          <SectionHeader
            title="注目トレンド"
            subtitle="スコア順にランキング"
            icon={<svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>}
            action={
              <Link href="/trends" className="text-[12px] font-medium text-[#3d5a99] hover:text-[#2c4377] transition-colors">
                トレンド詳細 →
              </Link>
            }
          />
          <HighlightsTable highlights={data?.highlights} loading={loading} />
        </AnimatedSection>

        {/* ═══ Top Opportunities (with drill-down links) ═══ */}
        <AnimatedSection className="mb-10" delay={0.12}>
          <SectionHeader
            title="市場機会 — Top 3"
            subtitle="AI推定・5W1H構造化・ファクトベース"
            icon={<span className="text-base">🎯</span>}
            action={
              <Link href="/opportunities" className="rounded-full bg-[#3d5a99]/8 px-3 py-1 text-[11px] font-medium text-[#2c4377] border border-[#3d5a99]/15 hover:bg-[#3d5a99]/12 transition-colors">
                全{analyticsSummary.totalOpportunities}件を見る →
              </Link>
            }
          />
          <div className="space-y-4">
            {opportunities.slice(0, 3).map((opp, i) => (
              <Link key={opp.id} href={`/opportunities/${opp.id}`} className="block group">
                <div className="premium-card relative overflow-hidden p-6 sm:p-7 cursor-pointer">
                  {/* Rank */}
                  <div className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-sm font-semibold text-slate-400">
                    #{i + 1}
                  </div>

                  {/* Header */}
                  <div className="pr-12">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                        opp.status === 'validated' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' :
                        opp.status === 'researching' ? 'bg-[#3d5a99]/8 text-[#2c4377] border-[#3d5a99]/15' :
                        'bg-amber-50 text-amber-700 border-amber-200/60'
                      }`}>
                        {opp.status === 'validated' ? '✅ 検証済み' : opp.status === 'researching' ? '📊 調査中' : '🔍 仮説'}
                      </span>
                    </div>
                    <h3 className="text-[17px] font-semibold tracking-tight text-slate-900 group-hover:text-[#3d5a99] transition-colors">
                      {opp.title}
                    </h3>
                    <p className="mt-1 text-[12px] text-slate-400">{opp.subtitle}</p>
                    <div className="mt-2.5 flex flex-wrap items-center gap-2">
                      <Badge variant="brand" size="md">{opp.category}</Badge>
                      <Badge variant={opp.risks.level === 'low' ? 'emerald' : opp.risks.level === 'medium' ? 'amber' : 'rose'} size="md" dot>
                        {opp.risks.level === 'low' ? '低リスク' : opp.risks.level === 'medium' ? '中リスク' : '高リスク'}
                      </Badge>
                      <Badge variant="ghost" size="md">⏱ {opp.implementation.timeframe}</Badge>
                    </div>
                  </div>

                  {/* Metrics Row */}
                  <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">予想収益</p>
                      <p className="mt-1 text-lg font-semibold text-slate-900">{opp.revenue.estimated}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">成長率</p>
                      <p className="mt-1 text-lg font-semibold text-emerald-600">{opp.market.growth}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">総合スコア</p>
                      <p className="mt-1 text-lg font-semibold text-[#3d5a99]">{opp.scores.overall}/100</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">投資総額</p>
                      <p className="mt-1 text-lg font-semibold text-slate-900">{opp.implementation.totalCost}</p>
                    </div>
                  </div>

                  {/* Score Details */}
                  <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
                    {[
                      { label: '市場規模', value: opp.scores.marketSize },
                      { label: '成長性', value: opp.scores.growth },
                      { label: '競合', value: opp.scores.competition },
                      { label: '実現性', value: opp.scores.feasibility },
                      { label: 'タイミング', value: opp.scores.timing },
                      { label: 'モート', value: opp.scores.moat },
                    ].map((s) => (
                      <div key={s.label}>
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-[10px] text-slate-400">{s.label}</span>
                          <span className="text-[10px] font-semibold text-slate-500 tabular-nums">{s.value}</span>
                        </div>
                        <ScoreBar score={s.value} showLabel={false} size="sm" />
                      </div>
                    ))}
                  </div>

                  {/* Evidence Row */}
                  {opp.evidence && (
                    <div className="mt-4 flex flex-wrap gap-3 border-t border-slate-100 pt-4">
                      {opp.evidence.productHunt && (
                        <span className="text-[11px] text-slate-400">🚀 PH #{opp.evidence.productHunt.rank} ({opp.evidence.productHunt.upvotes} votes)</span>
                      )}
                      {opp.evidence.appStore && (
                        <span className="text-[11px] text-slate-400">📱 ★{opp.evidence.appStore.rating} ({opp.evidence.appStore.reviews.toLocaleString()} reviews)</span>
                      )}
                      {opp.evidence.searchTrend && (
                        <span className="text-[11px] text-slate-400">🔍 検索 {opp.evidence.searchTrend.growth}</span>
                      )}
                      {opp.evidence.socialSignals && (
                        <span className="text-[11px] text-slate-400">💬 {opp.evidence.socialSignals.mentions.toLocaleString()} mentions</span>
                      )}
                    </div>
                  )}

                  {/* CTA */}
                  <div className="mt-4 flex items-center gap-2 text-[12px] font-medium text-[#3d5a99] opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>詳細分析を見る（TAM/SAM/SOM、競合、リスク、アクションプラン）</span>
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </AnimatedSection>

        {/* ═══ Trending Topics with Spark Lines ═══ */}
        <AnimatedSection className="mb-10" delay={0.14}>
          <SectionHeader
            title="急上昇トレンド"
            subtitle="モメンタム・採用段階・インパクト予測"
            icon={<span className="text-base">🔥</span>}
            action={
              <Link href="/trends" className="text-[12px] font-medium text-[#3d5a99] hover:text-[#2c4377] transition-colors">
                トレンド一覧 →
              </Link>
            }
          />
          <div className="grid gap-4 sm:grid-cols-3">
            {trends.map((trend) => (
              <div key={trend.id} className="glass-card p-5 hover:border-[#3d5a99]/15 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-[14px] font-semibold text-slate-800">{trend.name}</h4>
                    <p className="text-[11px] text-slate-400">{trend.category}</p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
                    trend.status === 'emerging' ? 'bg-violet-50 text-violet-700 border-violet-200/60' :
                    trend.status === 'growing' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60' :
                    'bg-amber-50 text-amber-700 border-amber-200/60'
                  }`}>
                    {trend.status === 'emerging' ? '🌱 新興' : trend.status === 'growing' ? '📈 成長' : '🏛️ 成熟'}
                  </span>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[11px] text-slate-400 mb-1">モメンタム</p>
                    <p className={`text-2xl font-bold tabular-nums ${
                      trend.momentum >= 80 ? 'text-emerald-600' : trend.momentum >= 50 ? 'text-[#3d5a99]' : 'text-amber-600'
                    }`}>{trend.momentum}</p>
                  </div>
                  <SparkLine data={trend.searchVolume.map(s => s.value)} color={trend.momentum >= 80 ? 'emerald' : 'indigo'} />
                </div>
                <div className="mt-3 border-t border-slate-100 pt-3">
                  <p className="text-[11px] text-slate-400">インパクト: <span className={`font-semibold ${
                    trend.impact === 'transformative' ? 'text-violet-600' : 'text-[#3d5a99]'
                  }`}>{trend.impact === 'transformative' ? '🔮 変革的' : trend.impact === 'high' ? '🔥 高' : '📊 中'}</span></p>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* ═══ Categories ═══ */}
        <AnimatedSection className="mb-10" delay={0.16}>
          <SectionHeader
            title="カテゴリ別成長率"
            subtitle="各セグメントのパフォーマンス"
            icon={<svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /></svg>}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {data?.categories ? (
              data.categories.map((cat, i) => (
                <Link key={cat.name} href={`/categories/${cat.name.toLowerCase().replace(/\s+/g, '-')}`}>
                  <CategoryCard category={cat} index={i} />
                </Link>
              ))
            ) : loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="glass-card h-20 shimmer" />
              ))
            ) : null}
          </div>
        </AnimatedSection>

        {/* ═══ Data Sources & Quality ═══ */}
        <AnimatedSection className="mb-10" delay={0.18}>
          <SectionHeader
            title="データ収集状況"
            subtitle="アクティブなデータソース"
            icon={<svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></svg>}
            action={
              <Link href="/methodology" className="text-[12px] font-medium text-[#3d5a99] hover:text-[#2c4377] transition-colors">
                調査手法 →
              </Link>
            }
          />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {dataSources.map((source, i) => (
              <DataSourceCard key={source.name} source={source} index={i} />
            ))}
          </div>
        </AnimatedSection>

        {/* ═══ Data Provenance ═══ */}
        <AnimatedSection className="mb-4" delay={0.2}>
          <ProvenanceCard data={defaultProvenance} />
        </AnimatedSection>

      </div>
    </div>
  )
}
