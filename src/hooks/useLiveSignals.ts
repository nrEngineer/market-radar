'use client'

import { useState, useEffect, useCallback } from 'react'

export interface TechSignal {
  title: string
  score: number
  url: string
  source: string
  category: string
}

export interface AppSignal {
  name: string
  category: string
  rating: number
  price: string
  source: string
}

export interface HotCategory {
  category: string
  count: number
}

export interface LiveSignalsData {
  timestamp: string
  sources: {
    hackerNews: { status: string; items: number }
    appStore: { status: string; items: number }
  }
  techSignals: TechSignal[]
  appSignals: AppSignal[]
  hotCategories: HotCategory[]
  totalDataPoints: number
}

export function useLiveSignals() {
  const [data, setData] = useState<LiveSignalsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSignals = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/live-signals', { signal })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    fetchSignals(controller.signal)
    return () => controller.abort()
  }, [fetchSignals])

  return { data, loading, error, refetch: () => fetchSignals() }
}
