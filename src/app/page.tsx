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
import { DashboardSettings } from '@/components/DashboardSettings'
import { AlertSettings } from '@/components/AlertSettings'
import { ExportButton } from '@/components/ExportButton'
import { useDashboardSettings } from '@/hooks/useDashboardSettings'
import { useLiveSignals } from '@/hooks/useLiveSignals'
import { opportunities, analyticsSummary, defaultProvenance, trends } from '@/data'
import { SparkLine } from '@/components/MiniChart'
import { Badge } from '@/components/Badge'
import { ScoreBar } from '@/components/ScoreBar'

const dashboardFiveW1H = {
  what: 'SaaS ビルダー向けのマーケットインテリジェンスダッシュボード。事業機会の発見・スコアリング・市場規模分析・競合調査・Go-to-Market 戦略データを提供',
  who: 'インディーハッカー、個人開発者、SaaS を作る小規模チーム。マーケティングやコンサルの専門知識がなくても事業判断を行いたい人',
  when: 'アイデア検証段階から事業立ち上げまで。「このサービスは売れるのか？」を判断するタイミングで使う',
  where: '日本市場を主軸に、グローバルトレンドも包含。Product Hunt・App Store・Hacker News・GitHub の4ソースから分析',
  why: 'コンサルに¥500万払わなくても、同等の市場分析・競合調査・事業判断サポートを受けられる。一人でも戦略的に事業を立ち上げられる',
  how: '① リサーチで自由に質問 → ② 事業機会をスコアリングで比較 → ③ TAM/SAM/SOM で市場規模を把握 → ④ アクションプランに沿って実行',
}

