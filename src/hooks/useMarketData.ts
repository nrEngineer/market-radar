'use client'

import { useState, useEffect } from 'react'

export interface MarketStats {
  totalApps: number
  totalWebServices: number
  opportunities: number
  avgRevenue: number
}

export interface Highlight {
  id: number
  title: string
  category: string
  score: number
  change: string
}

export interface Category {
  name: string
  apps: number
  growth: string
}

export interface MarketData {
  lastUpdate: string
  stats: MarketStats
  highlights: Highlight[]
  categories: Category[]
}

export function useMarketData() {
  const [data, setData] = useState<MarketData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async (signal?: AbortSignal) => {
    try {
      setLoading(true)
      const response = await fetch('/api/data', { signal })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      setData(result)
      setError(null)
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    fetchData(controller.signal)
    const interval = setInterval(() => fetchData(controller.signal), 3 * 60 * 1000)
    return () => {
      controller.abort()
      clearInterval(interval)
    }
  }, [])

  return { data, loading, error, refetch: () => fetchData() }
}
