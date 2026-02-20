'use client'

import { useState } from 'react'
import type { DashboardCardConfig } from '@/hooks/useDashboardSettings'

interface DashboardSettingsProps {
  cards: DashboardCardConfig[]
  onToggle: (id: string) => void
  onReset: () => void
}

export function DashboardSettings({ cards, onToggle, onReset }: DashboardSettingsProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-medium text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition-all"
        title="ダッシュボード設定"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        カスタマイズ
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <h3 className="text-[15px] font-semibold text-slate-900">ダッシュボード設定</h3>
                <p className="text-[12px] text-slate-400">表示するカードを選択</p>
              </div>
              <button onClick={() => setOpen(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="divide-y divide-slate-50 px-6">
              {cards.map(card => (
                <label key={card.id} className="flex items-center justify-between py-3 cursor-pointer group">
                  <span className="text-[13px] text-slate-700 group-hover:text-slate-900">{card.label}</span>
                  <button
                    onClick={() => onToggle(card.id)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      card.visible ? 'bg-[#3d5a99]' : 'bg-slate-200'
                    }`}
                  >
                    <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform ${
                      card.visible ? 'translate-x-[18px]' : 'translate-x-[3px]'
                    }`} />
                  </button>
                </label>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 px-6 py-3">
              <button onClick={onReset} className="text-[12px] text-slate-400 hover:text-slate-600">
                デフォルトに戻す
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
