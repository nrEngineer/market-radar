'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { PageLayout } from '@/components/PageLayout'
import { Badge } from '@/components/Badge'
import { ScoreBar } from '@/components/ScoreBar'
import { AnimatedSection } from '@/components/motion'
import { formatCurrency } from '@/domain/formatting'
import { opportunities } from '@/data'
import type { OpportunityDetail } from '@/domain/types'

// ── Score labels for the 6 dimensions ──
const SCORE_DIMENSIONS: { key: keyof OpportunityDetail['scores']; label: string; desc: string }[] = [
  { key: 'marketSize', label: '市場規模', desc: 'TAM/SAMの大きさ' },
  { key: 'growth', label: '成長性', desc: '市場成長率・CAGR' },
  { key: 'competition', label: '競合環境', desc: '参入障壁・競争強度' },
  { key: 'feasibility', label: '実現可能性', desc: '技術・リソース準備度' },
  { key: 'timing', label: 'タイミング', desc: '市場参入の最適度' },
  { key: 'moat', label: 'モート（堀）', desc: '持続的競争優位' },
]

// ── Winner indicator ──
function WinnerBadge({ show }: { show: boolean }) {
  if (!show) return null
  return (
    <span className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 text-[10px] text-emerald-700">
      ✓
    </span>
  )
}

// ── Section header ──
function SectionHeader({ emoji, title, subtitle }: { emoji: string; title: string; subtitle?: string }) {
  return (
    <div className="border-b border-slate-100 px-6 py-4">
      <h3 className="text-[15px] font-semibold text-slate-900">
        {emoji} {title}
      </h3>
      {subtitle && <p className="text-[12px] text-slate-400">{subtitle}</p>}
    </div>
  )
}

// ── Comparison row: label + two values ──
function CompareRow({
  label,
  valueA,
  valueB,
  winnerA,
  winnerB,
}: {
  label: string
  valueA: React.ReactNode
  valueB: React.ReactNode
  winnerA?: boolean
  winnerB?: boolean
}) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 py-3 border-b border-slate-50 last:border-0">
      <div className="flex items-center justify-end gap-1 text-right">
        <span className="text-[13px] text-slate-800">{valueA}</span>
        <WinnerBadge show={!!winnerA} />
      </div>
      <div className="w-24 text-center text-[11px] font-medium text-slate-400">{label}</div>
      <div className="flex items-center gap-1">
        <span className="text-[13px] text-slate-800">{valueB}</span>
        <WinnerBadge show={!!winnerB} />
      </div>
    </div>
  )
}

// ── Score comparison bar row ──
function ScoreCompareRow({
  label,
  scoreA,
  scoreB,
}: {
  label: string
  scoreA: number
  scoreB: number
}) {
  const winnerA = scoreA > scoreB
  const winnerB = scoreB > scoreA
  return (
    <div className="py-3 border-b border-slate-50 last:border-0">
      <div className="mb-1.5 flex items-center justify-between">
        <p className="text-[11px] text-slate-400">{label}</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex w-16 items-center justify-end gap-1">
          <span className="text-[13px] font-semibold text-[#3d5a99]">{scoreA}</span>
          <WinnerBadge show={winnerA} />
        </div>
        <div className="flex-1 h-2 rounded-full bg-slate-100 relative overflow-hidden">
          <div
            className="absolute left-0 h-full bg-[#3d5a99]/60 rounded-full transition-all duration-700"
            style={{ width: `${scoreA}%` }}
          />
          <div
            className="absolute right-0 h-full bg-emerald-500/60 rounded-full transition-all duration-700"
            style={{ width: `${100 - scoreB}%` }}
          />
        </div>
        <div className="flex w-16 items-center gap-1">
          <WinnerBadge show={winnerB} />
          <span className="text-[13px] font-semibold text-emerald-600">{scoreB}</span>
        </div>
      </div>
    </div>
  )
}

// ── Market size formatted display ──
function MarketSizeDisplay({ sizing }: { sizing: OpportunityDetail['market']['sizing'] }) {
  return (
    <div className="space-y-1">
      <p className="text-[13px] font-semibold text-slate-800">
        TAM: {formatCurrency(sizing.tam.value, true)}
      </p>
      <p className="text-[12px] text-slate-500">
        SAM: {formatCurrency(sizing.sam.value, true)}
      </p>
      <p className="text-[12px] text-slate-500">
        SOM: {formatCurrency(sizing.som.value, true)}
      </p>
      <p className="text-[11px] text-slate-400">CAGR {sizing.cagr}%</p>
    </div>
  )
}

