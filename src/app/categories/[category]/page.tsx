'use client'

import { use } from 'react'
import { notFound } from 'next/navigation'
import { PageLayout } from '@/components/PageLayout'
import { FiveW1HCard } from '@/components/FiveW1HCard'
import { ProvenanceCard } from '@/components/ProvenanceCard'
import { MarketSizingCard } from '@/components/MarketSizingCard'
import { MiniBarChart } from '@/components/MiniChart'
import { ScoreBar } from '@/components/ScoreBar'
import { AnimatedSection } from '@/components/motion'
import { categories } from '@/data'
// formatCurrency available for future use from '@/domain/formatting'

export default function CategoryDetailPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = use(params)
  const cat = categories.find(c => c.slug === category)

  if (!cat) {
    // Show first category as default
    const defaultCat = categories[0]
    if (!defaultCat) notFound()
    return <CategoryContent cat={defaultCat} />
  }

  return <CategoryContent cat={cat} />
}

function CategoryContent({ cat }: { cat: typeof categories[0] }) {
  return (
    <PageLayout
      title={`${cat.icon} ${cat.name}`}
      subtitle={cat.description}
      icon={cat.icon}
      breadcrumbs={[
        { label: 'カテゴリ' },
        { label: cat.name },
      ]}
    >
      {/* Key Metrics */}
      <AnimatedSection className="mb-8">
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <div className="glass-card p-5">
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">アプリ数</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{cat.totalApps}</p>
          </div>
          <div className="glass-card p-5">
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">総収益</p>
            <p className="mt-2 text-2xl font-bold text-emerald-600">{cat.totalRevenue}</p>
            <p className="text-[11px] text-slate-400">平均 {cat.avgRevenue} / 中央値 {cat.medianRevenue}</p>
          </div>
          <div className="glass-card p-5">
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">成長率</p>
            <p className="mt-2 text-2xl font-bold text-[#3d5a99]">{cat.growth}</p>
            <p className="text-[11px] text-slate-400">YoY {cat.yoyGrowth}</p>
          </div>
          <div className="glass-card p-5">
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">CAGR</p>
            <p className="mt-2 text-2xl font-bold text-violet-600">{cat.sizing.cagr}%</p>
          </div>
        </div>
      </AnimatedSection>

      {/* Monthly Trend Chart */}
      <AnimatedSection className="mb-8" delay={0.05}>
        <div className="glass-card overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-4">
            <h3 className="text-[15px] font-semibold text-slate-900">📈 月次推移</h3>
            <p className="text-[12px] text-slate-400">アプリ数 & 収益の時系列データ</p>
          </div>
          <div className="p-6">
            <p className="text-[11px] text-slate-400 mb-2">アプリ数推移</p>
            <MiniBarChart
              data={cat.monthlyData.map(m => ({ label: m.month.slice(5), value: m.apps }))}
              height={80}
              color="indigo"
            />
            <div className="mt-6">
              <p className="text-[11px] text-slate-400 mb-2">月間収益推移</p>
              <MiniBarChart
                data={cat.monthlyData.map(m => ({ label: m.month.slice(5), value: m.revenue / 1000000 }))}
                height={80}
                color="emerald"
              />
              <p className="text-[10px] text-slate-500 mt-1">※ 単位: 百万円</p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* TAM/SAM/SOM */}
      <AnimatedSection className="mb-8" delay={0.1}>
        <MarketSizingCard data={cat.sizing} />
      </AnimatedSection>

      {/* Top Apps */}
      <AnimatedSection className="mb-8" delay={0.12}>
        <div className="glass-card overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-4">
            <h3 className="text-[15px] font-semibold text-slate-900">🏆 トップアプリ</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="premium-table w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-6 py-3 text-[11px]">#</th>
                  <th className="px-6 py-3 text-[11px]">アプリ名</th>
                  <th className="px-6 py-3 text-[11px]">月間収益</th>
                  <th className="px-6 py-3 text-[11px]">DL数</th>
                  <th className="px-6 py-3 text-[11px]">評価</th>
                  <th className="px-6 py-3 text-[11px] text-right">成長率</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {cat.topApps.map((app, i) => (
                  <tr key={app.name} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3 text-[13px] text-slate-400">{i + 1}</td>
                    <td className="px-6 py-3 text-[13px] font-medium text-slate-900">{app.name}</td>
                    <td className="px-6 py-3 text-[13px] text-slate-900">{app.revenue}</td>
                    <td className="px-6 py-3 text-[13px] text-slate-400">{app.downloads}</td>
                    <td className="px-6 py-3 text-[13px] text-amber-600">★ {app.rating}</td>
                    <td className="px-6 py-3 text-[13px] text-right font-semibold text-emerald-600">{app.growth}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </AnimatedSection>

      {/* Subcategories */}
      <AnimatedSection className="mb-8" delay={0.14}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="glass-card overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-4">
              <h3 className="text-[15px] font-semibold text-slate-900">📂 サブカテゴリ</h3>
            </div>
            <div className="divide-y divide-slate-50">
              {cat.subcategories.map((sub) => (
                <div key={sub.name} className="flex items-center justify-between px-6 py-3.5">
                  <div>
                    <p className="text-[13px] font-medium text-slate-900">{sub.name}</p>
                    <p className="text-[11px] text-slate-400">{sub.count}アプリ · 平均収益 {sub.avgRevenue}</p>
                  </div>
                  <span className="text-[13px] font-semibold text-emerald-600">{sub.growth}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-4">
              <h3 className="text-[15px] font-semibold text-slate-900">🌍 地域別分布</h3>
            </div>
            <div className="p-6 space-y-4">
              {cat.regions.map((region) => (
                <div key={region.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[13px] text-slate-900">{region.name}</span>
                    <span className="text-[12px] text-slate-400">{region.marketShare}% · {region.growth}</span>
                  </div>
                  <ScoreBar score={region.marketShare} maxScore={50} showLabel={false} size="sm" />
                  <p className="mt-1 text-[11px] text-slate-400">収益 {region.revenue}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* 5W1H */}
      <AnimatedSection className="mb-8" delay={0.16}>
        <FiveW1HCard data={cat.fiveW1H} />
      </AnimatedSection>

      {/* Data Provenance */}
      <AnimatedSection delay={0.18}>
        <ProvenanceCard data={cat.provenance} />
      </AnimatedSection>
    </PageLayout>
  )
}
