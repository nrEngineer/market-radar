'use client'

import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'market-radar-watchlist'

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<string[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setWatchlist(JSON.parse(stored))
    } catch {
      // ignore parse errors
    }
  }, [])

  const persist = useCallback((ids: string[]) => {
    setWatchlist(ids)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  }, [])

  const toggle = useCallback((id: string) => {
    persist(
      watchlist.includes(id)
        ? watchlist.filter(w => w !== id)
        : [...watchlist, id]
    )
  }, [watchlist, persist])

  const isWatched = useCallback((id: string) => watchlist.includes(id), [watchlist])

  const clear = useCallback(() => persist([]), [persist])

  return { watchlist, toggle, isWatched, clear, count: watchlist.length }
}
