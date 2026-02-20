'use client'

import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'market-radar-dashboard-settings'

export interface DashboardCardConfig {
  id: string
  label: string
  visible: boolean
}

const DEFAULT_CARDS: DashboardCardConfig[] = [
  { id: 'fiveW1H', label: '5W1H 概要', visible: true },
  { id: 'metrics', label: 'キーメトリクス', visible: true },
  { id: 'insights', label: 'AI インサイト', visible: true },
  { id: 'highlights', label: '注目プロダクト', visible: true },
  { id: 'opportunities', label: '事業機会 Top 3', visible: true },
  { id: 'trends', label: '急上昇トレンド', visible: true },
  { id: 'categories', label: 'カテゴリ別成長率', visible: true },
  { id: 'liveSignals', label: 'ライブ市場シグナル', visible: true },
  { id: 'dataSources', label: 'データ収集状況', visible: true },
  { id: 'provenance', label: 'データ来歴', visible: true },
]

export function useDashboardSettings() {
  const [cards, setCards] = useState<DashboardCardConfig[]>(DEFAULT_CARDS)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as DashboardCardConfig[]
        // Merge with defaults to handle new cards added after initial save
        const merged = DEFAULT_CARDS.map(d => {
          const saved = parsed.find(p => p.id === d.id)
          return saved ? { ...d, visible: saved.visible } : d
        })
        setCards(merged)
      }
    } catch {
      // ignore
    }
  }, [])

  const toggleCard = useCallback((id: string) => {
    setCards(prev => {
      const next = prev.map(c => c.id === id ? { ...c, visible: !c.visible } : c)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const isVisible = useCallback((id: string) => {
    return cards.find(c => c.id === id)?.visible ?? true
  }, [cards])

  const resetAll = useCallback(() => {
    setCards(DEFAULT_CARDS)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return { cards, toggleCard, isVisible, resetAll }
}