// ═══════════════════════════════════════════
// Selection Interface (shown when IDs not provided)
// ═══════════════════════════════════════════
function SelectionInterface() {
  const router = useRouter()
  const [selected, setSelected] = useState<string[]>([])

  function toggleSelect(id: string) {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= 2) return [prev[1], id]
      return [...prev, id]
    })
  }

  function handleCompare() {
    if (selected.length === 2) {
      router.push(`/opportunities/compare?ids=${selected.join(',')}`)
    }
  }

  return (
    <PageLayout
      title="機会比較"
      subtitle="比較したい2つの機会を選択してください"
      icon="⚖️"
      breadcrumbs={[
        { label: '市場機会', href: '/opportunities' },
        { label: '比較' },
      ]}
    >
      {/* Selection status */}
      <AnimatedSection>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-[12px] font-semibold ${
                    selected[i]
                      ? 'border-[#3d5a99] bg-[#3d5a99] text-white'
                      : 'border-slate-200 bg-white text-slate-300'
                  }`}
                >
                  {selected[i] ? i + 1 : i + 1}
                </div>
              ))}
            </div>
            <p className="text-[13px] text-slate-500">
              {selected.length === 0
                ? '2つの機会を選択してください'
                : selected.length === 1
                ? 'あと1つ選択してください'
                : '比較する準備ができました'}
            </p>
          </div>
          <button
            onClick={handleCompare}
            disabled={selected.length < 2}
            className={`rounded-xl px-5 py-2 text-[13px] font-semibold transition-all ${
              selected.length === 2
                ? 'bg-[#3d5a99] text-white shadow-sm hover:bg-[#2c4377]'
                : 'cursor-not-allowed bg-slate-100 text-slate-400'
            }`}
          >
            比較する
          </button>
        </div>

        {/* Opportunity cards grid */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {opportunities.map((opp, i) => {
            const isSelected = selected.includes(opp.id)
            const selectedIndex = selected.indexOf(opp.id)
            return (
              <button
                key={opp.id}
                onClick={() => toggleSelect(opp.id)}
                className={`glass-card relative p-4 text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'ring-2 ring-[#3d5a99] ring-offset-2'
                    : 'hover:shadow-md'
                }`}
              >
                {isSelected && (
                  <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#3d5a99] text-[11px] font-bold text-white">
                    {selectedIndex + 1}
                  </div>
                )}
                <div className="pr-8">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-[11px] text-slate-400">#{i + 1}</span>
                    <Badge variant={opp.status === 'validated' ? 'emerald' : opp.status === 'researching' ? 'brand' : 'amber'} size="sm">
                      {opp.status === 'validated' ? '検証済み' : opp.status === 'researching' ? '調査中' : '仮説'}
                    </Badge>
                  </div>
                  <h3 className="text-[13px] font-semibold text-slate-900 leading-snug">{opp.title}</h3>
                  <p className="mt-0.5 text-[11px] text-slate-400 line-clamp-1">{opp.subtitle}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[12px] font-semibold text-[#3d5a99]">{opp.scores.overall}/100</span>
                    <span className="text-[11px] text-slate-400">{opp.revenue.estimated}</span>
                  </div>
                  <div className="mt-2">
                    <ScoreBar score={opp.scores.overall} showLabel={false} size="sm" variant="brand" />
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </AnimatedSection>
    </PageLayout>
  )
}

// ═══════════════════════════════════════════
// Comparison View (shown when 2 valid IDs provided)
// ═══════════════════════════════════════════
function ComparisonView({ oppA, oppB }: { oppA: OpportunityDetail; oppB: OpportunityDetail }) {
  return (
    <PageLayout
      title={`機会比較`}
      subtitle={`${oppA.title} vs ${oppB.title}`}
      icon="⚖️"
      breadcrumbs={[
        { label: '市場機会', href: '/opportunities' },
        { label: '比較' },
      ]}
      actions={
        <div className="flex items-center gap-3">
          <Link
            href="/opportunities"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[13px] font-medium text-slate-600 hover:border-[#3d5a99]/30 hover:text-[#3d5a99] transition-colors"
          >
            ← 一覧に戻る
          </Link>
          <Link
            href="/opportunities/compare"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[13px] font-medium text-slate-600 hover:border-[#3d5a99]/30 hover:text-[#3d5a99] transition-colors"
          >
            再選択
          </Link>
          <span className="text-[11px] text-slate-400 hidden sm:block">
            PDF エクスポート: 印刷 → PDFとして保存
          </span>
        </div>
      }
    >
      {/* ── Column headers ── */}
      <AnimatedSection className="mb-6">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          {/* Opportunity A */}
          <div className="glass-card p-5 text-center">
            <div className="mb-2 flex justify-center">
              <Badge variant={oppA.status === 'validated' ? 'emerald' : oppA.status === 'researching' ? 'brand' : 'amber'} size="sm">
                {oppA.status === 'validated' ? '✅ 検証済み' : oppA.status === 'researching' ? '📊 調査中' : '🔍 仮説'}
              </Badge>
            </div>
            <h2 className="text-[16px] font-bold text-slate-900 leading-snug">{oppA.title}</h2>
            <p className="mt-1 text-[11px] text-slate-400">{oppA.subtitle}</p>
            <div className="mt-3">
              <p className="text-3xl font-bold text-[#3d5a99] tabular-nums">{oppA.scores.overall}</p>
              <p className="text-[11px] text-slate-400">総合スコア</p>
            </div>
          </div>

          {/* VS badge */}
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-slate-200 bg-white text-[13px] font-bold text-slate-400 shadow-sm">
            VS
          </div>

          {/* Opportunity B */}
          <div className="glass-card p-5 text-center">
            <div className="mb-2 flex justify-center">
              <Badge variant={oppB.status === 'validated' ? 'emerald' : oppB.status === 'researching' ? 'brand' : 'amber'} size="sm">
                {oppB.status === 'validated' ? '✅ 検証済み' : oppB.status === 'researching' ? '📊 調査中' : '🔍 仮説'}
              </Badge>
            </div>
            <h2 className="text-[16px] font-bold text-slate-900 leading-snug">{oppB.title}</h2>
            <p className="mt-1 text-[11px] text-slate-400">{oppB.subtitle}</p>
            <div className="mt-3">
              <p className="text-3xl font-bold text-emerald-600 tabular-nums">{oppB.scores.overall}</p>
              <p className="text-[11px] text-slate-400">総合スコア</p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* ── Section 1: Score comparison ── */}
      <AnimatedSection className="mb-6" delay={0.05}>
        <div className="glass-card overflow-hidden">
          <SectionHeader emoji="📊" title="スコア比較" subtitle="6つの評価軸での比較" />
          <div className="p-6">
            {/* Legend */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-8 rounded-full bg-[#3d5a99]/60" />
                <span className="text-[11px] text-slate-500 font-medium">{oppA.title.slice(0, 10)}…</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500 font-medium">{oppB.title.slice(0, 10)}…</span>
                <div className="h-2 w-8 rounded-full bg-emerald-500/60" />
              </div>
            </div>
            <div>
              {SCORE_DIMENSIONS.map((dim) => (
                <ScoreCompareRow
                  key={dim.key}
                  label={dim.label}
                  scoreA={oppA.scores[dim.key]}
                  scoreB={oppB.scores[dim.key]}
                />
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* ── Section 2: Market sizing ── */}
      <AnimatedSection className="mb-6" delay={0.08}>
        <div className="glass-card overflow-hidden">
          <SectionHeader emoji="🌐" title="市場規模" subtitle="TAM / SAM / SOM 比較" />
          <div className="grid grid-cols-[1fr_auto_1fr] gap-0">
            <div className="p-5">
              <MarketSizeDisplay sizing={oppA.market.sizing} />
              <div className="mt-3 flex items-center gap-1">
                <span className="text-[11px] text-slate-400">成長率:</span>
                <span className="text-[13px] font-semibold text-emerald-600">{oppA.market.growth}</span>
                <WinnerBadge show={parseFloat(oppA.market.growth) > parseFloat(oppB.market.growth)} />
              </div>
            </div>
            <div className="w-px bg-slate-100 self-stretch mx-1" />
            <div className="p-5">
              <MarketSizeDisplay sizing={oppB.market.sizing} />
              <div className="mt-3 flex items-center gap-1">
                <span className="text-[11px] text-slate-400">成長率:</span>
                <span className="text-[13px] font-semibold text-emerald-600">{oppB.market.growth}</span>
                <WinnerBadge show={parseFloat(oppB.market.growth) > parseFloat(oppA.market.growth)} />
              </div>
            </div>
          </div>
          {/* TAM comparison row */}
          <div className="border-t border-slate-100 px-5 pb-4 pt-3">
            <p className="mb-2 text-[11px] font-medium text-slate-400">TAM 規模比較</p>
            <div className="flex items-center gap-3">
              <span className="w-20 text-right text-[13px] font-semibold text-[#3d5a99]">
                {formatCurrency(oppA.market.sizing.tam.value, true)}
              </span>
              <div className="flex-1 h-2 rounded-full bg-slate-100 relative overflow-hidden">
                <div
                  className="absolute left-0 h-full bg-[#3d5a99]/60 rounded-full"
                  style={{
                    width: `${Math.min((oppA.market.sizing.tam.value / Math.max(oppA.market.sizing.tam.value, oppB.market.sizing.tam.value)) * 100, 100)}%`,
                  }}
                />
              </div>
              <div className="flex-1 h-2 rounded-full bg-slate-100 relative overflow-hidden">
                <div
                  className="absolute left-0 h-full bg-emerald-500/60 rounded-full"
                  style={{
                    width: `${Math.min((oppB.market.sizing.tam.value / Math.max(oppA.market.sizing.tam.value, oppB.market.sizing.tam.value)) * 100, 100)}%`,
                  }}
                />
              </div>
              <span className="w-20 text-[13px] font-semibold text-emerald-600">
                {formatCurrency(oppB.market.sizing.tam.value, true)}
              </span>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* ── Section 3: Revenue projections ── */}
      <AnimatedSection className="mb-6" delay={0.1}>
        <div className="glass-card overflow-hidden">
          <SectionHeader emoji="💰" title="収益予測" subtitle="収益・マージン・損益分岐点" />
          <div className="p-5">
            <CompareRow
              label="予想収益"
              valueA={<span className="font-semibold text-slate-900">{oppA.revenue.estimated}</span>}
              valueB={<span className="font-semibold text-slate-900">{oppB.revenue.estimated}</span>}
            />
            <CompareRow
              label="収益モデル"
              valueA={<span className="text-[12px] text-slate-600">{oppA.revenue.model}</span>}
              valueB={<span className="text-[12px] text-slate-600">{oppB.revenue.model}</span>}
            />
            <CompareRow
              label="粗利率"
              valueA={
                <span className={`font-semibold ${oppA.revenue.margins.gross >= oppB.revenue.margins.gross ? 'text-emerald-600' : 'text-slate-800'}`}>
                  {oppA.revenue.margins.gross}%
                </span>
              }
              valueB={
                <span className={`font-semibold ${oppB.revenue.margins.gross >= oppA.revenue.margins.gross ? 'text-emerald-600' : 'text-slate-800'}`}>
                  {oppB.revenue.margins.gross}%
                </span>
              }
              winnerA={oppA.revenue.margins.gross > oppB.revenue.margins.gross}
              winnerB={oppB.revenue.margins.gross > oppA.revenue.margins.gross}
            />
            <CompareRow
              label="純利率"
              valueA={
                <span className={`font-semibold ${oppA.revenue.margins.net >= oppB.revenue.margins.net ? 'text-emerald-600' : 'text-slate-800'}`}>
                  {oppA.revenue.margins.net}%
                </span>
              }
              valueB={
                <span className={`font-semibold ${oppB.revenue.margins.net >= oppA.revenue.margins.net ? 'text-emerald-600' : 'text-slate-800'}`}>
                  {oppB.revenue.margins.net}%
                </span>
              }
              winnerA={oppA.revenue.margins.net > oppB.revenue.margins.net}
              winnerB={oppB.revenue.margins.net > oppA.revenue.margins.net}
            />
            <CompareRow
              label="損益分岐点"
              valueA={<span className="text-[12px] text-slate-700">{oppA.revenue.breakEven}</span>}
              valueB={<span className="text-[12px] text-slate-700">{oppB.revenue.breakEven}</span>}
            />
          </div>
        </div>
      </AnimatedSection>

      {/* ── Section 4: Risk ── */}
      <AnimatedSection className="mb-6" delay={0.12}>
        <div className="glass-card overflow-hidden">
          <SectionHeader emoji="⚠️" title="リスク" subtitle="リスクレベル・要因数・シナリオ" />
          <div className="p-5">
            <CompareRow
              label="リスクレベル"
              valueA={
                <Badge
                  variant={oppA.risks.level === 'low' ? 'emerald' : oppA.risks.level === 'medium' ? 'amber' : 'rose'}
                  size="sm"
                  dot
                >
                  {oppA.risks.level === 'low' ? '低リスク' : oppA.risks.level === 'medium' ? '中リスク' : '高リスク'}
                </Badge>
              }
              valueB={
                <Badge
                  variant={oppB.risks.level === 'low' ? 'emerald' : oppB.risks.level === 'medium' ? 'amber' : 'rose'}
                  size="sm"
                  dot
                >
                  {oppB.risks.level === 'low' ? '低リスク' : oppB.risks.level === 'medium' ? '中リスク' : '高リスク'}
                </Badge>
              }
              winnerA={
                (oppA.risks.level === 'low' && oppB.risks.level !== 'low') ||
                (oppA.risks.level === 'medium' && oppB.risks.level === 'high')
              }
              winnerB={
                (oppB.risks.level === 'low' && oppA.risks.level !== 'low') ||
                (oppB.risks.level === 'medium' && oppA.risks.level === 'high')
              }
            />
            <CompareRow
              label="リスク要因数"
              valueA={
                <span className="font-semibold text-slate-800">
                  {oppA.risks.factors.length}件
                </span>
              }
              valueB={
                <span className="font-semibold text-slate-800">
                  {oppB.risks.factors.length}件
                </span>
              }
              winnerA={oppA.risks.factors.length < oppB.risks.factors.length}
              winnerB={oppB.risks.factors.length < oppA.risks.factors.length}
            />
            <CompareRow
              label="最良シナリオ"
              valueA={<span className="text-[12px] text-emerald-700">{oppA.risks.scenarios.best.revenue}</span>}
              valueB={<span className="text-[12px] text-emerald-700">{oppB.risks.scenarios.best.revenue}</span>}
            />
            <CompareRow
              label="最悪シナリオ"
              valueA={<span className="text-[12px] text-rose-700">{oppA.risks.scenarios.worst.revenue}</span>}
              valueB={<span className="text-[12px] text-rose-700">{oppB.risks.scenarios.worst.revenue}</span>}
            />
          </div>
        </div>
      </AnimatedSection>

      {/* ── Section 5: Implementation ── */}
      <AnimatedSection className="mb-6" delay={0.14}>
        <div className="glass-card overflow-hidden">
          <SectionHeader emoji="🗺️" title="実装" subtitle="期間・コスト・チーム・技術スタック" />
          <div className="p-5">
            <CompareRow
              label="期間"
              valueA={<span className="text-[12px] text-slate-700">{oppA.implementation.timeframe}</span>}
              valueB={<span className="text-[12px] text-slate-700">{oppB.implementation.timeframe}</span>}
            />
            <CompareRow
              label="総投資額"
              valueA={<span className="font-semibold text-slate-900">{oppA.implementation.totalCost}</span>}
              valueB={<span className="font-semibold text-slate-900">{oppB.implementation.totalCost}</span>}
            />
            <CompareRow
              label="チームサイズ"
              valueA={<span className="text-[12px] text-slate-700">{oppA.implementation.teamSize}</span>}
              valueB={<span className="text-[12px] text-slate-700">{oppB.implementation.teamSize}</span>}
            />
            <CompareRow
              label="フェーズ数"
              valueA={<span className="text-[12px] text-slate-700">{oppA.implementation.phases.length}フェーズ</span>}
              valueB={<span className="text-[12px] text-slate-700">{oppB.implementation.phases.length}フェーズ</span>}
            />
          </div>
          {/* Tech stacks */}
          <div className="border-t border-slate-100 p-5">
            <div className="grid grid-cols-[1fr_auto_1fr] gap-4">
              <div>
                <p className="mb-2 text-[11px] font-medium text-slate-400 text-right">技術スタック</p>
                <div className="flex flex-wrap justify-end gap-1">
                  {oppA.implementation.techStack.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-[#3d5a99]/8 px-2 py-0.5 text-[10px] font-medium text-[#2c4377] border border-[#3d5a99]/15"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="w-px bg-slate-100" />
              <div>
                <p className="mb-2 text-[11px] font-medium text-slate-400">技術スタック</p>
                <div className="flex flex-wrap gap-1">
                  {oppB.implementation.techStack.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 border border-emerald-200/60"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* ── Section 6: Competitors ── */}
      <AnimatedSection className="mb-6" delay={0.16}>
        <div className="glass-card overflow-hidden">
          <SectionHeader emoji="🏢" title="競合" subtitle="競合数・主要プレイヤー" />
          <div className="p-5">
            <CompareRow
              label="競合社数"
              valueA={
                <span className="font-semibold text-slate-900">
                  {oppA.competitors.length}社
                </span>
              }
              valueB={
                <span className="font-semibold text-slate-900">
                  {oppB.competitors.length}社
                </span>
              }
              winnerA={oppA.competitors.length < oppB.competitors.length}
              winnerB={oppB.competitors.length < oppA.competitors.length}
            />
          </div>
          {/* Competitor name lists */}
          <div className="border-t border-slate-100">
            <div className="grid grid-cols-[1fr_auto_1fr]">
              <div className="p-5">
                <p className="mb-2 text-[11px] font-medium text-slate-400 text-right">主要競合</p>
                <div className="space-y-1.5 text-right">
                  {oppA.competitors.length === 0 ? (
                    <p className="text-[12px] text-slate-400">競合なし</p>
                  ) : (
                    oppA.competitors.map((c) => (
                      <p key={c.id} className="text-[12px] text-slate-700">
                        {c.name}
                        <span className="ml-1 text-[11px] text-slate-400">({c.marketShare}%)</span>
                      </p>
                    ))
                  )}
                </div>
              </div>
              <div className="w-px bg-slate-100" />
              <div className="p-5">
                <p className="mb-2 text-[11px] font-medium text-slate-400">主要競合</p>
                <div className="space-y-1.5">
                  {oppB.competitors.length === 0 ? (
                    <p className="text-[12px] text-slate-400">競合なし</p>
                  ) : (
                    oppB.competitors.map((c) => (
                      <p key={c.id} className="text-[12px] text-slate-700">
                        {c.name}
                        <span className="ml-1 text-[11px] text-slate-400">({c.marketShare}%)</span>
                      </p>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* ── Footer actions ── */}
      <AnimatedSection delay={0.18}>
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/opportunities"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[13px] font-medium text-slate-600 hover:border-[#3d5a99]/30 hover:text-[#3d5a99] transition-colors"
            >
              ← 一覧に戻る
            </Link>
            <Link
              href="/opportunities/compare"
              className="rounded-xl border border-[#3d5a99]/20 bg-[#3d5a99]/5 px-4 py-2 text-[13px] font-medium text-[#3d5a99] hover:bg-[#3d5a99]/10 transition-colors"
            >
              別の機会と比較
            </Link>
          </div>
          <p className="text-[11px] text-slate-400">
            PDF書き出し: ブラウザの印刷 → 「PDFとして保存」をご利用ください
          </p>
        </div>
      </AnimatedSection>
    </PageLayout>
  )
}

// ═══════════════════════════════════════════
// Main Page Component
// ═══════════════════════════════════════════
export default function CompareOpportunitiesPage() {
  const searchParams = useSearchParams()
  const idsParam = searchParams.get('ids')

  // Parse IDs from query string
  const ids = idsParam ? idsParam.split(',').map((id) => id.trim()).filter(Boolean) : []

  // Find matching opportunities
  const validOpps = ids
    .map((id) => opportunities.find((o) => o.id === id))
    .filter((o): o is OpportunityDetail => o !== undefined)

  // If we have 2+ valid opportunities, show comparison view
  if (validOpps.length >= 2) {
    return <ComparisonView oppA={validOpps[0]} oppB={validOpps[1]} />
  }

  // Otherwise show selection interface
  return <SelectionInterface />
}
