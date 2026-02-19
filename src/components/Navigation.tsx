'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { navItems } from '@/data'

export function Navigation() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Desktop Navigation Bar */}
      <nav aria-label="メインナビゲーション" className="hidden lg:block border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-hide">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-[#2c4377]'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-sm">{item.icon}</span>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                      item.badge === 'NEW'
                        ? 'bg-[#3d5a99]/10 text-[#3d5a99]'
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-[#2c4377] to-[#3d5a99]"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'ナビゲーションメニューを閉じる' : 'ナビゲーションメニューを開く'}
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2c4377] text-white shadow-lg shadow-[#2c4377]/20 transition-transform active:scale-95"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              role="dialog"
              aria-modal="true"
              aria-label="ナビゲーションメニュー"
              className="fixed inset-x-0 bottom-0 z-40 rounded-t-3xl border-t border-slate-200 bg-white p-6 pb-24 lg:hidden"
            >
              <div className="mb-4 flex justify-center">
                <div className="h-1 w-12 rounded-full bg-slate-200" />
              </div>
              <p className="mb-4 text-sm font-semibold text-slate-500">ナビゲーション</p>
              <div className="grid grid-cols-2 gap-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-[#3d5a99]/8 text-[#2c4377] border border-[#3d5a99]/15'
                          : 'bg-slate-50 text-slate-600 border border-slate-100 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
