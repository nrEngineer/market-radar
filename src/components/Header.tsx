'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface HeaderProps {
  loading: boolean
  onRefresh: () => void
}

export function Header({ loading, onRefresh }: HeaderProps) {
  const [now, setNow] = useState('')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const tick = () =>
      setNow(
        new Date().toLocaleString('ja-JP', {
          timeZone: 'Asia/Tokyo',
          hour12: false,
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      )
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-slate-200/80 bg-white/95 backdrop-blur-sm shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8">
        {/* Logo + Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#2c4377] to-[#3d5a99]">
              <svg
                className="h-5 w-5 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="2" />
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            </div>
          </div>

          <div>
            <h1 className="text-[17px] font-semibold tracking-tight text-slate-900">
              Market Radar
            </h1>
            <p className="hidden text-[11px] font-medium text-slate-400 sm:block">
              AI Market Intelligence
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Timestamp */}
          <span className="hidden text-[12px] tabular-nums text-slate-400 md:inline-block">
            {now}
          </span>

          {/* Live indicator */}
          <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 border border-emerald-200/60">
            <span className="live-dot h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-semibold tracking-wider text-emerald-700 uppercase">
              Live
            </span>
          </div>

          {/* Refresh button */}
          <button
            onClick={onRefresh}
            disabled={loading}
            className="btn-ghost group flex items-center gap-2 rounded-xl px-4 py-2 text-[13px] font-medium text-slate-600 disabled:opacity-40"
          >
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.svg
                  key="loading"
                  initial={{ opacity: 0, rotate: 0 }}
                  animate={{ opacity: 1, rotate: 360 }}
                  exit={{ opacity: 0 }}
                  transition={{ rotate: { duration: 1, repeat: Infinity, ease: 'linear' } }}
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M21 12a9 9 0 11-6.219-8.56" />
                </motion.svg>
              ) : (
                <motion.svg
                  key="refresh"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-4 w-4 transition-transform duration-300 group-hover:rotate-180"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 12a9 9 0 019-9 9.75 9.75 0 016.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 01-9 9 9.75 9.75 0 01-6.74-2.74L3 16" />
                  <path d="M3 21v-5h5" />
                </motion.svg>
              )}
            </AnimatePresence>
            <span className="hidden sm:inline">
              {loading ? '更新中…' : '更新'}
            </span>
          </button>
        </div>
      </div>
    </motion.header>
  )
}
