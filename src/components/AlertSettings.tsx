'use client'

import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'market-radar-alerts'

interface AlertConfig {
  id: string
  category: string
  minScore: number
  enabled: boolean
}

const DEFAULT_ALERTS: AlertConfig[] = [
  { id: 'a1', category: 'All', minScore: 80, enabled: false },
]

export function AlertSettings() {
  const [open, setOpen] = useState(false)
  const [alerts, setAlerts] = useState<AlertConfig[]>(DEFAULT_ALERTS)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setAlerts(JSON.parse(stored))
    } catch { /* ignore */ }
  }, [])

  const persist = useCallback((a: AlertConfig[]) => {
    setAlerts(a)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(a))
  }, [])

  const addAlert = () => {
    persist([...alerts, { id: `a${Date.now()}`, category: 'All', minScore: 70, enabled: true }])
  }

  const removeAlert = (id: string) => {
    persist(alerts.filter(a => a.id !== id))
  }

  const updateAlert = (id: string, patch: Partial<AlertConfig>) => {
    persist(alerts.map(a => a.id === id ? { ...a, ...patch } : a))
  }

  const enabledCount = alerts.filter(a => a.enabled).length

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-medium text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition-all"
        title="アラート設定"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        アラート
        {enabledCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#3d5a99] text-[9px] font-bold text-white">
            {enabledCount}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <h3 className="text-[15px] font-semibold text-slate-900">アラート設定</h3>
                <p className="text-[12px] text-slate-400">条件に合う機会が追加されたときに通知（データ更新連携後に有効）</p>
              </div>
              <button onClick={() => setOpen(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto px-6 py-4 space-y-3">
              {alerts.map(alert => (
                <div key={alert.id} className={`rounded-xl border p-4 transition-colors ${alert.enabled ? 'border-[#3d5a99]/30 bg-[#3d5a99]/5' : 'border-slate-100 bg-slate-50'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <button
                      onClick={() => updateAlert(alert.id, { enabled: !alert.enabled })}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${alert.enabled ? 'bg-[#3d5a99]' : 'bg-slate-200'}`}
                    >
                      <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform ${alert.enabled ? 'translate-x-[18px]' : 'translate-x-[3px]'}`} />
                    </button>
                    <button onClick={() => removeAlert(alert.id)} className="text-slate-300 hover:text-rose-500">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-medium text-slate-500">カテゴリ</label>
                      <select
                        value={alert.category}
                        onChange={e => updateAlert(alert.id, { category: e.target.value })}
                        className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[12px] text-slate-700 focus:border-[#3d5a99] focus:outline-none"
                      >
                        <option value="All">全カテゴリ</option>
                        <option value="Mobile App">Mobile App</option>
                        <option value="SaaS">SaaS</option>
                        <option value="API Service">API Service</option>
                        <option value="Marketplace">Marketplace</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-slate-500">最低スコア</label>
                      <div className="mt-1 flex items-center gap-2">
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={alert.minScore}
                          onChange={e => updateAlert(alert.id, { minScore: Number(e.target.value) })}
                          className="flex-1 accent-[#3d5a99]"
                        />
                        <span className="text-[13px] font-semibold text-[#3d5a99] w-8 text-right tabular-nums">{alert.minScore}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {alerts.length === 0 && (
                <div className="py-8 text-center text-[13px] text-slate-400">
                  アラートが設定されていません
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 px-6 py-3">
              <button onClick={addAlert} className="inline-flex items-center gap-1 text-[12px] font-medium text-[#3d5a99] hover:text-[#2c4377]">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                アラート追加
              </button>
              <button onClick={() => setOpen(false)} className="rounded-lg bg-[#3d5a99] px-4 py-1.5 text-[12px] font-medium text-white hover:bg-[#2c4377]">
                完了
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
