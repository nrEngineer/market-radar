'use client'

import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'market-radar-dashboard-settings'

export interface DashboardCardConfig {
  id: string
  label: string
  visible: boolean
}

const DEFAULT_CARDS: DashboardCardConfig[] = [
  { id: 'metrics', label: 'キーメトリクス', visible: true },
  { id: 'insights', label: 'AI市場インサイト', visible: true },
  { id: 'trends', label: 'トレンドハイライト', visible: true },
  { id: 'opportunities', label: 'トップ機会', visible: true },
  { id: 'topics', label: 'トレンドトピック', visible: true },
  { id: 'categories', label: 'カテゴリ成長', visible: true },
  { id: 'sources', label: 'データソース', visible: true },
  { id: 'fivew1h', label: '5W1H', visible: true },
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
