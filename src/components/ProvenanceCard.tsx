'use client'

import type { DataProvenance } from '@/lib/types'
import { ScoreBar } from './ScoreBar'

export function ProvenanceCard({ data }: { data: DataProvenance }) {
  return (
    <div className="glass-card overflow-hidden">
      <div className="border-b border-slate-100 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-sm">
            🔍
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-slate-900">データソース & 品質</h3>
            <p className="text-[12px] text-slate-400">ファクトベース — 情報の出典と品質指標</p>
          </div>
          <div className="ml-auto">
            <span className="rounded-full bg-emerald-50 border border-emerald-200/60 px-3 py-1 text-[12px] font-semibold text-emerald-700">
              信頼度 {data.confidenceScore}%
            </span>
          </div>
        </div>
      </div>

      {/* Quality Indicators */}
      <div className="grid grid-cols-2 gap-4 border-b border-slate-100 p-6 sm:grid-cols-4">
        {[
          { label: '完全性', value: data.qualityIndicators.completeness, color: 'brand' as const },
          { label: '正確性', value: data.qualityIndicators.accuracy, color: 'emerald' as const },
          { label: '適時性', value: data.qualityIndicators.timeliness, color: 'brand' as const },
          { label: '一貫性', value: data.qualityIndicators.consistency, color: 'emerald' as const },
        ].map((q) => (
          <div key={q.label}>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{q.label}</span>
              <span className="text-[12px] font-semibold text-slate-600 tabular-nums">{q.value}%</span>
            </div>
            <ScoreBar score={q.value} showLabel={false} size="sm" variant={q.color} />
          </div>
        ))}
      </div>

      {/* Source List */}
      <div className="divide-y divide-slate-50">
        {data.sources.map((source, i) => (
          <div key={i} className="flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50/50 transition-colors">
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-[11px] font-bold ${
              source.type === 'api' ? 'bg-[#3d5a99]/8 text-[#3d5a99]' :
              source.type === 'scraping' ? 'bg-amber-50 text-amber-700' :
              source.type === 'ai-analysis' ? 'bg-violet-50 text-violet-700' :
              'bg-slate-100 text-slate-500'
            }`}>
              {source.type === 'api' ? 'API' : source.type === 'ai-analysis' ? 'AI' : source.type === 'scraping' ? 'SCR' : 'MAN'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-slate-800 truncate">{source.name}</p>
              <p className="text-[11px] text-slate-400">{source.methodology}</p>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="text-right hidden sm:block">
                <p className="text-[11px] text-slate-400">頻度</p>
                <p className="text-[12px] font-medium text-slate-600">{source.frequency}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-slate-400">信頼性</p>
                <p className={`text-[13px] font-semibold tabular-nums ${
                  source.reliability >= 90 ? 'text-emerald-600' :
                  source.reliability >= 70 ? 'text-[#3d5a99]' : 'text-amber-600'
                }`}>{source.reliability}%</p>
              </div>
              {source.sampleSize && (
                <div className="text-right hidden md:block">
                  <p className="text-[11px] text-slate-400">サンプル</p>
                  <p className="text-[12px] font-medium text-slate-600">{source.sampleSize.toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-100 px-6 py-3">
        <p className="text-[11px] text-slate-400">
          最終更新: {new Date(data.updatedAt).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}
          {data.notes && ` · ${data.notes}`}
        </p>
      </div>
    </div>
  )
}
