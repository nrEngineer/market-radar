'use client'

interface RiskFactor {
  name: string
  probability: number
  impact: number
  mitigation: string
}

interface Scenario {
  best: { description: string; revenue: string; probability: number }
  base: { description: string; revenue: string; probability: number }
  worst: { description: string; revenue: string; probability: number }
}

export function RiskMatrix({ factors }: { factors: RiskFactor[] }) {
  return (
    <div className="glass-card overflow-hidden">
      <div className="border-b border-slate-100 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-sm">⚠️</div>
          <div>
            <h3 className="text-[15px] font-semibold text-slate-900">リスク評価マトリクス</h3>
            <p className="text-[12px] text-slate-400">確率 × インパクトで優先度を判定</p>
          </div>
        </div>
      </div>

      {/* Visual Matrix */}
      <div className="p-6">
        <div className="relative mx-auto" style={{ maxWidth: 400 }}>
          <div className="grid grid-cols-3 gap-px bg-slate-100">
            {[
              { p: 'High', i: 'Low', bg: 'bg-amber-50', label: '注意' },
              { p: 'High', i: 'Med', bg: 'bg-rose-50', label: '要対策' },
              { p: 'High', i: 'High', bg: 'bg-rose-100', label: '重大' },
              { p: 'Med', i: 'Low', bg: 'bg-emerald-50', label: '許容' },
              { p: 'Med', i: 'Med', bg: 'bg-amber-50', label: '注意' },
              { p: 'Med', i: 'High', bg: 'bg-rose-50', label: '要対策' },
              { p: 'Low', i: 'Low', bg: 'bg-emerald-50', label: '低' },
              { p: 'Low', i: 'Med', bg: 'bg-emerald-50', label: '許容' },
              { p: 'Low', i: 'High', bg: 'bg-amber-50', label: '注意' },
            ].map((cell, idx) => {
              const dots = factors.filter(f => {
                const pLevel = f.probability >= 50 ? 'High' : f.probability >= 25 ? 'Med' : 'Low'
                const iLevel = f.impact >= 60 ? 'High' : f.impact >= 30 ? 'Med' : 'Low'
                return pLevel === cell.p && iLevel === cell.i
              })
              return (
                <div key={idx} className={`${cell.bg} relative flex h-20 items-center justify-center rounded-lg`}>
                  <span className="text-[10px] text-slate-500 font-medium">{cell.label}</span>
                  {dots.map((d, di) => (
                    <div key={di} className="absolute top-1 right-1 h-3 w-3 rounded-full bg-slate-500 ring-2 ring-white" title={d.name} />
                  ))}
                </div>
              )
            })}
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-slate-400 font-medium">
            <span>低インパクト</span>
            <span>→ インパクト →</span>
            <span>高インパクト</span>
          </div>
          <div className="absolute -left-6 top-0 bottom-0 flex flex-col justify-between text-[10px] text-slate-400 font-medium">
            <span>高確率</span>
            <span className="rotate-180" style={{ writingMode: 'vertical-rl' }}>← 確率 ←</span>
            <span>低確率</span>
          </div>
        </div>
      </div>

      {/* Factor Details */}
      <div className="divide-y divide-slate-50 border-t border-slate-100">
        {factors.map((f, i) => {
          const severity = (f.probability / 100) * (f.impact / 100)
          const severityColor = severity >= 0.4 ? 'text-rose-600' : severity >= 0.2 ? 'text-amber-600' : 'text-emerald-600'
          return (
            <div key={i} className="px-6 py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className={`text-[13px] font-semibold ${severityColor}`}>●</span>
                    <span className="text-[14px] font-medium text-slate-800">{f.name}</span>
                    <span className="text-[11px] text-slate-400">確率 {f.probability}% · 影響 {f.impact}%</span>
                  </div>
                  <p className="ml-6 text-[12px] text-slate-500">🛡️ {f.mitigation}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function ScenarioAnalysis({ scenarios }: { scenarios: Scenario }) {
  return (
    <div className="glass-card overflow-hidden">
      <div className="border-b border-slate-100 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3d5a99]/8 text-sm">🎭</div>
          <div>
            <h3 className="text-[15px] font-semibold text-slate-900">シナリオ分析</h3>
            <p className="text-[12px] text-slate-400">楽観・基本・悲観の3パターン</p>
          </div>
        </div>
      </div>
      <div className="grid divide-y divide-slate-50 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {[
          { ...scenarios.best, label: '🚀 楽観', color: 'emerald' },
          { ...scenarios.base, label: '📊 基本', color: 'brand' },
          { ...scenarios.worst, label: '⚡ 悲観', color: 'rose' },
        ].map((s) => (
          <div key={s.label} className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] font-semibold text-slate-800">{s.label}</span>
              <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                s.color === 'emerald' ? 'bg-emerald-50 text-emerald-700' :
                s.color === 'brand' ? 'bg-[#3d5a99]/8 text-[#2c4377]' :
                'bg-rose-50 text-rose-700'
              }`}>
                確率 {s.probability}%
              </span>
            </div>
            <p className="text-xl font-bold text-slate-900 mb-2">{s.revenue}</p>
            <p className="text-[12px] text-slate-500">{s.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