export default function MarketRadarDashboard() {
  const { data, loading, error, refetch } = useMarketData()
  const { cards, toggleCard, resetAll, isVisible } = useDashboardSettings()
  const { data: liveSignals, loading: liveLoading, refetch: refetchLive } = useLiveSignals()

  const dataSources = [
    { name: 'Product Hunt', count: liveSignals?.totalDataPoints ?? 0, active: !!liveSignals, icon: '🚀' },
    { name: 'App Store', count: liveSignals?.sources.appStore.items ?? 0, active: liveSignals?.sources.appStore.status === 'success', icon: '📱' },
    { name: 'Hacker News', count: liveSignals?.sources.hackerNews.items ?? 0, active: liveSignals?.sources.hackerNews.status === 'success', icon: '🔶' },
    { name: 'データ分析エンジン', count: analyticsSummary.dataPointsCollected, active: true, icon: '🧠' },
  ]

  return (
    <div>
      {/* ── Hero Section ── */}
      <div className="relative overflow-hidden border-b border-slate-100 bg-white px-6 pb-10 pt-8 sm:px-8">
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-4 flex items-center gap-3 flex-wrap">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#3d5a99]/15 bg-[#3d5a99]/5 px-3 py-1">
              <span className="live-dot h-1.5 w-1.5 rounded-full bg-[#3d5a99]" />
              <span className="text-[12px] font-medium text-[#2c4377]">データ収集稼働中</span>
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
            <div className="ml-auto flex items-center gap-2">
              <AlertSettings />
              <DashboardSettings cards={cards} onToggle={toggleCard} onReset={resetAll} />
              <ExportButton filename="market-radar-dashboard" />
            </div>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            コンサルなしで<span className="gradient-text">事業判断</span>を
          </h1>
          <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-slate-500">
            マーケター不在でも大丈夫。市場分析・競合調査・収益予測・Go-to-Market 戦略データを提供。
            あなたの SaaS アイデアを、データドリブンに検証します。
          </p>

          {/* CTA: Research */}
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/research"
              className="inline-flex items-center gap-2 rounded-xl bg-[#2c4377] px-5 py-2.5 text-[13px] font-semibold text-white shadow-lg shadow-[#2c4377]/20 hover:bg-[#1e3461] transition-all"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
              </svg>
              マーケットリサーチを始める
            </Link>
            <Link
              href="/opportunities"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-[13px] font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all"
            >
              事業機会を見る
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="mt-8 flex flex-wrap gap-6">
            {[
              { value: `${analyticsSummary.dataPointsCollected.toLocaleString()}`, label: 'データポイント/日' },
              { value: `${analyticsSummary.sourcesActive}`, label: 'データソース' },
              { value: `${analyticsSummary.totalOpportunities}`, label: '事業機会' },
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
            <p className="text-sm font-medium text-rose-700">{error}</p>
          </div>
        )}

        {/* ═══ 5W1H Information Architecture ═══ */}
        {isVisible('fiveW1H') && (
          <AnimatedSection className="mb-10">
            <FiveW1HCard data={dashboardFiveW1H} />
          </AnimatedSection>
        )}

        {/* ═══ Key Metrics ═══ */}
        {isVisible('metrics') && (
          <AnimatedSection className="mb-10">
            <SectionHeader
              title="主要メトリクス"
              subtitle="市場概要"
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
                <StatCard label="事業機会" value={data?.stats.opportunities ?? '—'} accentColor="emerald"
                  icon={<svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>} />
              </StaggerItem>
              <StaggerItem>
                <StatCard label="平均収益" value={data?.stats.avgRevenue ? `¥${data.stats.avgRevenue.toLocaleString()}` : '—'} accentColor="amber"
                  icon={<svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>} />
              </StaggerItem>
            </StaggerGrid>
          </AnimatedSection>
        )}

        {/* ═══ Market Insights ═══ */}
        {isVisible('insights') && (
          <AnimatedSection className="mb-10" delay={0.05}>
            <SectionHeader
              title="AI インサイト"
              subtitle="市場の重要発見"
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
        )}

        {/* ═══ Trend Highlights ═══ */}
        {isVisible('highlights') && (
          <AnimatedSection className="mb-10" delay={0.1}>
            <SectionHeader
              title="注目プロダクト"
              subtitle="今話題のサービス"
              icon={<svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>}
              action={
                <Link href="/trends" className="text-[12px] font-medium text-[#3d5a99] hover:text-[#2c4377] transition-colors">
                  トレンド詳細 →
                </Link>
              }
            />
            <HighlightsTable highlights={data?.highlights} loading={loading} />
          </AnimatedSection>
        )}

        {/* ═══ Top Opportunities ═══ */}
        {isVisible('opportunities') && (
          <AnimatedSection className="mb-10" delay={0.12}>
            <SectionHeader
              title="事業機会 — Top 3"
              subtitle="コンサルが提案するレベルの機会分析"
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
                    <div className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-sm font-semibold text-slate-400">
                      #{i + 1}
                    </div>
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
                        <Badge variant="ghost" size="md">{opp.implementation.timeframe}</Badge>
                      </div>
                    </div>
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
                    <div className="mt-4 flex items-center gap-2 text-[12px] font-medium text-[#3d5a99] opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>詳細を見る（TAM/SAM/SOM、競合、リスク、アクションプラン）</span>
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </AnimatedSection>
        )}

        {/* ═══ Trending Topics ═══ */}
        {isVisible('trends') && (
          <AnimatedSection className="mb-10" delay={0.14}>
            <SectionHeader
              title="急上昇トレンド"
              subtitle="あなたの SaaS に関連する市場動向"
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
        )}

        {/* ═══ Categories ═══ */}
        {isVisible('categories') && (
          <AnimatedSection className="mb-10" delay={0.16}>
            <SectionHeader
              title="カテゴリ別成長率"
              subtitle="参入セグメントの選定に"
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
        )}

        {/* ═══ Live Market Signals ═══ */}
        {isVisible('liveSignals') && (
          <AnimatedSection className="mb-10" delay={0.17}>
            <SectionHeader
              title="ライブ市場シグナル"
              subtitle="HN・App Store からリアルタイム取得"
              icon={<span className="text-base">📡</span>}
              action={
                <button
                  onClick={refetchLive}
                  disabled={liveLoading}
                  className="text-[12px] font-medium text-[#3d5a99] hover:text-[#2c4377] transition-colors disabled:opacity-40"
                >
                  {liveLoading ? '取得中…' : '再取得 →'}
                </button>
              }
            />
            {liveLoading && !liveSignals ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="glass-card h-16 shimmer" />
                ))}
              </div>
            ) : liveSignals ? (
              <div className="space-y-4">
                {/* Hot Categories */}
                {liveSignals.hotCategories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {liveSignals.hotCategories.map((cat) => (
                      <span key={cat.category} className="inline-flex items-center gap-1.5 rounded-full bg-[#3d5a99]/8 px-3 py-1 text-[11px] font-semibold text-[#2c4377] border border-[#3d5a99]/15">
                        {cat.category}
                        <span className="rounded-full bg-[#3d5a99]/15 px-1.5 py-0.5 text-[10px]">{cat.count}</span>
                      </span>
                    ))}
                  </div>
                )}
                {/* Tech Signals from HN */}
                <div className="grid gap-3 sm:grid-cols-2">
                  {liveSignals.techSignals.slice(0, 6).map((signal, i) => (
                    <a
                      key={i}
                      href={String(signal.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass-card flex items-start gap-3 p-4 hover:border-[#3d5a99]/20 transition-colors group"
                    >
                      <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded bg-orange-50 text-[10px] font-bold text-orange-500 tabular-nums">
                        {signal.score}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] leading-relaxed text-slate-700 group-hover:text-[#3d5a99] transition-colors line-clamp-2">
                          {signal.title}
                        </p>
                        <div className="mt-1.5 flex items-center gap-2">
                          <Badge variant="ghost" size="sm">{signal.category}</Badge>
                          <span className="text-[10px] text-slate-300">🔶 {signal.source}</span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
                {/* App Store Signals */}
                {liveSignals.appSignals.length > 0 && (
                  <div>
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">📱 App Store 注目アプリ</p>
                    <div className="grid gap-2 sm:grid-cols-3">
                      {liveSignals.appSignals.slice(0, 6).map((app, i) => (
                        <div key={i} className="glass-card p-3">
                          <p className="text-[12px] font-medium text-slate-700 line-clamp-1">{app.name}</p>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-[10px] text-amber-500">★ {app.rating}</span>
                            <span className="text-[10px] text-slate-300">·</span>
                            <span className="text-[10px] text-slate-400">{app.price}</span>
                            <span className="text-[10px] text-slate-300">·</span>
                            <span className="text-[10px] text-slate-400">{app.category}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <p className="text-[10px] text-slate-300 text-right">
                  最終取得: {new Date(liveSignals.timestamp).toLocaleString('ja-JP')} · {liveSignals.totalDataPoints} データポイント
                </p>
              </div>
            ) : (
              <div className="glass-card p-6 text-center">
                <p className="text-[13px] text-slate-400">ライブデータの取得に失敗しました。再取得ボタンをお試しください。</p>
              </div>
            )}
          </AnimatedSection>
        )}

        {/* ═══ Data Sources ═══ */}
        {isVisible('dataSources') && (
          <AnimatedSection className="mb-10" delay={0.18}>
            <SectionHeader
              title="データ収集状況"
              subtitle="アクティブなデータソース"
              icon={<svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></svg>}
              action={
                <Link href="/methodology" className="text-[12px] font-medium text-[#3d5a99] hover:text-[#2c4377] transition-colors">
                  分析手法 →
                </Link>
              }
            />
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {dataSources.map((source, i) => (
                <DataSourceCard key={source.name} source={source} index={i} />
              ))}
            </div>
          </AnimatedSection>
        )}

        {/* ═══ Data Provenance ═══ */}
        {isVisible('provenance') && (
          <AnimatedSection className="mb-4" delay={0.2}>
            <ProvenanceCard data={defaultProvenance} />
          </AnimatedSection>
        )}

      </div>
    </div>
  )
}
