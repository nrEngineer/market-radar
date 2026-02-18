'use client'

import { PageLayout } from '@/components/PageLayout'
import { AnimatedSection } from '@/components/motion'
import { competitiveLandscape } from '@/lib/data'

export default function CompaniesPage() {
  return (
    <PageLayout
      title="企業・競合分析"
      subtitle="主要プレイヤーのポジショニング・SWOT・市場動向"
      icon="🏢"
      breadcrumbs={[{ label: '企業・競合分析' }]}
    >
      {/* Market Overview */}
      <AnimatedSection className="mb-8">
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <div className="glass-card p-5">
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">総プレイヤー数</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{competitiveLandscape.totalPlayers.toLocaleString()}</p>
          </div>
          <div className="glass-card p-5">
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">市場集中度</p>
            <p className="mt-2 text-xl font-bold text-[#3d5a99]">
              {competitiveLandscape.marketConcentration === 'fragmented' ? '分散型' :
               competitiveLandscape.marketConcentration === 'moderate' ? '中程度' :
               competitiveLandscape.marketConcentration === 'concentrated' ? '集中型' : '独占型'}
            </p>
            <p className="text-[11px] text-slate-400">HHI: {competitiveLandscape.herfindahlIndex}</p>
          </div>
          <div className="glass-card p-5">
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">トッププレイヤー</p>
            <p className="mt-2 text-xl font-bold text-slate-900">{competitiveLandscape.topPlayers.length}社</p>
            <p className="text-[11px] text-slate-400">分析対象</p>
          </div>
          <div className="glass-card p-5">
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">KSF数</p>
            <p className="mt-2 text-xl font-bold text-emerald-600">{competitiveLandscape.keySuccessFactors.length}</p>
            <p className="text-[11px] text-slate-400">重要成功要因</p>
          </div>
        </div>
      </AnimatedSection>

      {/* Positioning Map */}
      <AnimatedSection className="mb-8" delay={0.05}>
        <div className="glass-card overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-4">
            <h3 className="text-[15px] font-semibold text-slate-900">🗺️ ポジショニングマップ</h3>
            <p className="text-[12px] text-slate-400">X軸: 価格（低→高） · Y軸: 機能充実度（低→高）</p>
          </div>
          <div className="p-6">
            <div className="relative mx-auto bg-slate-50/50 rounded-xl border border-slate-200/60" style={{ height: 320, maxWidth: 500 }}>
              {/* Axes */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute inset-x-0 top-1/2 h-px bg-white/[0.06]" />
                <div className="absolute inset-y-0 left-1/2 w-px bg-white/[0.06]" />
              </div>
              {/* Labels */}
              <span className="absolute bottom-2 right-4 text-[10px] text-slate-400">高価格 →</span>
              <span className="absolute bottom-2 left-4 text-[10px] text-slate-400">← 低価格</span>
              <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] text-slate-400">高機能 ↑</span>
              <span className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] text-slate-400">低機能 ↓</span>
              {/* Quadrant labels */}
              <span className="absolute top-8 left-6 text-[9px] text-emerald-500/50">コスパ高</span>
              <span className="absolute top-8 right-6 text-[9px] text-indigo-500/50">プレミアム</span>
              <span className="absolute bottom-12 left-6 text-[9px] text-amber-500/50">ベーシック</span>
              <span className="absolute bottom-12 right-6 text-[9px] text-rose-500/50">割高</span>

              {/* Player dots */}
              {competitiveLandscape.topPlayers.map((player) => {
                const x = ((player.positioning.x + 100) / 200) * 80 + 10
                const y = (1 - (player.positioning.y + 100) / 200) * 80 + 10
                return (
                  <div
                    key={player.id}
                    className="absolute group"
                    style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3d5a99]/12 border-2 border-indigo-500/40 text-[11px] font-bold text-[#3d5a99] cursor-pointer hover:scale-125 transition-transform">
                      {player.name.charAt(0)}
                    </div>
                    <div className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      {player.name} ({player.marketShare}%)
                    </div>
                  </div>
                )
              })}

              {/* "Your Opportunity" marker */}
              <div
                className="absolute group"
                style={{ left: '25%', top: '25%', transform: 'translate(-50%, -50%)' }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/30 border-2 border-emerald-400 border-dashed text-[11px] font-bold text-emerald-600 animate-pulse">
                  ★
                </div>
                <div className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] text-emerald-600 font-medium">
                  参入チャンス
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Company Details */}
      <AnimatedSection className="mb-8" delay={0.1}>
        <div className="glass-card overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-4">
            <h3 className="text-[15px] font-semibold text-slate-900">🏢 主要プレイヤー詳細</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {competitiveLandscape.topPlayers.map((player) => (
              <div key={player.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-[17px] font-semibold text-slate-900">{player.name}</h4>
                    <p className="text-[12px] text-slate-400">{player.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] text-slate-400">市場シェア</p>
                    <p className="text-2xl font-bold text-[#3d5a99]">{player.marketShare}%</p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-5 mb-4">
                  <div><p className="text-[11px] text-slate-400">設立</p><p className="text-[13px] text-slate-900">{player.founded}年</p></div>
                  <div><p className="text-[11px] text-slate-400">資金調達</p><p className="text-[13px] text-slate-900">{player.funding}</p></div>
                  <div><p className="text-[11px] text-slate-400">従業員</p><p className="text-[13px] text-slate-900">{player.employees}</p></div>
                  <div><p className="text-[11px] text-slate-400">売上</p><p className="text-[13px] text-emerald-600">{player.revenue}</p></div>
                  <div>
                    <p className="text-[11px] text-slate-400">プロダクト</p>
                    <div className="flex flex-wrap gap-1">
                      {player.products.map(p => (
                        <span key={p} className="text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">{p}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 mb-4">
                  <div>
                    <p className="text-[11px] font-medium text-emerald-600 mb-1.5">💪 強み</p>
                    <div className="flex flex-wrap gap-1">
                      {player.strengths.map((s, i) => (
                        <span key={i} className="rounded bg-emerald-50 px-2 py-0.5 text-[11px] text-emerald-600">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-rose-600 mb-1.5">⚡ 弱み</p>
                    <div className="flex flex-wrap gap-1">
                      {player.weaknesses.map((w, i) => (
                        <span key={i} className="rounded bg-rose-50 px-2 py-0.5 text-[11px] text-rose-600">{w}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {player.recentMoves.length > 0 && (
                  <div>
                    <p className="text-[11px] font-medium text-amber-600 mb-1.5">📢 最近の動き</p>
                    <div className="flex flex-wrap gap-1">
                      {player.recentMoves.map((m, i) => (
                        <span key={i} className="rounded bg-amber-500/8 px-2 py-0.5 text-[11px] text-amber-600">{m}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Entry Barriers */}
      <AnimatedSection className="mb-8" delay={0.15}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="glass-card overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-4">
              <h3 className="text-[15px] font-semibold text-slate-900">🚧 参入障壁</h3>
            </div>
            <div className="divide-y divide-slate-50">
              {competitiveLandscape.entryBarriers.map((barrier, i) => (
                <div key={i} className="px-6 py-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[13px] font-medium text-slate-900">{barrier.factor}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold border ${
                      barrier.level === 'low' ? 'bg-emerald-50 text-emerald-600 border-emerald-200/60' :
                      barrier.level === 'medium' ? 'bg-amber-50 text-amber-600 border-amber-200/60' :
                      'bg-rose-50 text-rose-600 border-rose-200/60'
                    }`}>
                      {barrier.level === 'low' ? '低' : barrier.level === 'medium' ? '中' : '高'}
                    </span>
                  </div>
                  <p className="text-[12px] text-slate-400">{barrier.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-4">
              <h3 className="text-[15px] font-semibold text-slate-900">🔑 重要成功要因（KSF）</h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {competitiveLandscape.keySuccessFactors.map((ksf, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#3d5a99]/8 text-[12px] font-bold text-[#3d5a99]">
                      {i + 1}
                    </div>
                    <span className="text-[13px] text-slate-900">{ksf}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </PageLayout>
  )
}
