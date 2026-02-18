'use client'

import { motion } from './motion'
import { Badge } from './Badge'
import { ScoreBar } from './ScoreBar'
import type { Highlight } from '@/hooks/useMarketData'

interface HighlightsTableProps {
  highlights: Highlight[] | undefined
  loading: boolean
}

export function HighlightsTable({ highlights, loading }: HighlightsTableProps) {
  if (loading && !highlights) {
    return <LoadingSkeleton />
  }

  if (!highlights || highlights.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <p className="text-sm text-slate-400">データなし</p>
      </div>
    )
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="premium-table w-full text-left">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="px-6 py-4 text-[11px] font-semibold tracking-widest text-slate-400 uppercase">
                タイトル
              </th>
              <th className="hidden px-6 py-4 text-[11px] font-semibold tracking-widest text-slate-400 uppercase sm:table-cell">
                カテゴリ
              </th>
              <th className="px-6 py-4 text-[11px] font-semibold tracking-widest text-slate-400 uppercase">
                スコア
              </th>
              <th className="px-6 py-4 text-right text-[11px] font-semibold tracking-widest text-slate-400 uppercase">
                変動
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {highlights.map((h, i) => (
              <motion.tr
                key={h.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.3 + i * 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="group cursor-default transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-slate-50 text-sm font-medium text-slate-400 transition-colors group-hover:bg-[#3d5a99]/8 group-hover:text-[#3d5a99]">
                      {i + 1}
                    </div>
                    <span className="text-[14px] font-medium text-slate-700 transition-colors group-hover:text-slate-900">
                      {h.title}
                    </span>
                  </div>
                </td>
                <td className="hidden px-6 py-4 sm:table-cell">
                  <Badge variant="ghost" size="md">{h.category}</Badge>
                </td>
                <td className="w-44 px-6 py-4">
                  <ScoreBar score={h.score} variant="brand" size="sm" />
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>
                    {h.change}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ── Skeleton ── */
function LoadingSkeleton() {
  return (
    <div className="glass-card overflow-hidden p-6">
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-lg bg-slate-100 shimmer" />
            <div className="h-4 flex-1 rounded bg-slate-100 shimmer" />
            <div className="h-4 w-20 rounded bg-slate-100 shimmer" />
          </div>
        ))}
      </div>
    </div>
  )
}
