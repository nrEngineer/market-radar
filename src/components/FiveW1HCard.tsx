'use client'

import type { FiveW1H } from '@/domain/types'

const items = [
  { key: 'what', label: 'What', sublabel: '何のデータか', icon: '📊', color: 'brand' },
  { key: 'who', label: 'Who', sublabel: '誰のためか', icon: '👤', color: 'cyan' },
  { key: 'when', label: 'When', sublabel: 'いつのデータか', icon: '📅', color: 'amber' },
  { key: 'where', label: 'Where', sublabel: 'どこの市場か', icon: '🌍', color: 'emerald' },
  { key: 'why', label: 'Why', sublabel: 'なぜ重要か', icon: '💡', color: 'violet' },
  { key: 'how', label: 'How', sublabel: 'どう活用するか', icon: '🔧', color: 'rose' },
] as const

const colorMap: Record<string, string> = {
  brand: 'border-[#3d5a99]/10 bg-[#3d5a99]/3',
  cyan: 'border-cyan-200/40 bg-cyan-50/50',
  amber: 'border-amber-200/40 bg-amber-50/50',
  emerald: 'border-emerald-200/40 bg-emerald-50/50',
  violet: 'border-violet-200/40 bg-violet-50/50',
  rose: 'border-rose-200/40 bg-rose-50/50',
}

const labelColorMap: Record<string, string> = {
  brand: 'text-[#2c4377]',
  cyan: 'text-cyan-700',
  amber: 'text-amber-700',
  emerald: 'text-emerald-700',
  violet: 'text-violet-700',
  rose: 'text-rose-700',
}

export function FiveW1HCard({ data }: { data: FiveW1H }) {
  return (
    <div className="glass-card overflow-hidden">
      <div className="border-b border-slate-100 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3d5a99]/8 text-sm">
            📐
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-slate-900">5W1H 情報設計</h3>
            <p className="text-[12px] text-slate-400">構造化された情報アーキテクチャ</p>
          </div>
        </div>
      </div>
      <div className="grid gap-px bg-slate-50 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.key} className={`p-5 bg-white border border-transparent ${colorMap[item.color]}`}>
            <div className="mb-2 flex items-center gap-2">
              <span className="text-lg">{item.icon}</span>
              <span className={`text-sm font-bold ${labelColorMap[item.color]}`}>{item.label}</span>
              <span className="text-[11px] text-slate-400">— {item.sublabel}</span>
            </div>
            <p className="text-[13px] leading-relaxed text-slate-600">
              {data[item.key]}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
