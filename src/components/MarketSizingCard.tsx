'use client'

import type { MarketSizing } from '@/domain/types'
import { formatCurrency } from '@/domain/formatting'

export function MarketSizingCard({ data }: { data: MarketSizing }) {
  const samPercent = (data.sam.value / data.tam.value) * 100
  const somPercent = (data.som.value / data.tam.value) * 100

  return (
    <div className="glass-card overflow-hidden">
      <div className="border-b border-slate-100 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-sm">💹</div>
          <div>
            <h3 className="text-[15px] font-semibold text-slate-900">市場規模分析 — TAM/SAM/SOM</h3>
            <p className="text-[12px] text-slate-400">CAGR {data.cagr}% · {data.tam.year}年推計</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Concentric circles visualization */}
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
          {/* Circle Visual */}
          <div className="relative flex h-52 w-52 flex-shrink-0 items-center justify-center">
            {/* TAM */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-slate-300 bg-slate-50/50 flex items-end justify-center pb-1">
              <span className="text-[10px] font-medium text-slate-400">TAM</span>
            </div>
            {/* SAM */}
            <div
              className="absolute rounded-full border-2 border-[#3d5a99]/40 bg-[#3d5a99]/5 flex items-end justify-center pb-1"
              style={{
                width: `${Math.max(samPercent, 30)}%`,
                height: `${Math.max(samPercent, 30)}%`,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <span className="text-[10px] font-medium text-[#3d5a99]">SAM</span>
            </div>
            {/* SOM */}
            <div
              className="absolute rounded-full border-2 border-emerald-400 bg-emerald-50 flex items-center justify-center"
              style={{
                width: `${Math.max(somPercent * 3, 15)}%`,
                height: `${Math.max(somPercent * 3, 15)}%`,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <span className="text-[10px] font-bold text-emerald-700">SOM</span>
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 space-y-4 w-full">
            {[
              { label: 'TAM (Total Addressable Market)', data: data.tam, color: 'slate', borderColor: 'border-slate-200' },
              { label: 'SAM (Serviceable Available Market)', data: data.sam, color: 'brand', borderColor: 'border-[#3d5a99]/20' },
              { label: 'SOM (Serviceable Obtainable Market)', data: data.som, color: 'emerald', borderColor: 'border-emerald-200/60' },
            ].map((item) => (
              <div key={item.label} className={`rounded-xl border ${item.borderColor} bg-white p-4`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className={`text-[11px] font-semibold uppercase tracking-wider ${
                      item.color === 'brand' ? 'text-[#3d5a99]' :
                      item.color === 'emerald' ? 'text-emerald-600' :
                      'text-slate-400'
                    }`}>{item.label}</p>
                    <p className="mt-1 text-xl font-bold tracking-tight text-slate-900">
                      {formatCurrency(item.data.value, true)}
                    </p>
                  </div>
                </div>
                <p className="mt-1.5 text-[12px] text-slate-500">{item.data.description}</p>
              </div>
            ))}

            {/* Methodology */}
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">算定方法</p>
              <p className="text-[12px] text-slate-500">{data.methodology}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {data.sources.map((s, i) => (
                  <span key={i} className="rounded-full bg-white px-2 py-0.5 text-[10px] text-slate-500 border border-slate-200/60">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
