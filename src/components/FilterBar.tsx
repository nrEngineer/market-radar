'use client'

import { useState, useMemo } from 'react'
import type { OpportunityDetail } from '@/domain/types'

type SortKey = 'score' | 'growth' | 'revenue' | 'risk' | 'cagr'
type SortDir = 'asc' | 'desc'

interface FilterBarProps {
  opportunities: OpportunityDetail[]
  onFiltered: (filtered: OpportunityDetail[]) => void
}

const CATEGORIES = ['All', 'Mobile App', 'SaaS', 'API Service', 'Marketplace', 'Content', 'Developer Tool']
const RISK_LEVELS = ['All', 'low', 'medium', 'high']
const STATUS_OPTIONS = ['All', 'validated', 'researching', 'hypothesis']

export function FilterBar({ opportunities, onFiltered }: FilterBarProps) {
  const [category, setCategory] = useState('All')
  const [risk, setRisk] = useState('All')
  const [status, setStatus] = useState('All')
  const [sortKey, setSortKey] = useState<SortKey>('score')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    let result = [...opportunities]

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(o =>
        o.title.toLowerCase().includes(q) ||
        o.subtitle.toLowerCase().includes(q) ||
        o.category.toLowerCase().includes(q) ||
        o.tags.some(t => t.toLowerCase().includes(q))
      )
    }
    if (category !== 'All') result = result.filter(o => o.category === category)
    if (risk !== 'All') result = result.filter(o => o.risks.level === risk)
    if (status !== 'All') result = result.filter(o => o.status === status)

    result.sort((a, b) => {
      let va: number, vb: number
      switch (sortKey) {
        case 'score': va = a.scores.overall; vb = b.scores.overall; break
        case 'growth': va = a.market.sizing.cagr; vb = b.market.sizing.cagr; break
        case 'revenue': va = a.revenue.range.max; vb = b.revenue.range.max; break
        case 'risk': va = a.risks.level === 'low' ? 1 : a.risks.level === 'medium' ? 2 : 3; vb = b.risks.level === 'low' ? 1 : b.risks.level === 'medium' ? 2 : 3; break
        case 'cagr': va = a.market.sizing.cagr; vb = b.market.sizing.cagr; break
        default: va = 0; vb = 0
      }
      return sortDir === 'desc' ? vb - va : va - vb
    })

    onFiltered(result)
    return result
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opportunities, category, risk, status, sortKey, sortDir, search])

  const activeFilters = [category, risk, status].filter(f => f !== 'All').length + (search ? 1 : 0)

  return (
    <div className="mb-6 space-y-3">
      {/* Search */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="機会を検索... (タイトル、カテゴリ、タグ)"
          className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-[13px] text-slate-700 placeholder:text-slate-400 focus:border-[#3d5a99] focus:outline-none focus:ring-1 focus:ring-[#3d5a99]/30"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">フィルター</span>

        <select value={category} onChange={e => setCategory(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[12px] text-slate-600 focus:border-[#3d5a99] focus:outline-none">
          {CATEGORIES.map(c => <option key={c} value={c}>{c === 'All' ? '全カテゴリ' : c}</option>)}
        </select>

        <select value={risk} onChange={e => setRisk(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[12px] text-slate-600 focus:border-[#3d5a99] focus:outline-none">
          {RISK_LEVELS.map(r => <option key={r} value={r}>{r === 'All' ? '全リスク' : r === 'low' ? '低リスク' : r === 'medium' ? '中リスク' : '高リスク'}</option>)}
        </select>

        <select value={status} onChange={e => setStatus(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[12px] text-slate-600 focus:border-[#3d5a99] focus:outline-none">
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s === 'All' ? '全ステータス' : s === 'validated' ? '検証済み' : s === 'researching' ? '調査中' : '仮説'}</option>)}
        </select>

        <div className="h-4 w-px bg-slate-200" />

        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">ソート</span>

        <select value={sortKey} onChange={e => setSortKey(e.target.value as SortKey)} className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[12px] text-slate-600 focus:border-[#3d5a99] focus:outline-none">
          <option value="score">スコア</option>
          <option value="growth">成長率</option>
          <option value="revenue">収益</option>
          <option value="risk">リスク</option>
          <option value="cagr">CAGR</option>
        </select>

        <button
          onClick={() => setSortDir(d => d === 'desc' ? 'asc' : 'desc')}
          className="rounded-lg border border-slate-200 bg-white p-1 text-slate-500 hover:bg-slate-50"
          title={sortDir === 'desc' ? '降順' : '昇順'}
        >
          <svg className={`h-4 w-4 transition-transform ${sortDir === 'asc' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {activeFilters > 0 && (
          <>
            <div className="h-4 w-px bg-slate-200" />
            <button
              onClick={() => { setCategory('All'); setRisk('All'); setStatus('All'); setSearch('') }}
              className="rounded-lg bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-500 hover:bg-slate-200"
            >
              {activeFilters}件のフィルターをリセット
            </button>
          </>
        )}

        <div className="ml-auto text-[12px] text-slate-400">
          {filtered.length}件
        </div>
      </div>
    </div>
  )
}
